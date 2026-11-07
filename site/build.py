#!/usr/bin/env python3
"""Static generator for nomousemode.com guide pages (adapted from the ChainYourMac site's build.py).

Sources:  site/pages/<slug>.html        (<!--meta {json} --> + article body HTML)
          site/pages/<dir>/<slug>.html  translation of a page (same format + "lang"; dirs in LANGS)
          ../NoMouseMode/CHANGELOG.md   release notes (copied to site/CHANGELOG.md so the site builds alone)
Outputs:  <slug>.html           full page (shared nav, live demo, CTA, FAQ, schema, footer)
          <dir>/<slug>.html     translated page (no .md twin, not in llms*.txt)
          <slug>.md             markdown twin for AI assistants
          changelog.html / .md  release notes
          sitemap.xml           every indexable URL
          llms.txt              page map sections regenerated in place
          llms-full.txt         guides section regenerated with every page's full text
          footers of the hand-written pages kept in sync; the homepage FAQ schema rebuilt from its visible FAQ

Hand-written: index.html, <dir>/index.html (except their footers), support, privacy, terms, thanks, 404,
index.md, ai.txt, the non-generated parts of llms*.txt.

Run:  python3 site/build.py          (then `npx wrangler deploy`)
"""
import html
import json
import re
import shutil
import sys
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
SRC = WEB / "site" / "pages"
APP_CHANGELOG = WEB.parent / "NoMouseMode" / "CHANGELOG.md"
CHANGELOG = WEB / "site" / "CHANGELOG.md"
SITE = "https://nomousemode.com"
ASSET_V = "20261107"
BUY = "/buy/1"
EMAIL = "adgan.business@gmail.com"
X_URL = "https://x.com/ahmedgagan11"
OG_IMAGE = f"{SITE}/og-image.png"

# Footer columns: (heading, [(slug, label)]). Slugs without a source page are skipped.
FOOTER = [
    ("Compare", [
        ("no-mouse-mode-vs-homerow", "vs Homerow"),
        ("no-mouse-mode-vs-shortcat", "vs Shortcat"),
        ("no-mouse-mode-vs-mouse-keys", "vs Mouse Keys"),
        ("homerow-alternatives", "Homerow alternatives"),
        ("vimac-alternative", "Vimac alternatives"),
        ("best-keyboard-mouse-apps-for-mac", "Best keyboard-mouse apps"),
    ]),
    ("Coming from", [
        ("vimium-for-mac", "Vimium"),
        ("keynav-for-mac", "keynav"),
        ("warpd-for-mac", "warpd"),
        ("full-keyboard-access-mac", "Full Keyboard Access"),
    ]),
    ("Learn", [
        ("how-to-use-mac-without-mouse", "Use a Mac without a mouse"),
        ("move-mouse-with-keyboard-mac", "Move the pointer with keys"),
        ("right-click-without-mouse-mac", "Right-click without a mouse"),
        ("mac-trackpad-not-working", "Trackpad not working"),
        ("keyboard-only-mac-rsi", "Wrist pain and RSI"),
    ]),
]

# Translations: hreflang → directory. The homepage of each is hand-written (<dir>/index.html);
# guides are translated by adding site/pages/<dir>/<slug>.html.
LANGS = {"ja": "ja", "zh-Hans": "zh"}
LANG_NAMES = {"en": "English", "ja": "日本語", "zh-Hans": "简体中文"}
OG_LOCALE = {"en": "en_US", "ja": "ja_JP", "zh-Hans": "zh_CN"}

# Interface strings of generated pages.
UI = {
    "en": {
        "skip": "Skip to content", "main": "Sections",
        "nav": ["Demo", "Features", "Pricing", "Guides", "Support"], "nav_cta": "Buy — $19.99",
        "home": "Home", "crumbs": "Breadcrumb",
        "demo": "Try it right here: this is a working model of No Mouse Mode, not a video. Click it, then use the keys.",
        "buy": "Buy No Mouse Mode — $19.99",
        "note": "one-time purchase · free updates · macOS 14+ on Apple silicon and Intel",
        "faq": "FAQ", "more": "Keep reading",
        "updated": lambda d: "Updated " + d.strftime("%B %Y"),
        "blurb": "Your keyboard is the mouse. Click anything on your Mac by typing, glide the pointer with W A S D, scroll and jump anywhere.",
        "product": ["Product", "Demo", "Features", "Keys", "Pricing", "FAQ", "Changelog", "Download"],
        "support": ["Help", "Support", "Email support", "Privacy policy", "Terms of use"],
        "made": "made by", "tagline": "Mac is a trademark of Apple Inc.",
        "headings": {}, "labels": {},
    },
    "ja": {
        "skip": "本文へスキップ", "main": "セクション",
        "nav": ["デモ", "機能", "価格", "ガイド", "サポート"], "nav_cta": "購入 — $19.99",
        "home": "ホーム", "crumbs": "パンくずリスト",
        "demo": "ここで実際に操作できます。動画ではなく、本物どおりに動くNo Mouse Modeの模型です。クリックしてからキーを使ってください。",
        "buy": "No Mouse Modeを購入 — $19.99",
        "note": "買い切り · アップデート無料 · macOS 14以降（AppleシリコンとIntel）",
        "faq": "よくある質問", "more": "関連ガイド（英語）",
        "updated": lambda d: f"{d.year}年{d.month}月更新",
        "blurb": "キーボードがマウスになります。入力するだけでMacのどこでもクリックでき、W A S Dでポインタを動かし、スクロールも思いのまま。ガイド記事の多くは英語です。",
        "product": ["製品", "デモ", "機能", "キー", "価格", "よくある質問", "更新履歴", "ダウンロード"],
        "support": ["ヘルプ", "サポート", "メールサポート", "プライバシーポリシー", "利用規約"],
        "made": "制作", "tagline": "MacはApple Inc.の商標です。",
        "headings": {"Compare": "比較", "Coming from": "乗り換え", "Learn": "使い方"},
        "labels": {
            "homerow-alternatives": "Homerowの代替", "vimac-alternative": "Vimacの代替",
            "best-keyboard-mouse-apps-for-mac": "おすすめのキーボードマウスアプリ",
            "how-to-use-mac-without-mouse": "マウスなしでMacを使う",
            "move-mouse-with-keyboard-mac": "キーボードでポインタを動かす",
            "right-click-without-mouse-mac": "マウスなしで右クリック",
            "mac-trackpad-not-working": "トラックパッドが動かない",
            "keyboard-only-mac-rsi": "手首の痛みとRSI",
        },
    },
    "zh-Hans": {
        "skip": "跳到正文", "main": "页面导航",
        "nav": ["演示", "功能", "价格", "指南", "支持"], "nav_cta": "购买 — $19.99",
        "home": "首页", "crumbs": "面包屑导航",
        "demo": "直接在这里上手操作：这不是视频，而是一个可以操作的 No Mouse Mode 模型。先点一下，再用键盘。",
        "buy": "购买 No Mouse Mode — $19.99",
        "note": "一次性购买 · 免费更新 · macOS 14+，Apple 芯片和 Intel",
        "faq": "常见问题", "more": "延伸阅读（英文）",
        "updated": lambda d: f"{d.year}年{d.month}月更新",
        "blurb": "键盘就是鼠标。在 Mac 上打字即可点击任何按钮，用 W A S D 移动指针，滚动、跳转随心所欲。大部分指南文章为英文。",
        "product": ["产品", "演示", "功能", "按键", "价格", "常见问题", "更新日志", "下载"],
        "support": ["帮助", "支持", "邮件支持", "隐私政策", "使用条款"],
        "made": "开发者", "tagline": "Mac 是 Apple Inc. 的商标。",
        "headings": {"Compare": "对比", "Coming from": "迁移", "Learn": "使用方法"},
        "labels": {
            "homerow-alternatives": "Homerow 替代品", "vimac-alternative": "Vimac 替代品",
            "best-keyboard-mouse-apps-for-mac": "最佳键盘鼠标应用",
            "how-to-use-mac-without-mouse": "不用鼠标使用 Mac",
            "move-mouse-with-keyboard-mac": "用键盘移动指针",
            "right-click-without-mouse-mac": "不用鼠标右键单击",
            "mac-trackpad-not-working": "触控板失灵",
            "keyboard-only-mac-rsi": "手腕疼痛与 RSI",
        },
    },
}


# ────────────────────────────────────────────────────────── loading

def read_page(p, keys):
    text = p.read_text()
    m = re.match(r"<!--meta\n(.*?)\n-->\n", text, re.S)
    if not m:
        sys.exit(f"{p.name}: missing <!--meta ... --> header")
    try:
        meta = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        sys.exit(f"{p.name}: bad meta JSON: {e}")
    meta["content"] = text[m.end():].strip()
    if meta["slug"] != p.stem:
        sys.exit(f"{p.name}: slug mismatch")
    for key in keys:
        if key not in meta:
            sys.exit(f"{p.name}: missing '{key}'")
    return meta


def load_pages():
    pages = {}
    for p in sorted(SRC.glob("*.html")):
        meta = read_page(p, ("title", "description", "h1", "dek", "crumb", "published", "modified", "cta", "faq", "related", "card"))
        pages[meta["slug"]] = meta
    for slug, meta in pages.items():
        for r in meta["related"]:
            if r not in pages:
                sys.exit(f"{slug}: related page '{r}' does not exist")
        check_links(slug, meta["content"] + "".join(f["a"] for f in meta["faq"]), pages)
    return pages


def check_links(slug, fragment, pages):
    """Every relative link in a guide must point at a page that exists."""
    fixed = {"", "support", "privacy", "terms", "changelog", "download", "buy", "buy/1", "buy/3", "buy/5", "buy/20"}
    for href in re.findall(r'href="([^"]+)"', fragment):
        if re.match(r"[a-z]+:", href) or href.startswith("#"):
            continue
        path = href.lstrip("/").split("#")[0].split("?")[0]
        if path not in pages and path not in fixed:
            sys.exit(f"{slug}: link to '{href}', which doesn't exist")


def load_translations(pages):
    """{slug: {lang: meta}} from site/pages/<dir>/<slug>.html."""
    trans = {}
    for lang, d in LANGS.items():
        for p in sorted((SRC / d).glob("*.html")):
            meta = read_page(p, ("lang", "title", "description", "h1", "dek", "crumb", "published", "modified", "cta", "faq", "related"))
            if meta["lang"] != lang:
                sys.exit(f"{d}/{p.name}: lang should be '{lang}'")
            if meta["slug"] not in pages:
                sys.exit(f"{d}/{p.name}: no English page '{meta['slug']}'")
            for r in meta["related"]:
                if r not in pages:
                    sys.exit(f"{d}/{p.name}: related page '{r}' does not exist")
            trans.setdefault(meta["slug"], {})[lang] = meta
    return trans


def url_for(slug, lang="en"):
    """Absolute URL of a page in a language; slug "" is the homepage."""
    d = LANGS.get(lang)
    return f"{SITE}/{d + '/' if d else ''}{slug}"


def path_for(slug, lang="en"):
    return url_for(slug, lang)[len(SITE):]


def hreflang_links(slug, langs):
    """<link rel=alternate hreflang> for every language version (nothing if untranslated)."""
    if not langs:
        return ""
    rows = [("en", url_for(slug))] + [(l, url_for(slug, l)) for l in langs] + [("x-default", url_for(slug))]
    return "".join(f'\n  <link rel="alternate" hreflang="{l}" href="{u}">' for l, u in rows)


def lang_switch(slug, langs, current="en"):
    """English · 日本語 · 简体中文 links, for the footer of translated pages and their originals."""
    links = []
    for l in ["en"] + list(langs):
        cur = ' aria-current="page"' if l == current else ""
        links.append(f'<a href="{path_for(slug, l)}" hreflang="{l}" lang="{l}"{cur}>{LANG_NAMES[l]}</a>')
    return '\n      <nav class="lang-switch" aria-label="Language">' + " &middot; ".join(links) + "</nav>"


def rootify(page):
    """Translated pages live one directory down: make relative href/src root-absolute."""
    return re.sub(r'\b(href|src)="(?![a-z]+:|/|#)([^"]+)"', r'\1="/\2"', page)


def demo_block(lang="en"):
    """The live demo, lifted from the homepage (in the same language) so both always match."""
    home = WEB / LANGS[lang] / "index.html" if lang in LANGS else WEB / "index.html"
    t = (home if home.exists() else WEB / "index.html").read_text()
    m = re.search(r'<section class="demo-section" id="demo".*?\n    </section>', t, re.S)
    if not m:
        sys.exit("demo section not found in index.html")
    return m.group(0).replace('class="demo-section"', 'class="demo-section article-demo"', 1)


# ────────────────────────────────────────────────────────── helpers

def esc(s):
    return html.escape(s, quote=True)


def text_of(fragment):
    t = re.sub(r"<[^>]+>", "", fragment)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


def head_common(lang="en"):
    """Icons, fonts and the stylesheet: the same on every page."""
    return f"""  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preload" href="/fonts/archivo-var-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles.css?v={ASSET_V}">"""


def footer_html(pages, lang="en", switch="", local=()):
    """Site footer. Translated pages get translated chrome; `local` slugs link to their translation."""
    ui = UI[lang]
    home = path_for("", lang)
    pr, sp = ui["product"], ui["support"]
    cols = []
    for heading, items in FOOTER:
        lis = "".join(
            f'\n          <li><a href="{path_for(s, lang) if s in local else "/" + s}">{esc(ui["labels"].get(s, label))}</a></li>'
            for s, label in items if s in pages)
        if not lis:
            continue
        cols.append(f"""      <div>
        <h4>{ui["headings"].get(heading, heading)}</h4>
        <ul>{lis}
        </ul>
      </div>""")
    return f"""<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="{home}"><img src="/icon-sm.png" alt="" width="24" height="24"><span>No Mouse Mode</span></a>
        <p>{ui["blurb"]}</p>
        <a class="footer-badge" href="https://macbase.app/apps/no-mouse-mode?ref=badge" target="_blank" rel="noopener">
          <img class="badge-light" src="https://macbase.app/badge/featured-on-macbase.svg" alt="No Mouse Mode is featured on MacBase" width="225" height="72" loading="lazy">
          <img class="badge-dark" src="https://macbase.app/badge/featured-on-macbase-dark.svg" alt="No Mouse Mode is featured on MacBase" width="225" height="72" loading="lazy">
        </a>
      </div>
      <div>
        <h4>{pr[0]}</h4>
        <ul>
          <li><a href="{home}#demo">{pr[1]}</a></li>
          <li><a href="{home}#features">{pr[2]}</a></li>
          <li><a href="{home}#keys">{pr[3]}</a></li>
          <li><a href="{home}#pricing">{pr[4]}</a></li>
          <li><a href="{home}#faq">{pr[5]}</a></li>
          <li><a href="/changelog">{pr[6]}</a></li>
          <li><a href="/download">{pr[7]}</a></li>
        </ul>
      </div>
{chr(10).join(cols)}
      <div>
        <h4>{sp[0]}</h4>
        <ul>
          <li><a href="/support">{sp[1]}</a></li>
          <li><a href="mailto:{EMAIL}">{sp[2]}</a></li>
          <li><a href="/privacy">{sp[3]}</a></li>
          <li><a href="/terms">{sp[4]}</a></li>
          <li><a href="{X_URL}" rel="me">X / Twitter</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-base">
      <p>&copy; 2026 No Mouse Mode &middot; {ui["made"]} <a href="{X_URL}">Ahmed Gagan</a> &middot; {ui["tagline"]}</p>{switch}
    </div>
  </div>
</footer>"""


def nav_html(lang="en"):
    ui = UI[lang]
    home = path_for("", lang)
    n = ui["nav"]
    return f"""<header class="nav">
  <div class="nav-inner">
    <a class="brand" href="{home}" aria-label="No Mouse Mode home"><img src="/icon-sm.png" alt="" width="28" height="28"><span>No Mouse Mode</span></a>
    <nav class="nav-links" aria-label="{ui['main']}">
      <a href="{home}#demo">{n[0]}</a><a href="{home}#features">{n[1]}</a><a href="{home}#pricing">{n[2]}</a><a href="/how-to-use-mac-without-mouse">{n[3]}</a><a href="/support">{n[4]}</a>
    </nav>
    <a class="btn btn-dark btn-sm" href="{BUY}">{ui['nav_cta']}</a>
  </div>
</header>"""


# ────────────────────────────────────────────────────────── page

def render(meta, pages, demo, langs=(), lang="en"):
    """A guide page. `langs`: translations of this slug (hreflang); `lang`: the language rendered."""
    ui = UI[lang]
    slug = meta["slug"]
    url = url_for(slug, lang)
    title = meta["title"]
    desc = meta["description"]
    ogd = meta.get("og_description", desc)
    faq = meta["faq"]

    ld_crumbs = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": ui["home"], "item": url_for("", lang)},
            {"@type": "ListItem", "position": 2, "name": meta["crumb"], "item": url},
        ],
    }
    ld_article = {
        "@context": "https://schema.org", "@type": "Article", "@id": f"{url}#article",
        "headline": meta.get("headline", title)[:110],
        "description": desc,
        "image": OG_IMAGE,
        "datePublished": meta["published"], "dateModified": meta["modified"],
        "inLanguage": lang,
        "author": {"@type": "Person", "name": "Ahmed Gagan", "url": X_URL},
        "publisher": {"@id": f"{SITE}/#org"},
        "mainEntityOfPage": url,
        "about": {"@id": f"{SITE}/#app"},
    }
    if meta.get("mentions"):
        ld_article["mentions"] = [{"@type": "SoftwareApplication", "name": n, "url": u} for n, u in meta["mentions"]]
    blocks = [ld_crumbs, ld_article]
    if faq:
        blocks.append({
            "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": f["q"],
                            "acceptedAnswer": {"@type": "Answer", "text": text_of(f["a"])}} for f in faq],
        })
        if lang != "en":
            blocks[-1]["inLanguage"] = lang
    if meta.get("howto"):
        h = meta["howto"]
        blocks.append({
            "@context": "https://schema.org", "@type": "HowTo", "name": h["name"],
            "step": [{"@type": "HowToStep", "position": i + 1, "name": s[0], "text": s[1]} for i, s in enumerate(h["steps"])],
        })
    ld = "\n".join(
        '  <script type="application/ld+json">\n' + json.dumps(b, indent=2, ensure_ascii=False) + "\n  </script>"
        for b in blocks)

    # body: split for the demo (after the tl;dr box, or at <!--demo-->)
    content = meta["content"]
    after_cta = ""
    if "<!--after-cta-->" in content:
        content, after_cta = content.split("<!--after-cta-->", 1)
    if "<!--demo-->" in content:
        part1, part2 = content.split("<!--demo-->", 1)
    else:
        m = re.search(r'<div class="verdict">.*?</div>', content, re.S)
        cut = m.end() if m else 0
        part1, part2 = content[:cut], content[cut:]
    body1, body2, after_cta = part1.strip(), part2.strip(), after_cta.strip()
    show_demo = meta.get("demo", True)

    faq_html = "".join(f"""
        <details class="faq-item">
          <summary>{esc(f['q'])}</summary>
          <div class="faq-a">{f['a']}</div>
        </details>""" for f in faq)
    cards = {r: meta.get("related_cards", {}).get(r, pages[r]["card"]) for r in meta["related"]}
    related = "".join(
        f'\n          <a class="related-card" href="/{r}"><b>{esc(cards[r]["title"])}</b><span>{esc(cards[r]["blurb"])}</span></a>'
        for r in meta["related"])

    cta = meta["cta"]
    cta_block = f"""      <div class="cta-banner">
        <img src="/icon-sm.png" alt="" width="56" height="56">
        <h3>{cta['title']}</h3>
        <p>{cta['text']}</p>
        <a href="{BUY}" class="btn btn-accent btn-lg">{ui['buy']}</a>
        <span class="cta-note">{ui['note']}</span>
      </div>"""

    parts = []
    if body1:
        parts.append(f'    <div class="article-body">\n{body1}\n    </div>')
    if show_demo:
        parts.append(f'    <div class="article-demo-wrap">\n      <p class="article-demo-label">{ui["demo"]}</p>\n{demo}\n    </div>')
    tail = body2 + "\n\n" + cta_block + ("\n\n" + after_cta if after_cta else "")
    tail += f"""

      <h2>{ui['faq']}</h2>
      <div class="faq-list">{faq_html}
      </div>

      <div class="related">
        <h2>{ui['more']}</h2>
        <div class="related-grid">{related}
        </div>
      </div>"""
    parts.append(f'    <div class="article-body{" after-demo" if show_demo and body1 else ""}">\n{tail}\n    </div>')

    read = meta.get("read", "")
    meta_line = ui["updated"](date.fromisoformat(meta["modified"])) + (f" · {read}" if read else "")
    md_link = f'\n  <link rel="alternate" type="text/markdown" href="{url}.md" title="{esc(title)} (Markdown)">' if lang == "en" else ""

    page = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="author" content="Ahmed Gagan">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="{url}">{hreflang_links(slug, langs)}{md_link}
  <meta name="theme-color" content="#ffffff">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="No Mouse Mode">
  <meta property="og:locale" content="{OG_LOCALE[lang]}">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(ogd)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="No Mouse Mode: your keyboard is the mouse">
  <meta property="article:published_time" content="{meta['published']}">
  <meta property="article:modified_time" content="{meta['modified']}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="@ahmedgagan11">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(ogd)}">
  <meta name="twitter:image" content="{OG_IMAGE}">

{head_common(lang)}

{ld}
</head>
<body>
<a class="skip" href="#main">{ui['skip']}</a>

{nav_html(lang)}

<main id="main" class="article">
  <div class="wrap-article">
    <nav class="crumbs" aria-label="{ui['crumbs']}">
      <a href="{path_for("", lang)}">{ui['home']}</a><span class="sep">›</span><span>{esc(meta['crumb'])}</span>
    </nav>

    <header class="article-head">
      <h1 class="display">{meta['h1']}</h1>
      <p class="article-dek">{meta['dek']}</p>
      <p class="article-meta">{meta_line} · by <a href="{X_URL}">Ahmed Gagan</a>, maker of No Mouse Mode</p>
    </header>

{chr(10).join(parts)}
  </div>
</main>

{footer_html(pages, lang, lang_switch(slug, langs, lang) if langs else "", [slug] if lang != "en" else ())}

<script src="/js/engine.js?v={ASSET_V}" defer></script>
<script src="/js/site.js?v={ASSET_V}" defer></script>
</body>
</html>
"""
    if lang != "en":
        page = page.replace(" · by <a href=", " · <a href=").replace("</a>, maker of No Mouse Mode</p>", "</a></p>")
    return page if lang == "en" else rootify(page)


# ────────────────────────────────────────────────────────── markdown

class MD(HTMLParser):
    """Small HTML→Markdown converter for the tag set the articles use."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.buf = [], []
        self.lists, self.href = [], []
        self.table, self.row, self.cell = None, None, None
        self.quote = 0
        self.pre = None

    def flush(self, prefix=""):
        t = re.sub(r"[ \t\n]+", " ", "".join(self.buf)).strip()
        self.buf = []
        if t:
            if self.quote:
                t = "> " + t
            self.out.append(prefix + t)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.pre is not None:
            return
        if tag == "pre":
            self.flush()
            self.pre = []
            return
        if self.cell is not None and tag not in ("td", "th", "tr"):
            if tag in ("strong", "b"):
                self.cell.append("**")
            return
        if tag in ("p", "h2", "h3", "h4"):
            self.flush()
            if tag.startswith("h"):
                self.buf.append("#" * int(tag[1]) + " ")
        elif tag in ("ul", "ol"):
            self.flush()
            self.lists.append([tag, 0])
        elif tag == "li":
            self.flush()
            kind = self.lists[-1] if self.lists else ["ul", 0]
            kind[1] += 1
            self.buf.append(("  " * (len(self.lists) - 1)) + (f"{kind[1]}. " if kind[0] == "ol" else "- "))
        elif tag in ("strong", "b"):
            self.buf.append("**")
        elif tag in ("em", "i"):
            self.buf.append("*")
        elif tag in ("code", "kbd"):
            self.buf.append("`")
        elif tag == "br":
            self.buf.append("  \n")
        elif tag == "a":
            self.href.append(absolute(a.get("href", "")))
            self.buf.append("[")
        elif tag == "div" and "verdict" in (a.get("class") or ""):
            self.flush()
            self.quote += 1
        elif tag == "table":
            self.flush()
            self.table = []
        elif tag == "tr":
            self.row = []
        elif tag in ("td", "th"):
            self.cell = []

    def handle_endtag(self, tag):
        if self.pre is not None:
            if tag == "pre":
                self.out.append("```\n" + "".join(self.pre).strip("\n") + "\n```")
                self.pre = None
            return
        if self.cell is not None and tag not in ("td", "th"):
            if tag in ("strong", "b"):
                self.cell.append("**")
            return
        if tag in ("p", "h2", "h3", "h4", "li"):
            self.flush()
        elif tag in ("ul", "ol"):
            self.flush()
            if self.lists:
                self.lists.pop()
        elif tag in ("strong", "b"):
            self.buf.append("**")
        elif tag in ("em", "i"):
            self.buf.append("*")
        elif tag in ("code", "kbd"):
            self.buf.append("`")
        elif tag == "a":
            self.buf.append(f"]({self.href.pop() if self.href else ''})")
        elif tag == "div" and self.quote:
            self.flush()
            self.quote -= 1
        elif tag in ("td", "th"):
            self.row.append(re.sub(r"\s+", " ", "".join(self.cell)).strip().replace("|", "\\|"))
            self.cell = None
        elif tag == "tr":
            self.table.append(self.row)
            self.row = None
        elif tag == "table":
            rows = self.table or []
            if rows:
                n = max(len(r) for r in rows)
                rows = [r + [""] * (n - len(r)) for r in rows]
                lines = ["| " + " | ".join(rows[0]) + " |", "|" + "---|" * n]
                lines += ["| " + " | ".join(r) + " |" for r in rows[1:]]
                self.out.append("\n".join(lines))
            self.table = None

    def handle_data(self, data):
        if self.pre is not None:
            self.pre.append(data)
            return
        (self.cell if self.cell is not None else self.buf).append(data)

    def result(self):
        self.flush()
        md = "\n\n".join(x.rstrip() for x in self.out if x.strip())
        md = re.sub(r"(?m)^(\s*(?:- |\d+\. ).*)\n\n(?=\s*(?:- |\d+\. ))", r"\1\n", md)
        md = re.sub(r"(?m)^(\s*(?:- |\d+\. ).*)\n\n(?=\s*(?:- |\d+\. ))", r"\1\n", md)
        return re.sub(r"\n{3,}", "\n\n", md)


def absolute(href):
    if not href or href.startswith(("http://", "https://", "mailto:")):
        return href
    if href.startswith("/"):
        return SITE + href
    if href.startswith("#"):
        return href
    return f"{SITE}/{href}"


def to_md(fragment):
    fragment = re.sub(r'<span class="verdict-label">(.*?)</span>\s*<p>', r'<p><strong>\1:</strong> ', fragment, flags=re.S)
    p = MD()
    p.feed(fragment)
    return p.result()


def markdown_page(meta, pages):
    url = f"{SITE}/{meta['slug']}"
    content = meta["content"].replace("<!--after-cta-->", "").replace("<!--demo-->", "")
    parts = [
        f"# {text_of(meta['h1'])}",
        f"Source: {url}  \nUpdated: {meta['modified']} · Author: Ahmed Gagan (maker of No Mouse Mode)",
        to_md(f"<p>{meta['dek']}</p>"),
        to_md(content),
        f"**{text_of(meta['cta']['title'])}** {text_of(meta['cta']['text'])} "
        f"Price and checkout: {SITE}/#pricing ($19.99 one-time for 1 Mac, free updates; macOS 14+ on Apple silicon and Intel).",
    ]
    if meta["faq"]:
        parts.append("## FAQ")
        for f in meta["faq"]:
            parts.append(f"### {f['q']}\n\n{to_md(f['a'])}")
    if meta["related"]:
        parts.append("## Related\n\n" + "\n".join(
            f"- [{pages[r]['card']['title']}]({SITE}/{r}) — {pages[r]['card']['blurb']}" for r in meta["related"]))
    return "\n\n".join(p for p in parts if p.strip()) + "\n"


# ────────────────────────────────────────────────────────── site files

STATIC_PAGES = [("support", "monthly", "0.6"), ("privacy", "yearly", "0.3"), ("terms", "yearly", "0.3")]


def file_date(name):
    """Last commit date of a hand-written file (today if it has uncommitted changes or no history)."""
    import subprocess
    p = WEB / name
    dirty = subprocess.run(["git", "status", "--porcelain", "--", name], cwd=WEB, capture_output=True, text=True).stdout.strip()
    if dirty:
        return date.today().isoformat()
    day = subprocess.run(["git", "log", "-1", "--format=%ad", "--date=short", "--", name],
                         cwd=WEB, capture_output=True, text=True).stdout.strip()
    return day or (date.today().isoformat() if p.exists() else "2026-10-22")


def sitemap(pages, trans):
    """Translated URLs go last; every language version lists its alternates (xhtml:link)."""
    alts = {"": list(LANGS)} | {s: list(by) for s, by in trans.items()}
    home_mod = max([file_date("index.html")] + [p["modified"] for p in pages.values()])
    rows = [("", "en", home_mod, "weekly", "1.0")]
    for slug, p in sorted(pages.items(), key=lambda kv: (-kv[1].get("priority", 0.7), kv[0])):
        rows.append((slug, "en", p["modified"], p.get("changefreq", "monthly"), f"{p.get('priority', 0.7):.1f}"))
    rows.append(("changelog", "en", changelog_releases()[0][1] or home_mod, "weekly", "0.5"))
    rows += [(s, "en", file_date(f"{s}.html"), c, pr) for s, c, pr in STATIC_PAGES]
    rows += [("", l, file_date(f"{d}/index.html"), "weekly", "0.9") for l, d in LANGS.items()]
    for slug, by in trans.items():
        p = pages[slug]
        rows += [(slug, l, m["modified"], p.get("changefreq", "monthly"), f"{p.get('priority', 0.7):.1f}") for l, m in by.items()]

    def links(slug):
        if slug not in alts:
            return ""
        return "".join(f'\n    <xhtml:link rel="alternate" hreflang="{l}" href="{url_for(slug, l if l != "x-default" else "en")}"/>'
                       for l in ["en"] + alts[slug] + ["x-default"])
    body = "".join(f"""  <url>
    <loc>{url_for(s, l)}</loc>{links(s)}
    <lastmod>{m}</lastmod>
    <changefreq>{c}</changefreq>
    <priority>{pr}</priority>
  </url>
""" for s, l, m, c, pr in rows)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
            f'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n{body}</urlset>\n')


def replace_section(text, heading, new_body):
    """Replace the markdown section under `heading` up to the next '## ' heading (appended if missing)."""
    if heading + "\n" not in text:
        return text.rstrip() + "\n\n" + heading + "\n\n" + new_body.strip() + "\n"
    start = text.index(heading + "\n")
    body_start = start + len(heading) + 1
    nxt = text.find("\n## ", body_start)
    end = nxt + 1 if nxt != -1 else len(text)
    return text[:body_start] + "\n" + new_body.strip() + "\n\n" + text[end:]


def update_llms(pages):
    p = WEB / "llms.txt"
    t = p.read_text()
    fixed_top = [("What is No Mouse Mode?", f"{SITE}/")]
    fixed_bottom = [
        ("Price and license tiers", f"{SITE}/#pricing"),
        ("Every key and shortcut", f"{SITE}/#keys"),
        ("What changed in each version (release notes)", f"{SITE}/changelog"),
        ("Setup, permissions, license keys, troubleshooting", f"{SITE}/support"),
        ("Privacy / what data is collected", f"{SITE}/privacy"),
        ("License terms and refund policy", f"{SITE}/terms"),
        ("Download", f"{SITE}/download"),
        ("Buy", f"{SITE}/buy"),
    ]
    qa = fixed_top + [(p_["llm_q"], f"{SITE}/{s}") for s, p_ in pages.items() if p_.get("llm_q")] + fixed_bottom
    t = replace_section(t, "## Which URL answers which question", "\n".join(f"- {q} → {u}" for q, u in qa))
    guides = "\n".join(
        f"- [{p_['card']['title']}]({SITE}/{s}.md): {p_['description']}" for s, p_ in pages.items())
    t = replace_section(t, "## Guides & comparisons",
                        "Each guide is also available as clean Markdown (the .md links below; the HTML page is the same URL without .md).\n\n" + guides)
    p.write_text(t)

    f = WEB / "llms-full.txt"
    t = f.read_text()
    full = []
    for s, p_ in pages.items():
        md = markdown_page(p_, pages)
        md = re.sub(r"^# ", "### ", md, count=1)
        md = re.sub(r"(?m)^## ", "#### ", md)
        md = re.sub(r"(?m)^### (?!" + re.escape(text_of(p_["h1"])[:20]) + ")", "##### ", md)
        full.append(md.strip())
    t = replace_section(t, "## Guides & comparison pages (full text)", "\n\n---\n\n".join(full))
    f.write_text(t)


def sync_footer(path, pages, lang="en", switch="", local=()):
    t = path.read_text()
    foot = footer_html(pages, lang, switch, local)
    new = re.sub(r'<footer class="footer">.*?</footer>', lambda _: foot, t, count=1, flags=re.S)
    if new == t and '<footer class="footer">' not in t:
        sys.exit(f"{path.name}: no footer to sync")
    if new != t:
        path.write_text(new)


def sync_home_faq(path):
    """The homepage's FAQPage schema is rebuilt from its visible FAQ, so the two always match."""
    t = path.read_text()
    m = re.search(r'<div class="faq">(.*?)\n        </div>', t, re.S)
    if not m:
        sys.exit(f"{path}: visible FAQ not found")
    items = re.findall(r"<details><summary>(.*?)</summary>(.*?)</details>", m.group(1), re.S)
    lang = re.search(r'<html lang="([^"]+)"', t).group(1)
    ld = {"@context": "https://schema.org", "@type": "FAQPage"}
    if lang != "en":
        ld["inLanguage"] = lang
    ld["mainEntity"] = [{"@type": "Question", "name": text_of(q),
                         "acceptedAnswer": {"@type": "Answer", "text": text_of(a)}} for q, a in items]
    block = '<script type="application/ld+json" id="faq-schema">\n' + json.dumps(ld, indent=2, ensure_ascii=False) + "\n  </script>"
    new = re.sub(r'<script type="application/ld\+json" id="faq-schema">.*?</script>', lambda _: block, t, count=1, flags=re.S)
    if new == t and 'id="faq-schema"' not in t:
        sys.exit(f"{path}: no <script id=\"faq-schema\"> to fill")
    if new != t:
        path.write_text(new)


# ────────────────────────────────────────────────────────── changelog

def changelog_releases():
    """CHANGELOG.md as [(version, day, [items])], newest first."""
    if APP_CHANGELOG.exists():
        shutil.copyfile(APP_CHANGELOG, CHANGELOG)
    releases = []
    for line in CHANGELOG.read_text().splitlines():
        m = re.match(r"## (\d+(?:\.\d+)+)(?:\s+[—-]\s+(\d{4}-\d{2}-\d{2}))?", line)
        if m:
            releases.append((m.group(1), m.group(2), []))
        elif line.startswith("- ") and releases:
            releases[-1][2].append(line[2:].strip())
        elif line.startswith("  ") and releases and releases[-1][2] and line.strip():
            releases[-1][2][-1] += " " + line.strip()
    return releases


def changelog_inline(text):
    """Escaped text with the item's lead phrase (up to the first colon) in bold."""
    t = esc(text)
    m = re.match(r"([^:]{3,60}):\s", t)
    return f"<strong>{m.group(1)}:</strong>{t[m.end(1) + 1:]}" if m else t


def changelog_page(pages):
    releases = changelog_releases()
    url = f"{SITE}/changelog"
    sections = []
    for n, (version, day, items) in enumerate(releases):
        anchor = "v" + version.replace(".", "-")
        when = f'<time datetime="{day}">{date.fromisoformat(day).strftime("%B %-d, %Y")}</time>' if day else ""
        latest = '<span class="release-latest">latest</span>' if n == 0 else ""
        lis = "".join(f"        <li>{changelog_inline(t)}</li>\n" for t in items)
        sections.append(f"""    <section class="release" id="{anchor}">
      <div class="release-head">
        <h2><a href="#{anchor}">{version}</a></h2>{latest}
        {when}
      </div>
      <ul>
{lis}      </ul>
    </section>""")
    newest = releases[0][0]
    ld = json.dumps({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Changelog", "item": url},
        ],
    }, indent=2)
    desc = f"What's new in No Mouse Mode, the Mac app that turns your keyboard into a mouse: release notes for every version, newest first (latest {newest})."
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Changelog — No Mouse Mode</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{url}">
  <link rel="alternate" type="text/markdown" href="{url}.md" title="No Mouse Mode changelog (Markdown)">
  <meta name="theme-color" content="#ffffff">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="No Mouse Mode">
  <meta property="og:title" content="No Mouse Mode changelog">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="{OG_IMAGE}">
{head_common()}
  <script type="application/ld+json">
{ld}
  </script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

{nav_html()}

<main class="doc changelog" id="main">
  <p class="eyebrow">Changelog</p>
  <h1>What's new</h1>
  <p class="doc-lead">Every release of No Mouse Mode, newest first. Updates are free and install themselves; you can also <a href="/download">download the latest version</a> any time.</p>

{chr(10).join(sections)}

  <p class="changelog-help">Something not working after an update? See the <a href="/support">support page</a> or email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
</main>

{footer_html(pages)}
</body>
</html>
"""


def changelog_markdown():
    out = ["# No Mouse Mode changelog", "",
           f"Release notes for every version of No Mouse Mode, newest first. HTML version: {SITE}/changelog", ""]
    for version, day, items in changelog_releases():
        out += [f"## {version}" + (f" ({day})" if day else ""), ""] + [f"- {t}" for t in items] + [""]
    return "\n".join(out)


def main():
    pages = load_pages()
    trans = load_translations(pages)
    demo = demo_block()
    for slug, meta in pages.items():
        (WEB / f"{slug}.html").write_text(render(meta, pages, demo, list(trans.get(slug, {}))))
        (WEB / f"{slug}.md").write_text(markdown_page(meta, pages))
    for slug, by in trans.items():
        for lang, meta in by.items():
            (WEB / LANGS[lang]).mkdir(exist_ok=True)
            (WEB / LANGS[lang] / f"{slug}.html").write_text(render(meta, pages, demo_block(lang), list(by), lang))
    (WEB / "changelog.html").write_text(changelog_page(pages))
    (WEB / "changelog.md").write_text(changelog_markdown())
    (WEB / "sitemap.xml").write_text(sitemap(pages, trans))
    update_llms(pages)
    sync_home_faq(WEB / "index.html")
    sync_footer(WEB / "index.html", pages, switch=lang_switch("", LANGS))
    for name in ("support.html", "privacy.html", "terms.html", "404.html"):
        if (WEB / name).exists():
            sync_footer(WEB / name, pages)
    for lang, d in LANGS.items():
        home = WEB / d / "index.html"
        if home.exists():
            local = [s for s, by in trans.items() if lang in by]
            sync_home_faq(home)
            sync_footer(home, pages, lang, lang_switch("", LANGS, lang), local)
    print(f"built {len(pages)} pages + {sum(len(by) for by in trans.values())} translations")


if __name__ == "__main__":
    main()
