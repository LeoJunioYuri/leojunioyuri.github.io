---
title: "20 months of MetaAds: R$20M in sales and what scaling paid traffic to 2,000 restaurants taught me"
description: "An honest recap of what I built at Brendi — the results, the scaling challenges, where I learned the most, and what's next."
date: 2026-06-23
lang: "en"
category: "produto"
pinned: true
draft: true
tags: ["Engineering", "Growth", "AI", "Lessons"]
translationOf: "pt/20-meses-de-metaads"
---

> **Draft.** The real numbers are already here; anything in `[brackets]` is where
> you fill in details (dates, internal names, sensitive context) before
> publishing.

## The context

About 20 months ago I started building **MetaAds** at Brendi: an AI-automated
paid-traffic system for restaurants. The premise was simple to state and hard to
do — **a restaurant owner shouldn't need to understand paid media to grow**.

When I started, [describe the initial state: was it a manual MVP? a spreadsheet?
a hand-operated service?]. The goal was to turn that into a product.

## Where we got to (the numbers)

- **2,000+ restaurants** served by the product
- **R$4M+** in media invested and managed by the system
- **R$20M+** in sales tracked and attributed to campaigns
- [add: average ROAS? campaigns/week? % of the operation automated?]

These numbers didn't come from one feature, but from three layers that matured
together.

## What I shipped

### 1. MetaAds Platform
The product the restaurant uses: self-service onboarding, recurring billing, and
a dashboard built for the **owner**, not the media buyer.
[share one concrete challenge: e.g. cutting time-to-activation from X to Y.]

### 2. Campaign AI
The autonomous layer that **decides budget and targeting, generates creatives,
and optimizes** campaigns weekly — with no manual work.
[explain how it was before (manual) and what automation unlocked.]

### 3. Data & Attribution Layer
The source of truth: tying **every real spent to the sale it generated**. This is
what made the R$20M+ trustworthy instead of an estimate.
[explain the technical challenge of end-to-end tracking.]

## The scaling challenges

Going from [N] to 2,000+ restaurants broke things that worked fine at small
scale:

- **[Challenge 1 — e.g. Meta Marketing API rate limits]:** [what happened and how
  I solved it.]
- **[Challenge 2 — e.g. cost of running attribution across thousands of
  accounts]:** [solution.]
- **[Challenge 3 — e.g. operations/observability]:** [solution.]

## The biggest lesson: the wrong ICP

The part I'm proudest of isn't technical, it's **product**.

Cohort analysis showed we were attracting the **wrong ICP** — and it showed up as
a sky-high disable rate. Instead of optimizing acquisition, we attacked
**qualification**: we added a *fee gate* at onboarding.

The result: **churn from 50% → 4%**.

[detail: how did you spot this in the data? why did the fee gate filter for the
right ICP?]

## Where I learned the most

[list what taught you the most in this period — books, people, breaking things in
production, Meta's docs, communities. Keep it personal.]

## What's next

The next leap is making the system even more autonomous: I'm building an **AI
agent that manages clients' ads end to end** — decision, creative, and
optimization — with minimal human oversight.
[share what excites you and what's still uncertain on that path.]

---

*If you work on restaurant growth, paid traffic at scale, or applied AI agents,
[reach out on LinkedIn](https://www.linkedin.com/in/leojunioyuri/).*
