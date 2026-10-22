# AI SEO & GEO Implementation System

### Make your website visible to both search engines and AI systems — automatically.

---

## What This Is

A prompt-driven system that turns any AI coding agent into your personal SEO consultant and implementer. Give these prompts to Claude Code, Cursor, Windsurf, Copilot, or any AI coding assistant — it will analyze your website, generate a detailed audit report with scores, and then implement every fix directly in your codebase.

This system optimizes your site for **three audiences simultaneously**:

| Audience | How they find you | What this system does |
|----------|------------------|----------------------|
| **Humans** | Direct visits, referrals | Improves page structure, CTAs, content clarity |
| **Search Engines** | Google, Bing, DuckDuckGo | Metadata, structured data, sitemaps, internal linking |
| **AI Systems** | ChatGPT, Claude, Perplexity, Gemini | llms.txt, ai.txt, answer capsules, branded citations |

Traditional SEO gets you ranked on Google. **AI GEO** (Generative Engine Optimization) gets you **recommended** by ChatGPT, cited by Perplexity, and referenced by Claude. Both drive traffic. Both drive revenue. This system handles both.

---

## What's Inside

| File | Purpose | When to use |
|------|---------|-------------|
| `1-AUDIT-PROMPT.md` | Scans your site and generates a detailed report with a score out of 10 | **Start here.** Give this to your AI agent first. |
| `2-IMPLEMENTATION-PROMPT.md` | Implements every gap identified in the audit, directly in your codebase | After reviewing your audit report. |
| `3-MANUAL-STEPS-GUIDE.md` | Checklist of things that require human action (accounts, submissions, monitoring) | Alongside or after implementation. |

---

## How to Use

### Step 1 — Audit Your Site

Open your AI coding agent in your project directory and paste the contents of `1-AUDIT-PROMPT.md`. Then say:

```
Audit my website at https://yoursite.com
```

The agent will scan your site across 12 categories and produce a clean report with:
- An overall score out of 10
- Visual breakdowns per category
- Critical gaps sorted by impact
- A prioritized action plan

### Step 2 — Implement the Fixes

After reviewing the audit report, paste `2-IMPLEMENTATION-PROMPT.md` and say:

```
Implement all the gaps from the audit, starting with the highest-impact items.
```

The agent will work through each gap — creating files, editing configs, adding structured data, generating AI files, and optimizing content. It adapts to your framework automatically (Next.js, Nuxt, Astro, Remix, WordPress, static HTML, or anything else).

### Step 3 — Complete the Manual Steps

Open `3-MANUAL-STEPS-GUIDE.md` and work through the human-only checklist:
- Verify your domain in Google Search Console and Bing Webmaster Tools
- Submit your sitemap
- Set up AI traffic tracking in your analytics
- Configure ongoing monitoring

---

## Requirements

- **An AI coding agent** — Claude Code, Cursor, Windsurf, GitHub Copilot, or similar
- **Access to your codebase** — The agent needs to read and edit your project files
- **A deployed website** — The audit needs a live URL to scan (localhost works for some checks)

No specific framework required. No specific hosting required. Works with any tech stack.

---

## Why This Works

This system is built on research-backed techniques, not opinions. Every recommendation is grounded in data:

| Signal | Impact | Source |
|--------|--------|--------|
| AI-referred sessions are growing | +527% year-over-year | Previsible 2025 |
| AI referral traffic converts better | 4.4× vs traditional search | Klaviyo 2025 |
| ChatGPT referrals convert at | 5–16% vs organic 2–5% | Multiple sources |
| Perplexity referrals convert at | 10.5% vs Google's 1.76% | Onely Research |
| Pages with answer capsules get cited | 72.4% of AI-cited content | Search Engine Land |
| Comparison tables boost AI citations | 2.5× higher citation rate | Multiple sources |
| FAQ schema increases AI featuring | 60% more likely | Multiple sources |
| Named authors increase AI citations | 1.9–2.3× more | Onely Research |
| Fresh content (<30 days) gets | 3.2× more AI citations | Multiple sources |
| Structured data increases citation | 47% vs 28% without | Onely Research |

AI search is not a future trend. It's happening now. Sites that are optimized for AI systems are getting recommended to millions of users every day through ChatGPT, Perplexity, Claude, and Gemini. Sites that aren't optimized are invisible to these systems.

---

## Quick Reference

**Audit categories and max scores:**

```
Technical SEO Foundation ........... 1.00
Structured Data & Schema .......... 1.00
AI File System (llms.txt etc.) .... 1.50
AI Crawler Access ................. 1.00
Content Architecture .............. 1.00
AI Citation Readiness ............. 1.00
E-E-A-T Signals .................. 0.50
Content Freshness ................. 0.50
Internal Linking .................. 0.50
Content Depth & Clustering ........ 0.50
IndexNow / Crawl Notification ..... 0.25
RSS / Feed Discovery .............. 0.25
                                   ─────
Total ............................. 10.00
```

Most sites score **2–4 out of 10** on their first audit. After full implementation, target **8–9+**.

---

*Built from real-world implementation across production SaaS sites generating organic + AI traffic at scale. Every technique battle-tested. Every stat sourced.*
