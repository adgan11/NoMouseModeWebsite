# Manual Steps Guide

> These are the steps that require human action — account creation, domain verification, external submissions, and ongoing monitoring. Your AI agent can't do these for you, but this guide makes each one straightforward.

Work through these alongside or after the AI implementation. Estimated total time: **2–3 hours** for initial setup, then **30 min/week** for ongoing monitoring.

---

## Table of Contents

1. [Google Search Console Setup](#1-google-search-console-setup)
2. [Bing Webmaster Tools Setup](#2-bing-webmaster-tools-setup)
3. [Sitemap Submission](#3-sitemap-submission)
4. [IndexNow API Key Setup](#4-indexnow-api-key-setup)
5. [Analytics & AI Traffic Tracking](#5-analytics--ai-traffic-tracking)
6. [Schema Validation](#6-schema-validation)
7. [AI Crawler Access Verification](#7-ai-crawler-access-verification)
8. [Brand Entity Building](#8-brand-entity-building)
9. [AI Citation Monitoring](#9-ai-citation-monitoring)
10. [Ongoing Maintenance Schedule](#10-ongoing-maintenance-schedule)

---

## 1. Google Search Console Setup

**Time:** 15 min · **Impact:** Critical · **Frequency:** One-time

Google Search Console (GSC) is how Google communicates with you about your site's search presence. Without it, you're flying blind.

### Steps

- [ ] **Go to** [search.google.com/search-console](https://search.google.com/search-console)
- [ ] **Sign in** with your Google account (use the account that will manage the site long-term)
- [ ] **Click "Add Property"**
- [ ] **Choose "Domain" verification** (recommended — covers all subdomains, protocols, and paths)
  - Enter your domain without `https://` or `www` — just `yourdomain.com`
  - Google will give you a TXT record to add to your DNS
- [ ] **Add the DNS TXT record:**
  - Go to your domain registrar or DNS provider (Cloudflare, Namecheap, GoDaddy, Route 53, etc.)
  - Add a new TXT record:
    - **Host/Name:** `@` (or leave blank, depending on provider)
    - **Value:** The verification string Google gave you (starts with `google-site-verification=`)
    - **TTL:** Auto or 3600
  - Save and wait 5–15 minutes for DNS propagation
- [ ] **Return to GSC and click "Verify"**
- [ ] **Once verified**, you'll see the GSC dashboard

### What to check after verification

- **URL Inspection tool** — Paste your homepage URL. It should show "URL is on Google" (or "URL is not on Google" if brand new). Request indexing if not indexed.
- **Coverage/Pages report** — Shows how many pages Google has indexed. Check for errors.
- **Sitemaps** — Submit your sitemap here (see Step 3).

---

## 2. Bing Webmaster Tools Setup

**Time:** 15 min · **Impact:** High · **Frequency:** One-time

Bing powers DuckDuckGo, Yahoo, and feeds data to several AI systems. It's also where you get your IndexNow API key.

### Steps

- [ ] **Go to** [bing.com/webmasters](https://www.bing.com/webmasters)
- [ ] **Sign in** with a Microsoft, Google, or Facebook account
- [ ] **Add your site** — enter `https://yourdomain.com`
- [ ] **Choose verification method** (options):
  - **Import from GSC** (easiest — if you already set up Google Search Console)
  - **DNS CNAME record** — add a CNAME record to your DNS
  - **XML file** — upload a verification XML file to your site root
  - **Meta tag** — add a `<meta>` tag to your homepage
- [ ] **Complete verification**

### After verification

- You'll have access to Bing's dashboard showing indexing status, crawl data, and search performance
- This is also where you'll generate your **IndexNow API key** (Step 4)

---

## 3. Sitemap Submission

**Time:** 5 min · **Impact:** High · **Frequency:** One-time (re-submit after major changes)

Submit your sitemap to both Google and Bing so they know about all your pages immediately.

### Google Search Console

- [ ] In GSC, go to **"Sitemaps"** in the left sidebar
- [ ] Enter your sitemap URL: `https://yourdomain.com/sitemap.xml`
- [ ] Click **"Submit"**
- [ ] Status should change to "Success" within a few minutes to hours
- [ ] Check the "Discovered URLs" count matches your expected page count

### Bing Webmaster Tools

- [ ] In Bing Webmaster Tools, go to **"Sitemaps"**
- [ ] Enter your sitemap URL: `https://yourdomain.com/sitemap.xml`
- [ ] Click **"Submit"**
- [ ] Bing will begin processing the sitemap

### Verification

After 24–48 hours, check:
- GSC → Sitemaps → Your sitemap shows "Success" with X URLs discovered
- GSC → Coverage → Indexed pages count is increasing
- Bing → Sitemaps → Shows submitted URLs being processed

---

## 4. IndexNow API Key Setup

**Time:** 10 min · **Impact:** Medium · **Frequency:** One-time

IndexNow lets you push URLs to Bing, DuckDuckGo, and Yandex instantly when you publish or update content.

### Steps

- [ ] **In Bing Webmaster Tools**, go to **"Settings" → "API access"** (or search for "IndexNow" in the tools)
- [ ] **Generate an API key** — Bing will provide a key string (or you can generate your own UUID)
- [ ] **Create the key verification file:**
  - Create a file named `{your-key}.txt` in your site's public/root directory
  - The file should contain only the key string itself
  - Example: If your key is `abc123def456`, create `public/abc123def456.txt` containing `abc123def456`
- [ ] **Deploy the verification file** to your live site
- [ ] **Verify:** Access `https://yourdomain.com/{your-key}.txt` in a browser — it should display your key
- [ ] **Tell your AI agent the key** so it can integrate it into the IndexNow submission script/API route

### Testing

After your AI agent implements the IndexNow submission mechanism:
- Submit your homepage URL as a test
- Check Bing Webmaster Tools → URL Submission to verify it was received

---

## 5. Analytics & AI Traffic Tracking

**Time:** 30 min · **Impact:** High · **Frequency:** One-time setup, then ongoing

You need to track how much traffic comes from AI systems separately from traditional search. Without this, you can't measure whether your AI SEO efforts are working.

### Google Analytics 4 Setup

If you don't already have GA4:
- [ ] Go to [analytics.google.com](https://analytics.google.com)
- [ ] Create a property for your domain
- [ ] Add the GA4 tracking script to your site (your AI agent can help with this)

### AI Traffic Channel Configuration in GA4

AI referral traffic comes from specific domains. Set up a custom channel to track them:

- [ ] In GA4, go to **Admin → Data display → Channel groups**
- [ ] Click **"Create new channel group"** (or edit the default)
- [ ] Create a new channel called **"AI Referral"** with these source conditions:

**Source matches ANY of:**
```
chat.openai.com
chatgpt.com
perplexity.ai
claude.ai
gemini.google.com
copilot.microsoft.com
you.com
phind.com
poe.com
meta.ai
```

**How to add these:**
- Rule type: "Source" → "matches regex"
- Pattern: `chat\.openai\.com|chatgpt\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|you\.com|phind\.com|poe\.com|meta\.ai`

### Alternative: Plausible Analytics

If you use Plausible (privacy-focused alternative):
- AI referral tracking is automatic — Plausible shows referrer domains in the dashboard
- Filter by source containing "openai", "perplexity", "claude", "gemini"

### Alternative: Simple Referrer Logging

If you don't use any analytics platform, your AI agent can implement a lightweight referrer check:
```javascript
// Detect AI referrals from document.referrer
const AI_REFERRERS = [
  'chat.openai.com', 'chatgpt.com', 'perplexity.ai', 'claude.ai',
  'gemini.google.com', 'copilot.microsoft.com', 'you.com', 'phind.com'
];
const referrer = new URL(document.referrer || '').hostname;
if (AI_REFERRERS.some(r => referrer.includes(r))) {
  // Log as AI referral
}
```

### What to Track Monthly

- [ ] Total AI referral sessions (from the custom channel)
- [ ] AI referral conversion rate vs organic search conversion rate
- [ ] Which AI platforms send the most traffic (ChatGPT vs Perplexity vs Claude etc.)
- [ ] Which pages get the most AI referral traffic (indicates what AI is recommending)
- [ ] Trend: Is AI traffic growing month-over-month?

---

## 6. Schema Validation

**Time:** 15 min · **Impact:** High · **Frequency:** After implementation, then after major changes

Validate that your structured data is error-free and eligible for rich results.

### Google Rich Results Test

- [ ] Go to [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- [ ] Test these pages:
  - [ ] Homepage
  - [ ] A blog post
  - [ ] Pricing page
  - [ ] A comparison or feature page
  - [ ] Any page with FAQ schema
- [ ] For each: paste the URL and click "Test URL"
- [ ] Check for:
  - **Zero errors** (any error means that schema won't generate rich results)
  - **Zero warnings** (warnings don't block rich results but should be fixed)
  - **Detected structured data** list matches what you implemented (FAQ, Organization, BreadcrumbList, etc.)

### Schema.org Validator

- [ ] Go to [validator.schema.org](https://validator.schema.org)
- [ ] Paste your JSON-LD directly to check for syntax errors

### Common Issues to Watch For

| Issue | How to spot | Fix |
|-------|-------------|-----|
| Invalid date format | Error on `datePublished` or `dateModified` | Use ISO 8601: `2026-03-22` or `2026-03-22T00:00:00Z` |
| Missing required field | Warning showing "missing field X" | Add the required field to your schema |
| Invalid URL | Error on `url` or `item` fields | Use absolute URLs starting with `https://` |
| Duplicate FAQ questions | Two pages with identical FAQ content | Make every FAQ unique per page |
| BreadcrumbList last item has URL | Warning or display issue | Remove `item` from the last BreadcrumbList entry |

---

## 7. AI Crawler Access Verification

**Time:** 10 min · **Impact:** Critical · **Frequency:** After robots.txt changes

Verify that AI crawlers can actually access your site.

### Test robots.txt

- [ ] Visit `https://yourdomain.com/robots.txt` in a browser
- [ ] Verify it loads correctly and shows your rules
- [ ] Check that no AI crawlers are in `Disallow` rules
- [ ] Check the `Sitemap:` URL is absolute and correct

### Google Search Console robots.txt Tester

- [ ] In GSC, go to **Settings → Crawling → robots.txt** (or use the URL Inspection tool)
- [ ] Test specific user agents to verify they're allowed

### Test AI File Access

- [ ] Visit `https://yourdomain.com/llms.txt` — should return markdown content
- [ ] Visit `https://yourdomain.com/ai.txt` — should return key-value content
- [ ] Visit `https://yourdomain.com/llms-full.txt` — should return comprehensive markdown
- [ ] View page source of homepage — verify `<link rel="alternate">` tags for each file are in `<head>`

### HTTP Header Check

- [ ] In terminal, run: `curl -I https://yourdomain.com/`
- [ ] Look for the `Link:` header in the response — it should reference `/llms.txt` and `/ai.txt`
- [ ] If missing, the HTTP header configuration needs fixing (ask your AI agent)

---

## 8. Brand Entity Building

**Time:** 1–2 hours · **Impact:** High (long-term) · **Frequency:** One-time, then maintain

AI systems don't just index your website — they build an understanding of your brand as an **entity** from information across the entire web. The more places your brand appears with consistent information, the more likely AI will know about you and recommend you.

### Create Profiles On

- [ ] **Crunchbase** — [crunchbase.com](https://crunchbase.com)
  - Create a company profile with description, founding date, team, product info
  - Crunchbase data is used by many AI training datasets

- [ ] **Product Hunt** — [producthunt.com](https://producthunt.com)
  - Launch or list your product
  - Product Hunt listings appear in AI training data and are frequently cited

- [ ] **G2** — [g2.com](https://g2.com)
  - Create a product listing
  - G2 reviews are heavily cited by AI when recommending tools

- [ ] **AlternativeTo** — [alternativeto.net](https://alternativeto.net)
  - List your product and mark alternatives
  - AI systems use this data when answering "What's a good alternative to X?"

- [ ] **GitHub** — If applicable, have a public presence (open-source tools, docs)

- [ ] **LinkedIn Company Page** — Complete with description, employees, industry
  - Link from Organization schema `sameAs`

- [ ] **Twitter/X** — Active account with consistent branding
  - Link from Organization schema `sameAs`

- [ ] **Wikipedia** — If notable enough, a Wikipedia article is the single strongest entity signal
  - Note: Wikipedia has strict notability guidelines. Don't create a page unless your company/product genuinely meets their criteria.

### Consistency Rules

Across all profiles, ensure:
- **Same brand name** everywhere (exact spelling, same capitalization)
- **Same description** (or close variations)
- **Same URL** pointing to your domain
- **Same founding date/year**
- **Same product category**

Inconsistency confuses AI systems and dilutes your entity signal.

---

## 9. AI Citation Monitoring

**Time:** 20 min/week · **Impact:** Critical for measuring ROI · **Frequency:** Weekly

You need to know whether AI systems are actually recommending your product. There are two approaches: manual testing and automated tools.

### Manual Testing (Free — Do This Weekly)

Test these prompts across multiple AI platforms every week:

**Platforms to test on:**
- [ ] ChatGPT (chat.openai.com)
- [ ] Claude (claude.ai)
- [ ] Perplexity (perplexity.ai)
- [ ] Gemini (gemini.google.com)
- [ ] Microsoft Copilot (copilot.microsoft.com)

**Prompts to test (adapt to your product category):**

```
"What is the best {your product category}?"
"What are the top {product category} tools in 2026?"
"What's a good alternative to {your biggest competitor}?"
"{Your brand name} vs {competitor} — which is better?"
"How do I {primary use case your product solves}?"
"What {product category} do you recommend for {target audience}?"
"Is {your brand name} good? What are the pros and cons?"
```

**What to record:**
- Does the AI mention your brand? (Yes/No)
- What position? (First recommendation, mentioned in a list, or not at all)
- Is the information accurate? (Correct pricing, features, URL)
- Does it link to your site? (Perplexity often includes source links)
- What competitors are mentioned alongside you?

### Track in a Spreadsheet

Create a simple tracking sheet:

| Date | Platform | Prompt | Brand Mentioned? | Position | Accurate? | Notes |
|------|----------|--------|-------------------|----------|-----------|-------|
| 2026-03-30 | ChatGPT | "Best X tools" | Yes | #2 in list | Yes | Correct pricing, linked |
| 2026-03-30 | Claude | "Best X tools" | No | — | — | Competitor Y mentioned instead |

### Automated Tools (Paid)

If you want to scale monitoring:

- **[Otterly.ai](https://otterly.ai)** — Tracks AI mentions of your brand across ChatGPT, Claude, Perplexity, Gemini. Alerts on changes.
- **[Profound](https://profound.ai)** — AI search visibility monitoring.
- **[LLMrefs](https://llmrefs.com)** — Tracks which LLMs reference your site.
- **[Scrunch AI](https://scrunch.ai)** — Brand monitoring across AI platforms.

These tools automate the manual testing process and provide trend data over time.

---

## 10. Ongoing Maintenance Schedule

### Weekly (30 min total)

- [ ] **AI citation check** — Test 2–3 prompts across ChatGPT, Claude, Perplexity (10 min)
- [ ] **Check AI referral traffic** — Review analytics for AI-referred sessions (5 min)
- [ ] **IndexNow submission** — Submit any new or updated URLs (5 min, or automate)
- [ ] **Content freshness** — Update "Last updated" dates on any pages you've edited (5 min)
- [ ] **Update llms.txt** — Add any new pages published this week (5 min)

### Monthly (1 hour total)

- [ ] **Full analytics review** — AI traffic trends, top AI-referred pages, conversion rates (15 min)
- [ ] **Schema validation** — Re-test key pages in Google Rich Results Test (10 min)
- [ ] **Competitor check** — Test AI prompts that include competitor names, see if your brand appears (15 min)
- [ ] **Content audit** — Identify pages with outdated information or stale dates (10 min)
- [ ] **GSC review** — Check for crawl errors, new indexing issues, search performance trends (10 min)

### Quarterly (2 hours total)

- [ ] **Major content refresh** — Update cornerstone/pillar content with new data, examples, dates (1 hour)
- [ ] **llms-full.txt refresh** — Regenerate with any new features, pricing changes, content (30 min)
- [ ] **AI file review** — Update llms.txt Instructions section with any corrections needed (15 min)
- [ ] **Entity audit** — Check brand profiles (Crunchbase, G2, etc.) for accuracy (15 min)

### After Every Deploy

- [ ] **Submit new URLs to IndexNow** — Any new or updated pages
- [ ] **Update sitemap lastmod dates** — For pages with actual content changes
- [ ] **Update llms.txt** — If new page categories or pages were added
- [ ] **Test site accessibility** — Verify robots.txt, AI files, and key pages load correctly

---

## Quick Diagnostic Commands

Run these from your terminal to quickly verify your setup:

```bash
# Check robots.txt
curl -s https://yourdomain.com/robots.txt | head -50

# Check AI files exist
curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/llms.txt
curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/ai.txt
curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/llms-full.txt

# Check HTTP headers for AI file links
curl -sI https://yourdomain.com/ | grep -i "link:"

# Check RSS feed
curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/rss.xml

# Check sitemap
curl -s https://yourdomain.com/sitemap.xml | head -20

# Check for structured data on homepage
curl -s https://yourdomain.com/ | grep -c "application/ld+json"

# Check meta tags
curl -s https://yourdomain.com/ | grep -i "<title>"
curl -s https://yourdomain.com/ | grep -i "og:title"
curl -s https://yourdomain.com/ | grep -i "twitter:card"
```

---

## Summary: The Complete Setup Checklist

### One-Time Setup
- [ ] Google Search Console — domain verified, sitemap submitted
- [ ] Bing Webmaster Tools — domain verified, sitemap submitted
- [ ] IndexNow API key — generated, verification file deployed
- [ ] GA4 / Analytics — installed, AI traffic channel configured
- [ ] Schema validation — all key pages passing Rich Results Test
- [ ] AI file verification — llms.txt, ai.txt, llms-full.txt accessible
- [ ] robots.txt verification — AI crawlers allowed
- [ ] Brand profiles — Crunchbase, Product Hunt, G2, LinkedIn, Twitter/X
- [ ] AI citation baseline — Initial testing across all major AI platforms

### Ongoing
- [ ] Weekly: AI citation testing, traffic check, IndexNow submissions
- [ ] Monthly: Analytics review, schema re-validation, competitor monitoring
- [ ] Quarterly: Content refresh, AI file updates, entity audit
- [ ] Every deploy: IndexNow, sitemap dates, llms.txt updates

---

*This guide covers every manual step needed to complement the automated AI implementation. Work through the one-time setup first, then establish the ongoing maintenance cadence.*
