# Enviroshield Website — SEO Implementation Checklist

> **Purpose:** Track the SEO tasks identified for the Enviroshield website and implement them in planned phases.
>
> **Progress rule:** After each checklist item is completed and verified, mark it as **[x]**. Until then, leave it as **[ ]**. Use the checked items in this file as the shared source of truth for progress in future conversations. Do not treat an item as complete unless we explicitly confirm it together.

## Status legend

- `[ ]` Not completed
- `[x]` Completed and verified

---

## Master SEO Checklist

### 1. Google Search Console (GSC)

- [ ] Set up or verify the website property in Google Search Console.
- [ ] Verify ownership of the domain/property.
- [ ] Submit the XML sitemap.
- [ ] Check sitemap processing and submission status.
- [ ] Monitor important pages before and after launch where historical data is available.
- [ ] Monitor clicks, impressions, click-through rate (CTR), average position, search queries, and top pages.
- [ ] Review indexed and excluded pages.
- [ ] Monitor crawl, indexing, and Core Web Vitals reports.
- [ ] Use URL Inspection to investigate important URLs and indexing issues.

### 2. Google Analytics 4 (GA4)

- [ ] Create or configure a GA4 property and web data stream.
- [ ] Add the Google tag to the website and confirm it fires correctly.
- [ ] Configure the correct Measurement ID.
- [ ] Verify traffic acquisition channels, including organic, direct, referral, social, and campaign traffic.
- [ ] Review new and returning users, engagement, devices, browsers, and geography.
- [ ] Review landing pages, exit behavior, page views, and navigation.
- [ ] Verify enhanced measurement settings as appropriate.

### 3. Conversion and Lead Tracking

- [ ] Define a consistent event-naming approach.
- [ ] Track contact form submissions.
- [ ] Track phone-number clicks.
- [ ] Track email clicks.
- [ ] Track WhatsApp clicks.
- [ ] Track consultation and quote-request actions.
- [ ] Track service, product, and project detail views where useful.
- [ ] Track downloads where applicable.
- [ ] Track partnership and other inquiry actions where applicable.
- [ ] Ensure events can be attributed to the source, landing page, and campaign where available.
- [ ] Test events in GA4 and confirm that they are recorded correctly.

### 4. Google Tag Manager (GTM) — Optional

- [ ] Decide whether GTM is needed for centralized tag management.
- [ ] If used, configure the GTM container and install it correctly.
- [ ] Manage relevant GA4 and custom event tags through GTM where appropriate.
- [ ] Document and test third-party tags.

### 5. Meta Pixel and Google Ads Conversion Tracking — Optional

- [ ] Confirm whether Meta Pixel is required.
- [ ] If required, install and test Meta Pixel.
- [ ] Confirm whether Google Ads conversion tracking is required.
- [ ] If required, configure and test Google Ads conversion tracking.
- [ ] Verify consent and privacy requirements applicable to the implementation.

### 6. XML Sitemap

- [x] Generate the sitemap automatically (`app/sitemap.ts`).
- [x] Include core static public routes and dynamic service, project, product, and blog detail URLs.
- [x] Keep the sitemap synchronized with published dynamic content.
- [x] Exclude dynamic entries marked `seo.noIndex === true`; the static route list is curated to public pages. Pagination/filter canonical policy still needs review.
- [x] Reference the sitemap from `robots.txt` (`app/robots.ts`).
- [ ] Submit the sitemap in Google Search Console.
- [ ] Verify live sitemap output, completeness, processing status, and errors.


### 7. `robots.txt`

- [x] Generate `robots.txt` with `app/robots.ts`.
- [x] Reference the XML sitemap.
- [ ] Verify rules do not block important content/assets needed for rendering.
- [x] Add disallow rules for `/dashboard/`, `/api/`, and authentication paths.
- [ ] Reconcile path blocking with page-level `noindex` policy; a blocked URL cannot be crawled to read its `noindex` directive.
- [ ] Confirm public content remains crawlable on the deployed site.


### 8. Indexing and Canonical Management

- [x] Initial indexability controls exist: auth/cart/checkout/order-success pages use `noindex`; dynamic detail pages can honor `seo.noIndex`.
- [x] Canonicals exist for the homepage, listing routes, and dynamic service/product/project/blog detail routes.
- [ ] Verify canonical targets are valid and indexable on the deployed site.
- [ ] Define policy for duplicate URLs, query parameters, filters, pagination, and trailing-slash variants.
- [x] Dynamic service, product, project, and blog detail pages implement canonical and robots metadata.
- [x] Cart, checkout, order-success, and authentication pages explicitly set `noindex`; reconcile with robots disallow rules.
- [ ] Inspect important URLs in Google Search Console.


### 9. SEO Metadata and Open Graph

- [x] SEO title fields exist in frontend content types for blog/service/project/product and are consumed by dynamic metadata.
- [x] SEO description fields exist in frontend content types for blog/service/project/product and are consumed by dynamic metadata.
- [ ] Add/expose a CMS control for canonical URL; no such field was confirmed in the reviewed frontend content types.
- [x] `noIndex` fields exist in dynamic content SEO types and are consumed in page robots metadata.
- [x] Open Graph title, description, and image fields exist for dynamic content; listing pages define Open Graph metadata too.
- [ ] Editable structured-data fields were not confirmed in the reviewed frontend content types; decide if needed.
- [x] Metadata exists for static pages, listing pages, and dynamic product/service/project/blog detail pages.
- [ ] Audit all routes/content records for unique, descriptive titles and descriptions.
- [ ] Verify metadata in rendered HTML on the deployed site.


### 10. Structured Data / Schema Markup

- [x] `Organization` JSON-LD is emitted in `app/layout.tsx`.
- [x] `WebSite` JSON-LD is emitted in `app/layout.tsx`.
- [x] `BreadcrumbList` JSON-LD exists on dynamic service/product/project/blog detail pages.
- [x] `Service` JSON-LD exists on dynamic service detail pages.
- [x] `Product` JSON-LD exists on dynamic product detail pages.
- [x] `BlogPosting` JSON-LD exists on blog detail pages.
- [ ] Add `LocalBusiness` schema only if appropriate and supported by verified details; it was not found in reviewed global/detail page code.
- [ ] Validate rendered JSON-LD and verify schema accurately matches visible content.


### 11. SEO-Friendly Content and Site Structure

- [x] Readable slug routes exist, including `/services/[slug]`, `/projects/[slug]`, `/products/[slug]`, and `/blog/[slug]`.
- [x] Representative public pages use semantic headings and a page-level `<h1>`; audit every route/content record.
- [x] Representative pages use semantic HTML; full-route audit remains open.
- [x] Representative image components use data-backed alt text or relevant fallbacks; audit every image/content record.
- [x] Representative navigation uses ordinary Next.js `Link` anchors; full crawlability audit remains open.
- [x] Visible breadcrumbs exist on service, product, and project detail pages; blog detail includes breadcrumb JSON-LD.
- [x] Representative detail pages link to listing and related content; comprehensive internal-link audit remains open.
- [ ] Review duplicate or thin content across published content.
- [ ] Check for broken links and incorrect HTTP status codes.
- [x] Core public pages use App Router server-rendered components and server-side data fetching; live crawl/render check remains open.
- [ ] Test mobile usability. Responsive CSS is present, but browser/device testing was not run.


### 12. URL Migration and Redirects

- [ ] Audit important URLs on the existing website.
- [ ] Preserve existing URLs where practical.
- [ ] Create an old-to-new URL mapping for changed URLs.
- [ ] Implement permanent (301) redirects for URLs that have moved.
- [ ] Avoid redirect chains and redirect loops.
- [ ] Fix broken internal links and relevant 404 errors.
- [ ] Test redirects for important pages before and after launch.
- [ ] Monitor 404s and redirect behavior after launch.

### 13. Performance and Core Web Vitals

- [ ] Check page loading performance.
- [ ] Review Core Web Vitals.
- [x] `next/image` is used in representative components and remote image hosts are configured in `next.config.ts`. Actual payload and performance measurements remain open.
- [ ] Review other assets that affect loading performance.
- [ ] Confirm mobile performance and responsive behavior.
- [ ] Check that performance improvements do not break functionality or visual design.
- [ ] Re-test key pages after changes and after launch.

### 14. SEO and Analytics Verification

- [ ] Verify GA4 is installed and collecting data.
- [ ] Verify conversion and lead events.
- [ ] Verify GTM tags if GTM is used.
- [ ] Verify important pages are crawlable and indexable as intended.
- [ ] Verify canonical URLs.
- [ ] Verify title tags and meta descriptions.
- [ ] Verify Open Graph metadata.
- [ ] Validate structured data.
- [ ] Verify sitemap and `robots.txt`.
- [ ] Verify redirects and check for 404 errors.
- [ ] Review mobile usability and Core Web Vitals.
- [ ] Confirm internal links, breadcrumbs, semantic HTML, heading hierarchy, and image alt text.
- [ ] Confirm Google Search Console ownership and sitemap status.
- [ ] Monitor organic traffic, clicks, impressions, CTR, search queries, and positions after launch.
- [ ] Review indexed/excluded URLs and Search Console errors after launch.

### 15. Migration Safety

- [ ] Preserve existing URLs wherever practical.
- [ ] Preserve or correctly migrate metadata.
- [ ] Configure redirects for changed URLs.
- [ ] Configure canonical URLs.
- [ ] Configure sitemap and `robots.txt`.
- [ ] Preserve relevant structured data and internal linking.
- [ ] Monitor the website after launch and address issues found.
- [ ] Remember that SEO migration work can reduce avoidable risks, but indexing and ranking outcomes cannot be guaranteed.

---

## Repository Audit Notes (reviewed 2026-10-29)

**Repository reviewed:** https://github.com/gmitsolution3/enviroshield — default branch `main`. This is a source-code review, not proof of deployed output or external account configuration.

### Confirmed in source code

- Global metadata in `app/layout.tsx`: `metadataBase`, title template, description, robots defaults, Open Graph, and Twitter metadata.
- Global JSON-LD in `app/layout.tsx`: `Organization` and `WebSite`.
- Generated `robots.txt` in `app/robots.ts`, including a sitemap reference and disallow rules for dashboard/API/auth routes.
- Generated sitemap in `app/sitemap.ts`, including static public routes and dynamic published service/project/product/blog URLs; dynamic entries honor `seo.noIndex`.
- Metadata for the homepage, About, Contact, listing pages, and dynamic content detail pages.
- Canonical and indexing metadata for dynamic service, product, project, and blog detail routes; listing pages also set canonical URLs.
- SEO data fields for blog/service/project/product: meta title, meta description, keywords, Open Graph title/description/image, and `noIndex`.
- JSON-LD types seen in source: `Organization`, `WebSite`, `Service`, `Product`, `CreativeWork`, `BlogPosting`, `WebPage`, and `BreadcrumbList`.
- Cart, checkout, order-success, and authentication pages explicitly use `noindex`.
- Representative public page/component code uses readable slug URLs, server-rendered content, semantic markup, headings, internal links, `next/image`, and data-backed alt text.

### Findings and gaps to address

1. **Canonical coverage is incomplete:** About and Contact page metadata do not define page-specific canonicals in the reviewed files.
2. **Parameterized listing policy needs review:** product listings can accept category and price filters, while the canonical is derived mainly from the pagination value and omits filter parameters. Confirm whether filtered pages should be canonicalized, noindexed, or otherwise handled.
3. **`robots.txt` versus `noindex`:** crawler disallow rules include auth paths. A blocked URL cannot be crawled to read its page-level `noindex`; decide a deliberate policy for each route.
4. **Analytics was not found in reviewed code:** no clear GA4, Google tag, GTM, Meta Pixel, or Google Ads conversion implementation was found in source search. This does not prove there are no deployment/hosting-level tags.
5. **Google account configuration is unverified:** this review did not access Search Console or Analytics, so property ownership, sitemap submission/processing, traffic data, index coverage, and event collection remain unchecked.
6. **SEO migration redirects are not demonstrated:** `lib/redirects.ts` is an authentication callback safety helper, not an SEO redirect map. `next.config.ts` contains image host configuration but no SEO redirects. The existing/legacy URL mapping and 301 redirects remain unverified.
7. **Schema is not live-validated:** JSON-LD is present, but no rendered-site Rich Results/schema validation was run. `LocalBusiness` was not found in the reviewed global/detail page code and should only be added if appropriate and supported by accurate business details.
8. **Performance is not measured:** `next/image` and responsive styling are code-level signals only. No Lighthouse, Core Web Vitals field data, or mobile performance test was run.
9. **Alt text and semantics are sampled:** representative components have good alt-text patterns and semantic markup, but every route and every CMS content item has not been exhaustively audited.
10. **No build/lint/live crawl was run:** the work used GitHub source inspection. The project was not installed or built locally and deployed routes were not crawled.

### Suggested order from here

1. Finish Phase 1 by reviewing robots rules, adding/confirming About and Contact canonicals, and defining a policy for query/filter/pagination variants.
2. Finish Phase 2 by auditing every public route and content image, then compare the new site routes against the old/live URL inventory before defining redirects.
3. In Phase 3, configure analytics only after agreeing on event definitions and obtaining the real measurement/account details.
4. In Phase 4, test deployed metadata/JSON-LD, sitemap/robots responses, redirects, mobile behavior, performance/Core Web Vitals, Search Console, and Analytics.

---

## Recommended Implementation Phases

Work through the phases in order. Mark each task complete only after implementation and verification. We will use this file to track the agreed status.

### Phase 1 — SEO Foundation

- [x] Audit the repository's main SEO files and representative routes. Live site, external accounts, and exhaustive route validation remain open.
- [x] A metadata pattern exists: global defaults, static page metadata, and dynamic listing/detail metadata. Canonical consistency gaps remain.
- [x] `app/sitemap.ts` generates static and dynamic public routes. Live response/completeness and GSC submission remain unverified.
- [x] `app/robots.ts` generates rules and sitemap reference. Reconcile blocked paths with `noindex` strategy and verify live response.
- [x] Canonicals exist on homepage, listings, and dynamic detail pages. About/Contact and query/filter variants remain to be addressed.
- [x] Global and route-specific robots directives exist. Review all routes and the `robots.txt`/`noindex` interaction.
- [x] Core Organization/WebSite plus relevant detail-page schema is implemented. Rendered schema validation remains open.

**Phase 1 status:** In progress — core source-code implementation is present; identified gaps and live verification remain.

### Phase 2 — Content Structure and Migration

- [x] Representative public routes show semantic markup, headings, detail-page breadcrumbs, and related/internal links. Full-site consistency audit remains open.
- [x] Readable slug routes and data-backed alt-text patterns exist on representative pages. Full route/content audit remains open.
- [x] Frontend content types include SEO fields for blog/service/project/product (`metaTitle`, `metaDescription`, keywords, OG fields, `noIndex`) and detail metadata consumes them. Canonical/schema editor fields were not seen in these type definitions.
- [ ] Audit existing URLs and create an old-to-new URL map.
- [ ] Implement and test 301 redirects for changed URLs.
- [ ] Check for broken links, 404s, and duplicate-content issues.

**Phase 2 status:** In progress — core content/SEO structures exist; full audit and migration work remain.

### Phase 3 — Analytics and Conversions

- [ ] Set up or verify Google Search Console.
- [ ] Set up or verify GA4.
- [ ] Implement and test lead/conversion events.
- [ ] Decide whether GTM is needed and configure it if required.
- [ ] Decide whether Meta Pixel and Google Ads conversion tracking are needed and configure them if required.

**Phase 3 status:** Not started — no GA4/GTM/Meta Pixel implementation was found in reviewed repository code.

### Phase 4 — Verification and Post-Launch Monitoring

- [ ] Test performance and Core Web Vitals.
- [ ] Test mobile usability and rendering.
- [ ] Verify metadata, canonicals, indexing directives, and structured data.
- [ ] Verify `robots.txt` and sitemap submission/status.
- [ ] Test redirects and fix broken links/404s.
- [ ] Verify GA4 data and conversion events.
- [ ] Review Search Console crawl/indexing reports and indexed/excluded URLs.
- [ ] Monitor organic traffic, impressions, clicks, CTR, queries, and positions after launch.

**Phase 4 status:** Not started — deployment, account, performance, and post-launch verification remain outstanding.

---

## Working Agreement for Future Sessions

1. This Markdown file is the shared progress tracker for the Enviroshield website SEO work.
2. We will work through the recommended phases in order unless we explicitly agree to change the order.
3. After each checklist item is implemented and verified, we will mark it `[x]` in this file.
4. Do not mark an item complete just because we discussed it or drafted a plan; completion means the work has been done and checked.
5. When the user says a task or phase is complete, update the relevant checkbox/status in this file accordingly.
6. At the beginning of a later session, consult this file and continue from the first unchecked task in the active phase.
7. Keep unrelated website sections and functionality unchanged when implementing a specific SEO task.
8. Some integrations may require access to the user's Google or advertising accounts. If access is unavailable, record the dependency rather than claiming setup is complete.
9. Ongoing SEO/content creation beyond the migration and launch checklist is not automatically included; agree on it separately if needed.

## Progress Summary

- **Current phase:** Phase 1 — SEO Foundation
- **Current task:** Close Phase 1 gaps: canonicals for About/Contact, query/filter canonical policy, and robots/noindex policy; then validate live outputs
- **Completed tasks:** Source-code audit; generated sitemap/robots; canonical and metadata patterns on main listing/detail routes; dynamic-content SEO data fields; global and detail-page schema; representative semantics, alt text, links, and responsive styling. External integrations and live verification remain unconfirmed.
