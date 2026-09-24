---
title: "Marquinho: the agent that joined our paid-traffic support group"
description: "How I built an AI agent that diagnoses stores, acts in production only after a human 'aceito', and measures its own accuracy — plus the quietest bug I've ever seen."
date: 2026-09-24
lang: "en"
category: "ia"
draft: true
tags: ["AI", "Agents", "Support", "Lessons"]
translationOf: "pt/marquinho-agente-de-suporte"
---

> **Draft.** Review internal names and numbers before publishing.

The WhatsApp support group for MetaAds at Brendi went from **~800 to ~2,000
messages a month**. And the same handful of people answered everything, me
included. Every question ("why did this store's ad stop?", "did the token
expire?", "did Anderson spend what it should this week?") meant opening logs,
running SQL, checking Sentry and looking at the ad account. The work was always
the same, and each piece depended on one specific person.

So I built Marquinho.

## What it is

Marquinho is an OpenClaw agent running on the same VM as our aíChef agent. It
works in three places:

- **Slack**, in the Meta Ads monitoring channel, when someone mentions it;
- **the WhatsApp support group**, where questions actually start;
- **daily and weekly crons**, which send reports without anyone asking.

The product's own ad-account health checks tag it when they find a problem. So
an alert arrives with someone already assigned to look into it.

## How it thinks

The persona was written to sound like a good support analyst, not a chatbot:

- **verdict first**, hypothesis while checking;
- **numbers before opinions**;
- every answer ends with a **"Pra próxima:"** ("next time:") line that teaches
  the team to solve it on their own.

Every answer has the same six blocks: **Verdict · Evidence · Cause and owner ·
Proposed fix · Message for the customer · Next time**. Readers know where to find
each thing, and the customer message is ready to paste.

## What it can do

Each capability is a small, tightly scoped skill:

| Skill | Does |
|---|---|
| `store` | finds a store by id, slug, name or owner phone |
| `diagnose` | store diagnosis: token health, weekly execution, Anderson history |
| `sql` | preset queries and free `SELECT`, with a forced `LIMIT` and credential columns blocked |
| `logs` | production logs, 7-day window max |
| `sentry` | read-only |
| `context` | searches FAQ, knowledge base, past cases and voice guide |
| `recall` / `remember` | long-term memory |
| `report` | daily and weekly reports |
| `actions` | the write path: simulate/run Anderson, re-strategize, pause/resume, reconnect, toggle ad sets and ads |

Memory started with **187 items**: 101 real cases, 45 knowledge items and 41 FAQ
answers, drawn from cases I reviewed and approved one by one.

## The rule that lets it touch production

Reading is free. Writing is not.

Every action starts as a **preview**. It only runs when a person replies, in the
thread, with the literal word **`aceito`** ("accepted"). Then it runs recording
who asked, who approved and in which conversation, and lands in an audit log. On
the backend, Marquinho has its own credential and can only reach internal admin
routes, with every action stamped with its author.

"Never write to the database" and "never apply without `aceito`" are hard rules
in the persona. But they don't rely on the persona alone: the tools themselves
enforce both.

## Real numbers

Week of Sep 7–13:

- **61 stores diagnosed**
- **32 actions executed across 30 stores**
- **52 cases**: 24 ✅, 8 ⛔, 20 pending
- **75% diagnosis accuracy** across the 32 decided cases

The week before: 17 actions, 47 cases and 92% accuracy across 24 decided. The
drop came with more volume and harder cases. Wrong cases become corrections in
memory, and that's what they're for.

## The quietest bug I've ever seen

One day Marquinho simply didn't reply to a WhatsApp message. No error, no stack
trace, no alert.

The persona file was **24,335 characters**, and the agent's bootstrap cuts at
20,000. **4,335 characters never reached the model.** Nobody noticed, because
what was left still looked like a complete persona. The lesson: in an agent, the
prompt is code. It needs a measured limit and tests, like any other code.

## What I learned

1. **A good support agent is a good analyst with narrow tools.** Each skill does
   one thing and has its own guard.
2. **Human-in-the-loop needs an explicit gesture.** An "ok" can be politeness.
   The word `aceito` is a decision.
3. **Measure accuracy from day one.** Without ✅/⛔ per case, "it seems to be
   helping" is just an impression.
4. **Teaching beats answering.** The "next time" line makes the team rely on
   Marquinho less and less.

Marquinho didn't replace anyone in the group. It took over the repetitive part
(finding the store, pulling logs, putting the diagnosis together) and left the
judgment calls to people.
