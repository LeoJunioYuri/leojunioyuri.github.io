---
title: "I gave ten agents memory. I could prove one answer."
description: "How memory became the default for every AI agent at Brendi, what I learned by keeping less, and what happened when I measured whether it improved anything."
date: 2026-11-05
lang: "en"
category: "ia"
draft: false
tags: ["AI", "Agents", "Engineering", "Data", "Lessons"]
translationOf: "pt/memoria-em-dez-agentes"
---

At Brendi, a delivery platform for restaurants, owners talk to several AI agents. Anderson runs the ads, Kleber the social media, Fred the management side, Gabriel the menu, and so on. There are ten today.

In one week, memory became the default for all of them. I wanted to open this post saying the agents got better. I measured before writing. **I can't say that.** I can show the engineering, which worked, and a single answer I can prove depended on memory.

This post is about both.

---

## The problem

An owner tells an agent the store doesn't open on Mondays. The next week, the agent suggests something for Monday. Anyone who has dealt with a support rep asking for the same details three times knows what that does to trust.

The idea wasn't new. In April, João Vitor built the first memory system, for Fred: an extractor that ran after the conversation and a table of facts per store. In July I extended that extractor to Anderson, and in October Rogério extended it to Kleber. But each agent drifted its own way: three sets of rules, three tables. The other agents kept nothing. And the owner had no way to see what each agent knew about their store.

At the end of October, I asked Rogério to migrate that extractor into our agent kit, and he made it generic: after each message, outside the conversation, a task reads what the owner wrote and decides whether there is a fact to keep. The rest was missing: a default place to keep it, the lookup at answer time, a screen for the owner, and a single answer for when a fact changes.

I took the proposal to our weekly engineering meeting and the team agreed. These are the decisions that taught me the most.

## Keeping less

The first surprise was that the old system kept too much.

I took 278 real messages to Anderson. The old extractor had kept 34 facts from them. I read each one: 14 were action requests ("pause the ads"), 4 were copies and 2 were menu prices, which the system already knows. An action request isn't a fact about the store. It's a task. If it becomes memory, the agent starts "remembering" an order that was already carried out.

I ran the new prompt on the same 278 messages: 11 facts. The stricter bar also lost good things: two useful facts were left out. I took the trade. Wrong memory costs more than missing memory, because the owner doesn't know it's there.

In the first week with every agent, the funnel looked like this:

| Step (Oct 30 to Nov 5) | Count |
|---|---|
| Messages seen by the extractor | 5,887 |
| Stopped by a free filter, before the model (too short or only questions) | 2,786 (47%) |
| Sent to the model | 3,101 |
| Facts proposed | 239 |
| Rejected when checked against the owner's words | 75 (31%) |
| Saved | 164 |

One fact saved for every 36 messages, and no extraction failures in the period. Nine of the ten agents saved something. The exception was Brenda, with zero in 39 messages.

That 31% is the rule I like most. Every fact must come with a literal quote of what the owner wrote, and the code checks that the quote really exists. That holds back hallucination. It holds back something else too: memory is an attack surface. A malicious text that becomes memory keeps influencing the agent forever. That's why an Instagram comment or a customer message never becomes memory. Only what the owner wrote.

## When a fact changes

Fred already knew how to update a fact. Anderson and Kleber didn't: they decided duplicates by similarity. If a new fact looked 0.85 or more like an old one, the new one was dropped. That sounds reasonable until the owner changes a price. Two texts of the same combo, with different prices, scored 0.965. The new price vanished and the agent kept the old one.

Similarity measures whether two texts talk about the same thing. It doesn't measure which one is true now.

The fix was to bring into the kit what Fred already did: let the model decide. It already sees the similar facts, so it answers "this is new" or "this replaces number such-and-such". The old fact isn't deleted: it gets an end date and points to the new one. Of the week's 164 facts, 24 (15%) replaced an earlier one. Facts changing is not a rare case.

## The index nobody used

Agent memory seems to call for vector search with an index. I looked at the table we already had: the vector index took about 500 MB, almost half of it. It had been used **zero times** in a month.

It makes sense. The lookup is always inside one store, and the store with the most memories had 125 rows. Reading them all and comparing takes under 2 ms, and the result is exact. The new table was born without a vector index, with just a regular index on agent and store.

## A default is what the compiler enforces

That left making this hold for the agents that had no memory yet, and for the ones that didn't exist. The first idea was to let each lead decide. The request that came back was simpler: if it's in the kit, it's the default everywhere.

An agreement like that lasts until the next agent is created in a hurry. So the rule went into the type:

```ts
type AgentDefinition = {
  // ...
  memory: AgentMemory | { off: string };
};
```

The field is required. Either the agent says what is worth keeping, or it writes down why not. Forget it and it doesn't compile. Turning memory on became a short list, in Portuguese, of what to keep and what never to keep. For Hugo, in logistics, "delivery time doubles when it rains" counts. A registered courier doesn't, because he already reads that from the data.

The rule landed on October 30. On November 1 a new finance agent arrived, Finn. It came with memory, in the same format. Without it, or a written reason, it wouldn't even compile. That was my favorite result of the whole week.

## Then I measured

We have an automatic grade for each agent answer: did it resolve what the owner asked? I compared answers with some memory available against answers with none, on the kit's agents, leaving out Anderson, who already had memory before. The grade has existed since November 2.

| Comparison | "Resolved" | Answers |
|---|---|---|
| With memory available | 56.6% | 235 |
| Without memory | 62.0% | 987 |
| Same store, before its first memory | 59.6% | 94 |
| Same store, after | 55.3% | 141 |

No improvement. That doesn't prove it got worse either: stores with memory are the most engaged ones, asking harder things, and the same-store comparison has only 29 store-and-agent pairs. What I can claim is small: the effect, if there is one, didn't show up in a week.

About the owners, I know even less. The "What I remember" screen is in the app and the dashboard, and **I don't know how many people opened it**. I didn't put an event on it. All I know is that nobody has used "forget" so far. I shipped the screen without measuring the screen.

## The mistake that almost made it into this post

If the average doesn't show it, I thought, at least I'll show good examples. I searched for answers touching a remembered fact. Of the 235, 29 seemed to. I read them all: in 15 the fact had really been used. I set aside 8 that seemed to depend on memory, and I already had the perfect example: Fred recommending "repeat purchases, without message blasts" to an owner who, in September, had asked for no message campaigns.

Before writing it, I looked at the whole conversation. It had 15 messages.

The model always receives the last 30. The September request was right there, in the history. Fred would have gotten it right with no memory at all. I reran the test on the 8 cases, and in all 8 the fact was in the last 30 messages. I was giving memory the credit that belonged to the history.

One answer was left. In August, an owner said free-delivery coupons were eating their margin. In early November, they asked how to sell more. Fred answered (translated):

> Since your margin is already tight with free delivery, I wouldn't start with another coupon.

The August conversation was already outside the last 30 messages. Nothing there said this. That's the answer I can defend, and even that is an inference: the system doesn't record which memories went into each answer. One answer, from one store.

Looking at it now, it shows what memory is for. Without it, Fred had no way of knowing about a complaint from three months earlier, and a coupon was a natural suggestion. A short conversation doesn't need memory, because the history already covers it. Memory only works once the conversation gets long or time passes. And one week after turning it on is the worst moment to see that.

## What I'd do differently

- **Record what went into the answer.** Without knowing which memories the model received, every example is archaeology.
- **Add the event before shipping the screen.** It's one line of code, and now it's an unanswered question.
- **Compare against the history, not against nothing.** The right question was never "did the agent use the fact?". It was "would it have used it without memory?".
- **Plan the test along with the feature.** A comparison after launch only measures who the engaged customers are. The next step is what [Anderson already does](/en/writing/the-draw-came-out-crooked): turn it on and off per store, randomized, with the reading rule written beforehand.

Memory is live on all ten agents. I still don't know how much it's worth. When the test runs, I'll come back with the number, even if it's zero.
