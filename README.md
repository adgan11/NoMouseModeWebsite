# NoMouseModeWebsite

## Guides, changelog and translations (site/build.py)

Adapted from the ChainYourMac site's generator. Guide sources live in `site/pages/<slug>.html` (a `<!--meta {json} -->`
header plus the article HTML); translations in `site/pages/ja/` and `site/pages/zh/`. Facts for guides come only from
`site/research/*-facts.md` ("if a fact is not here, do not state it").

    python3 site/build.py     # guides + .md twins, changelog (from ../NoMouseMode/CHANGELOG.md), sitemap,
                              # llms.txt / llms-full.txt sections, footers, homepage FAQ schema
    npx wrangler deploy

Hand-written: index.html, ja/index.html, zh/index.html (except footers and the FAQ schema), support, privacy, terms,
thanks, 404, index.md, ai.txt. To add a guide to the footer, add its slug to FOOTER in build.py.
After a release, run the build so the changelog and sitemap pick up the new version.
