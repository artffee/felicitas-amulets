# Felicitas Amulets

Public website: https://feclicitasamulets.com/

Static HTML site deployed from this repository to Vercel project `medalion`.
The pendant collection and mystery box are launch concepts; no working checkout
or finalized launch price is implied by this release.

## Visitor counts

Open the **Owner visitor dashboard** link in the footer, or:
https://vercel.com/usivaylo-5363s-projects/medalion/analytics?environment=all

Sign in with the Vercel account that owns the project. The dashboard reports
visitors, page views, referrers, countries and devices. Select Production and the
desired period. Reports are private to authorized Vercel users; no analytics
credentials or visitor totals are exposed by the public site.

Web Analytics was enabled on the included Hobby tier on 8 November 2026.
Collection requires this release's `analytics.js` and a deployment after enablement.
Counts begin with collection; historical visitors cannot be reconstructed.
Validation visits also appear, so initial counts are not evidence of customer traffic.

Vercel visitors are estimates, not a lifetime count of individual people. Repeat
visits, privacy settings and content blockers affect totals. Google Analytics
(`G-G76GFDSWE5`) remains a separate reporting system; do not add its counts to
Vercel's. Custom launch-interest and successful-form events use Google Analytics
only, since Vercel's included Hobby analytics does not include custom events.
Form events are emitted only after Formspree accepts the request; acceptance does
not prove email delivery. Test submissions must be mocked rather than sent.

Only the root page on the two production custom hostnames loads analytics.
Draft designs, preview deployments and localhost are excluded. The script strips
page query strings/fragments, uses origin-only Google referrers, allowlists event
names/interest values, and sends no form text or email as custom event data.
Do Not Track, Global Privacy Control, and the visitor's local pause preference
prevent collection. Pausing after a page view does not erase that earlier view.

## Search visibility

- Descriptive page title, description, canonical URL and social previews.
- Existing Google Search Console verification token preserved.
- Crawlable root page and current image sitemap with actual WebP images.
- Organization, website, page, product, collection and book structured data.
- FAQ structured answers match the six visible questions and answers.
- Design alternatives use noindex; `/index.html` redirects to the canonical root.
- Product images have intrinsic sizes and lazy loading below the hero.

Search Console: https://search.google.com/search-console
Choose the existing `feclicitasamulets.com` property and submit `/sitemap.xml`.
The public verification token alone does not prove access to Search Console.
No rankings, indexing, search impressions or rich-result eligibility are promised.

## Validation

Run `node --test tests/analytics.test.cjs` and `python3 tests/seo_check.py`.
