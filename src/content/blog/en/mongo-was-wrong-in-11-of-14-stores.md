---
title: "From 100 ms to 3 ms: the index the migration forgot"
description: "The 30-day revenue that decides who gets into paid traffic came from a mirror that was losing orders. I switched the source with no fallback, the new query cost ~100 ms per call on Postgres, and an index in the right shape took that to ~3 ms."
date: 2026-10-15
lang: "en"
category: "engenharia"
draft: true
tags: ["Engineering", "Postgres", "Mongo", "Performance", "Databases", "Lessons"]
translationOf: "pt/o-mongo-estava-errado-em-11-de-14-lojas"
---

In Brendi's paid-traffic product, one number decides a lot: **how much the store
sold in the last 30 days**, counting only delivered orders and leaving out the
ones that came from external marketplaces.

That number decides whether the store can turn on paid traffic (there's a
minimum revenue), the average ticket our traffic agent uses to pick a strategy,
and the "return" figure the store owner sees on the dashboard. Three readers,
one calculation.

And that calculation ran on Mongo.

## Where it started

At Brendi, the source of truth for orders is Firestore. Mongo and Postgres are
**mirrors** of it: every order written to Firestore gets copied to both. The
30-day revenue read was the last production read still depending on the Mongo
mirror. Moving it off was what stood between us and turning Mongo off for this
use.

Before switching, I wanted to know whether the two mirrors gave the same
number. I took 14 stores (a few small ones, several of the busiest, all running
paid traffic) and computed 30-day revenue on both sides with the same filters:
Postgres straight from the read replica, Mongo through the same route
production used.

Mongo was wrong in **11 of the 14**.

- **3 small stores:** matched to the cent.
- **10 large stores:** the Mongo read returned at most **2,000 orders**, and
  that cut happened **before** the marketplace filter. A store with 8 thousand
  orders in the window ended up with just over 1,300 counted after the filter.
  Revenue showed up **as much as 4 times lower** than the real one.
- **1 store:** Postgres had 4 more orders. I checked Firestore: all 4 existed,
  delivered, with exactly the Postgres values. Mongo had simply lost those
  writes.

In every case I could verify, Postgres matched Firestore. Across the fleet, the
2,000 cap affected 28 stores active on paid traffic: large stores, seeing lower
revenue and a lower ticket than they really had.

The spot-check that was supposed to be a formality before the migration became
the argument for it.

## The switch, with no fallback

The first version of the change had the usual "safe" design: read from Postgres
behind a toggle, fall back to Mongo if something went wrong, and compare both
sources during the rollout.

After the spot-check, that stopped making sense. **A fallback to a source you
know is wrong isn't a safety net: it's a path to keep serving the wrong
number.** And comparing during the rollout would flag divergence exactly on the
stores where Postgres was more correct.

So on Aug 26 it was a hard cut:

- all three readers now use a single function that runs one aggregation on the
  Postgres orders mirror, on the read replica;
- the marketplace filter moved from JavaScript into the `WHERE`, with the same
  semantics, and no row cap;
- if the query fails, the error propagates. No silently returning zero: a zero
  would close the store's access to paid traffic.

The effect at merge went only one way: the capped stores started seeing their
correct revenue and ticket, which were higher. No store lost access. And since
this was the last production read of that Mongo mirror, turning it off for
this use was unblocked the same day.

## The side effect

Switching the source isn't free: the query cost moves somewhere else.

The next day, the new aggregation showed up in the read replica's Query
Insights at **80 to 108 ms per call**, adding up to **~313 seconds of database
time per day** (Aug 27). In the week of Sep 2 to Sep 8, it sat between **186 and
261 s/day**. Three to five minutes of database time a day, to answer a question
that, per store, involves a few hundred orders.

The reason was in the plan. The orders mirror had an index on store and an
index on date, but none covering "orders for this store, in this status, in
this date window". The planner used the store index and filtered the rest on
the table. In other words: for each store, it read **its whole lifetime** to
keep the last 30 days.

Measured on the replica, before the index: a median store read ~1,200 rows to
keep ~230; the busiest one read ~58 thousand to keep ~2,900. The work grew with
the store's age, not with the size of the answer.

## The right index

The fix had two parts, which shipped the same day (Sep 9).

**A composite index in the shape of the question**, on (store, status, order
date), partial on non-deleted orders. With it, the plan becomes an index scan
where store, status and both ends of the window are all in the index
condition. Only the marketplace filter is left to check row by row, and only
on rows that are already part of the answer.

**One shared 30-day read.** Of the three readers, only one used a cache. The
other two hit the database on every call. I moved all three onto the same
30-minute cache entry. That also closed an inconsistency: the dashboard showed
fresh revenue, the billing flow decided with the cached value, and a store
that had just crossed the minimum could show up as eligible and then get
rejected at payment time.

The production numbers, from Query Insights, on the read pool:

| | before | after |
|---|---|---|
| time per call | 80–108 ms | 2.8–3.4 ms (−97%) |
| database time per day | 186–261 s | 3–9 s |
| calls per day (Thursday) | 2,469 | 2,484 |

The last row is the one that matters for being honest about the cause. Calls
per day stayed practically the same: on a Thursday, 2,469 before and 2,484
after. So the drop in time is the **index**. The effect of the shared cache is
inconclusive: on the Thursday, calls stayed flat; on a Wednesday, they fell
48%. With this data, I can't say the cache reduced load consistently. It fixed
the inconsistency between dashboard and billing, and that already justified
the change.

From Oct 1 on, the query became too cheap to show up in Query Insights' list of
most expensive queries, which only keeps the day's top ones. Which is the best
outcome a database query can have.

The index has a cost, and it was accepted on purpose: until then no index on
that table covered status, so an order's status change (pending, confirmed,
delivered) was an in-place update that didn't touch any index. With status
indexed, every status change now writes to every index on the table. The read
gain is large and measured; the write cost is something to watch, and I don't
have an isolated number for it to show here.

## The bigger move

This switch is one piece of a bigger change: the paid-traffic module is moving
to a relational source of truth. The store data it uses is now also read from
Postgres instead of Firestore. I don't have a measured before-and-after in
production for that part, so it's here just for the record.

The next step, not done yet, is a dedicated database for the acquisition
domain. That's another post.

## What I take from it

- **Migrating is changing the source and then paying the bill at the
  destination.** The query that was "Mongo's" became a Postgres query, with its
  own cost. Sizing that is part of the migration, not a detail for later.
- **Check the number at the source you're leaving.** The spot-check that was
  just a formality showed the old source was wrong, and changed the design of
  the switch.
- **A fallback to a wrong source keeps the error alive.** A fallback is only
  safe when plan B gives the right answer.
- **The index has to have the shape of the question.** An index on the store
  column isn't enough if the question is "store, status, window". The plan
  shows how much is read to answer.
- **Prove the gain with production numbers, and separate the causes.** Two
  changes on the same day; calls per day staying flat is what tells you which
  one did the work.

## Under the hood

For anyone who wants to understand why this composite index, in this order,
solves a query like this one:

```sql
SELECT sum(total), count(*)
FROM orders
WHERE store_id = $1
  AND status = $2
  AND occurred_at >= now() - interval '30 days';
```

**A composite B-tree index is a list sorted by several columns**, like a phone
book sorted by last name, then first name. With (store, status, date), entries
are grouped by store; within the store, by status; within the status, by date.

**Equalities first, range last.** The query pins store and status with `=` and
asks for a range of dates. With the index in that order, Postgres walks down
the tree straight to "this store, this status, the first date in the window"
and reads entries in sequence until it leaves the window. Everything it reads
is the answer. If date came before status, the entries in the window would be
mixed across different statuses, and part of what it reads would be thrown
away.

**Why not a partial index on `status = 'delivered'`?** That was the first idea,
and it didn't work. The application passes status as a parameter (`$2`), and
under a generic plan Postgres can't prove `$2` is always `'delivered'`, so it
ignores the partial index. In a test on a synthetic table with 3.67 million
rows and a production-like distribution, the index partial on status came in at
14.3 ms (the same as no index); status as an index column, 0.775 ms. "Not
deleted", on the other hand, is written as a literal in the query, so that one
can be the partial predicate without trouble.

**Why the store's age stops mattering.** Without the index, the cost was
proportional to every order the store ever had. With it, it's proportional to
the delivered orders of the last 30 days: the size of the answer. The store
keeps selling, the history keeps growing, and the query doesn't get slower
because of it.
