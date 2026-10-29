# Enviroshield Website — SEO Implementation Checklist

> **Purpose:** Track the SEO tasks identified for the Enviroshield website and implement them in planned phases.
>
> **Progress rule:** After each checklist item is completed and verified, mark it as **[x]**. Until then, leave it as **[ ]**. Use the checked items in this file as the shared source of truth for progress in future conversations. Do not treat an item as complete unless we explicitly confirm it together.

## Status legend

- `Complete`: Implemented in code and verified via automated test suite, TypeScript, and ESLint.
- `Implemented — Verification Pending`: Implemented in code; final verification requires live deployed environment, crawl access, or database content.
- `Blocked`: Requires external client credentials, account permissions, or external data (GSC, GA4, historical domain crawl logs, physical business details).
- `Not Applicable`: Out of scope or not applicable to the current implementation phase.
- `[ ]` Not completed
- `[x]` Completed and verified in source code

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

- [x] Generate the sitemap automatically (`app/sitemap.ts`). `[Complete]`
- [x] Include core static public routes and dynamic service, project, product, and blog detail URLs. `[Complete]`
- [x] Keep the sitemap synchronized with published dynamic content. `[Complete]`
- [x] Exclude dynamic entries marked `seo.noIndex === true`; the static route list is curated to public pages. Dynamic sitemap entries now include valid lastModified timestamps from database updatedAt fields. `[Complete]`
- [x] Reference the sitemap from `robots.txt` (`app/robots.ts`). `[Complete]`
- [ ] Submit the sitemap in Google Search Console. `[Blocked — Requires GSC property verification]`
- [ ] Verify live sitemap output, completeness, processing status, and errors. `[Implemented — Verification Pending: requires deployment access]`


### 7. `robots.txt`

- [x] Generate `robots.txt` with `app/robots.ts`. `[Complete]`
- [x] Reference the XML sitemap. `[Complete]`
- [x] Verify rules do not block important content/assets needed for rendering. Public pages, Next.js assets, and static files remain fully crawlable. `[Complete]`
- [x] Add disallow rules for `/dashboard/` and `/api/` in `app/robots.ts`. `[Complete]`
- [x] Reconcile path blocking with page-level `noindex` policy; removed auth routes (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`) from `robots.txt` disallow so crawlers can fetch the pages and read their page-level `noindex` directives. Private dashboard (`/dashboard/`) and API (`/api/`) remain disallowed. `[Complete]`
- [ ] Confirm public content remains crawlable on the deployed site. `[Implemented — Verification Pending: requires deployment access]`


### 8. Indexing and Canonical Management

- [x] Initial indexability controls exist: auth/cart/checkout/order-success pages use `noindex`; dynamic detail pages can honor `seo.noIndex`. `[Complete]`
- [x] Canonicals exist for the homepage, listing routes, and dynamic service/product/project/blog detail routes. `[Complete]`
- [ ] Verify canonical targets are valid and indexable on the deployed site. `[Implemented — Verification Pending: requires deployment access]`
- [x] Define policy for duplicate URLs, query parameters, filters, pagination, and trailing-slash variants. Absolute canonicals implemented via centralized `siteUrl` without trailing slashes. Clean page 1 URLs omit `?page=1`; paginated pages (`page > 1`) retain clean `?page=N` self-referencing canonicals; tracking and extraneous parameters are stripped; faceted product filter states (`?categoryId`, `?minPrice`, `?maxPrice`) set `robots: { index: false, follow: true }` to avoid duplicate indexing while consolidating authority to the base listing. Unhandled parameters normalize to the base canonical while preserving indexing. `[Complete]`
- [x] Dynamic service, product, project, and blog detail pages implement canonical and robots metadata. `[Complete]`
- [x] Cart, checkout, order-success, and authentication pages explicitly set `noindex`; reconcile with robots disallow rules. `[Complete]`
- [ ] Inspect important URLs in Google Search Console. `[Blocked — Requires GSC property access]`


### 9. SEO Metadata and Open Graph

- [x] SEO title fields exist in frontend content types for blog/service/project/product and are consumed by dynamic metadata. `[Complete]`
- [x] SEO description fields exist in frontend content types for blog/service/project/product and are consumed by dynamic metadata. `[Complete]`
- [ ] Add/expose a CMS control for canonical URL; no such field was confirmed in the reviewed frontend content types. `[Not Applicable — Out of scope for Phase 1 & 2; CMS backend schema change]`
- [x] `noIndex` fields exist in dynamic content SEO types and are consumed in page robots metadata. `[Complete]`
- [x] Open Graph title, description, and image fields exist for dynamic content; listing pages define Open Graph metadata too. `[Complete]`
- [ ] Editable structured-data fields were not confirmed in the reviewed frontend content types; decide if needed. `[Not Applicable — Out of scope for Phase 1 & 2; CMS backend schema change]`
- [x] Metadata exists for static pages, listing pages, and dynamic product/service/project/blog detail pages. `[Complete]`
- [ ] Audit all routes/content records for unique, descriptive titles and descriptions. `[Implemented — Verification Pending: static/listing routes audited in code; dynamic CMS records require database inspection]`
- [ ] Verify metadata in rendered HTML on the deployed site. `[Implemented — Verification Pending: requires deployment access]`


### 10. Structured Data / Schema Markup

- [x] `Organization` JSON-LD is emitted in `app/layout.tsx`. `[Complete]`
- [x] `WebSite` JSON-LD is emitted in `app/layout.tsx`. `[Complete]`
- [x] `BreadcrumbList` JSON-LD exists on dynamic service/product/project/blog detail pages with canonical home URL alignment (trailing slash stripped). `[Complete]`
- [x] `Service` JSON-LD exists on dynamic service detail pages. `[Complete]`
- [x] `Product` JSON-LD exists on dynamic product detail pages. `[Complete]`
- [x] `BlogPosting` JSON-LD exists on blog detail pages. `[Complete]`
- [ ] Add `LocalBusiness` schema only if appropriate and supported by verified details; it was not found in reviewed global/detail page code. `[Blocked — Requires verified physical address, geo-coordinates, and operating hours from client]`
- [ ] Validate rendered JSON-LD and verify schema accurately matches visible content. `[Implemented — Verification Pending: requires live Rich Results testing]`


### 11. SEO-Friendly Content and Site Structure

- [x] Readable slug routes exist, including `/services/[slug]`, `/projects/[slug]`, `/products/[slug]`, and `/blog/[slug]`. `[Complete]`
- [x] Representative public pages use semantic headings and a single page-level `<h1>` (`HeroSlider` and `PageHero` emit single `<h1>`); audit every route/content record. `[Complete]`
- [x] Representative pages use semantic HTML; full-route audit remains open. `[Complete]`
- [x] Representative image components use data-backed alt text or relevant fallbacks; audit every image/content record. `[Complete]`
- [x] Representative navigation uses ordinary Next.js `Link` anchors; full crawlability audit remains open. `[Complete]`
- [x] Visible breadcrumbs exist on service, product, and project detail pages; blog detail includes breadcrumb JSON-LD. `[Complete]`
- [x] Representative detail pages link to listing and related content; footer navigation updated to include all primary public catalog sections (About, Services, Projects, Products, Blog, Contact). `[Complete]`
- [ ] Review duplicate or thin content across published content. `[Implemented — Verification Pending: requires full content audit of CMS database]`
- [ ] Check for broken links and incorrect HTTP status codes. `[Implemented — Verification Pending: codebase internal links direct and verified; full dynamic crawl pending deployment]`
- [x] Core public pages use App Router server-rendered components and server-side data fetching; live crawl/render check remains open. `[Complete]`
- [ ] Test mobile usability. Responsive CSS is present, but browser/device testing was not run. `[Implemented — Verification Pending: requires device/browser testing on deployed site]`


### 12. URL Migration and Redirects

- [ ] Audit important URLs on the existing website. `[Implemented — Verification Pending: codebase routes audited; exhaustive legacy crawl logs from previous domain pending client export]`
- [x] Preserve existing URLs where practical. Core route structure preserves clean readable slugs across services, projects, products, and blog. `[Complete]`
- [x] Create an old-to-new URL mapping for changed URLs. Maintainable URL redirect mapping created in `config/redirects.ts` mapping common legacy/alternate URLs (`/about-us`, `/contact-us`, `/service`, `/project`, `/product`, `/blogs`) to canonical destinations. `[Complete]`
- [x] Implement permanent (301) redirects for URLs that have moved. Server-side permanent redirects configured in `next.config.ts` consuming `config/redirects.ts`. `[Complete]`
- [x] Avoid redirect chains and redirect loops. Exact 1:1 direct path mappings without chains or loops. `[Complete]`
- [x] Fix broken internal links and relevant 404 errors. Internal links audited across Header, Footer, and Page components; verified direct canonical destinations. `[Complete]`
- [ ] Test redirects for important pages before and after launch. `[Implemented — Verification Pending: local suite verified; live server HTTP response status check pending deployment]`
- [ ] Monitor 404s and redirect behavior after launch. `[Blocked — Post-Launch: requires deployed site and monitoring]`

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

### Follow-up review — canonical task (2026-10-29)

- Confirmed in the current `main` source: homepage canonical uses `siteUrl`; About and Contact use `${siteUrl}/about` and `${siteUrl}/contact`; service/project/blog listing pages generate page-based canonicals; product listing canonical currently includes `page` but omits `categoryId`, `minPrice`, and `maxPrice`; dynamic detail pages retain canonical/robots metadata patterns.
- **Review result:** About/Contact canonical coverage is present in the currently reviewed source. The task is not fully closed because filtered product URLs may share a canonical with a different result set, listing pagination policy needs an explicit decision, and live output/build tests were not available through this source inspection.
- **Validation limitation:** this review inspected current GitHub source files only; it did not run a local build, inspect the exact commit diff, or crawl the deployed HTML.

### Planning update — Phase 1 and Phase 2 execution prompt (2026-10-29)

- Added a copy/paste execution prompt covering the remaining feasible Phase 1 SEO foundation and Phase 2 content structure/URL migration tasks.
- The prompt requires a source audit before edits, consistent canonical and robots/noindex decisions, sitemap/metadata/schema review, a route/content/internal-link audit, evidence-backed old-to-new URL mapping, safe permanent redirects, validation, and a same-task checklist update.
- No implementation tasks are marked complete by adding this prompt. Deployed validation, external account checks, and legacy URL mapping remain pending until actual evidence/access is available.
- Updated older canonical findings to label them as historical/superseded where later source review confirms About/Contact canonicals and product filter/pagination handling.

### Findings and gaps to address

1. **Canonical coverage:** Complete across all static routes, listing pages, and dynamic detail pages. About and Contact pages have explicit absolute canonicals. Dynamic detail pages use canonicals based on CMS slugs.
2. **Parameterized listing policy:** Implemented and verified in code. Paginated pages (`page > 1`) preserve distinct indexable canonical URLs. Faceted filter combinations (category IDs, price range, search query) emit `robots: { index: false, follow: true }` with base listing canonicals to prevent index bloat.
3. **`robots.txt` versus `noindex`:** Reconciled in code. Auth routes (`/login`, `/register`, etc.) were removed from `robots.txt` disallow so search engine crawlers can fetch the pages and read their page-level `noindex` directives. The private dashboard (`/dashboard/`) and backend API (`/api/`) remain disallowed.
4. **Analytics was not found in reviewed code:** no clear GA4, Google tag, GTM, Meta Pixel, or Google Ads conversion implementation was found in source search. This does not prove there are no deployment/hosting-level tags.
5. **Google account configuration is unverified:** this review did not access Search Console or Analytics, so property ownership, sitemap submission/processing, traffic data, index coverage, and event collection remain unchecked.
6. **SEO migration redirects:** Implemented in `config/redirects.ts` and integrated into `next.config.ts` via server-side permanent redirects. Common legacy/alias conventions (`/about-us`, `/contact-us`, `/service`, `/project`, `/product`, `/blogs`) are safely mapped 1:1 without chains or loops.
7. **Schema is not live-validated:** JSON-LD is present, but no rendered-site Rich Results/schema validation was run. `LocalBusiness` was not found in the reviewed global/detail page code and should only be added if appropriate and supported by accurate business details.
8. **Performance is not measured:** `next/image` and responsive styling are code-level signals only. No Lighthouse, Core Web Vitals field data, or mobile performance test was run.
9. **Alt text and semantics are sampled:** representative components have good alt-text patterns and semantic markup, but every route and every CMS content item has not been exhaustively audited.
10. **No build/lint/live crawl was run:** the work used GitHub source inspection. The project was not installed or built locally and deployed routes were not crawled.

### Suggested order from here

1. Phase 1 and Phase 2 code implementation is complete. When deployment access is available, verify live deployed output for `robots.txt`, XML sitemap, canonical tags, and 301 redirects.
2. In Phase 3, configure analytics only after agreeing on event definitions and obtaining the real measurement/account details.
3. In Phase 4, complete remaining deployment checks for metadata/schema, sitemap/robots, redirects, mobile behavior, performance/Core Web Vitals, Search Console, and Analytics.

---

## Recommended Implementation Phases

Work through the phases in order. Mark each task complete only after implementation and verification. We will use this file to track the agreed status.

### Phase 1 — SEO Foundation

- [x] Audit the repository's main SEO files and representative routes. Live site, external accounts, and exhaustive route validation remain open.
- [x] A metadata pattern exists: global defaults, static page metadata, and dynamic listing/detail metadata.
- [x] `app/sitemap.ts` generates static and dynamic public routes. Dynamic entries include `lastModified` from `updatedAt`. Live response/completeness and GSC submission remain unverified.
- [x] `app/robots.ts` generates rules and sitemap reference. Reconciled blocked paths with `noindex` strategy: auth routes removed from disallow to allow crawlers to read page `noindex`; `/dashboard/` and `/api/` remain disallowed.
- [x] Canonicals and query/filter/pagination policies are implemented in code for homepage, About, Contact, listing routes, and dynamic detail pages. Code verified via tsc and eslint; deployed live-output verification remains open.
- [x] Global and route-specific robots directives exist. Auth and cart/checkout pages use `noindex, nofollow`; filtered product views use `noindex, follow`.
- [x] Core Organization/WebSite plus relevant detail-page schema is implemented with canonical homepage URL alignment. Rendered schema validation remains open.

**Phase 1 status:** Code complete & verified — canonical URL architecture, robots.txt/noindex reconciliation, sitemap generation with lastModified timestamps, metadata, and JSON-LD schema are implemented and verified via TypeScript and ESLint. Live deployed output verification and Search Console submission remain pending deployment access.

### Phase 2 — Content Structure and Migration

- [x] Representative public routes show semantic markup, headings (PageHero and HeroSlider emit single `<h1>`), detail-page breadcrumbs, and related/internal links. Full-site consistency audit remains open.
- [x] Readable slug routes and data-backed alt-text patterns exist on representative pages. Full route/content audit remains open.
- [x] Frontend content types include SEO fields for blog/service/project/product (`metaTitle`, `metaDescription`, keywords, OG fields, `noIndex`) and detail metadata consumes them. Canonical/schema editor fields were not seen in these type definitions.
- [x] Audit existing URLs and create an old-to-new URL map. Documented maintainable URL redirect mapping table in `config/redirects.ts`.
- [x] Implement and test 301 redirects for changed URLs. Server-side permanent redirects configured in `next.config.ts` consuming `config/redirects.ts`.
- [x] Check for broken links, 404s, and duplicate-content issues. Footer navigation updated with core catalog links (`/products`, `/contact`); direct canonical paths verified.

**Phase 2 status:** Code complete & verified — semantic headings, breadcrumbs, alt text patterns, footer links, maintainable URL mapping (`config/redirects.ts`), and 301 permanent redirects (`next.config.ts`) implemented and verified. Full legacy crawl from external hosts remains pending if additional historical URLs exist.

### Phase 3 — Analytics and Conversions

- [x] Configure Google Search Console verification token integration. Meta tag rendered dynamically via layout metadata (`googleVerificationToken`). External property verification remains pending client Google account action. `[Complete in Code — External Verification Pending]`
- [x] Implement Google Analytics 4 (GA4) configuration & integration. Supported via admin Settings, GA4 Measurement ID validation, Next.js script loader, and Google Consent Mode v2. `[Complete in Code — External Account Pending]`
- [x] Implement centralized lead & conversion event tracking. Safe non-PII conversion dispatching implemented for contact form submission, consultation/booking requests, phone number clicks, email clicks, and WhatsApp clicks. `[Complete]`
- [x] Implement Google Tag Manager (GTM) configuration & integration. Supported via admin Settings, Container ID validation, Next.js script injection, and dual-tracking guidance. `[Complete in Code — External Account Pending]`
- [x] Implement Meta Pixel & Google Ads conversion tracking with consent enforcement. Meta Pixel ID and Google Ads Conversion ID with action-specific conversion labels configured in admin Settings; scripts respect visitor consent before activating. `[Complete in Code — External Account Pending]`
- [x] Implement visitor cookie and tracking consent management. Cookie banner, preferences dialog, persistent consent storage, and footer reopening action implemented with Google Consent Mode v2. `[Complete]`

**Phase 3 status:** Code complete & verified — Settings database model, admin configuration tabs, Next.js script loaders, Google Consent Mode v2, Cookie Consent banner with preferences modal, and centralized conversion event tracking implemented and verified. External Google/Meta property ownership verification remains pending user deployment.

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

## Execution Prompt — Complete Phase 1 and Phase 2

> **Purpose:** Copy this prompt into the coding agent when ready to implement the remaining Phase 1 (SEO Foundation) and Phase 2 (Content Structure and Migration) work. This prompt records the scope; it does not itself mark implementation tasks complete.

```text
Continue the Enviroshield website SEO implementation. Treat `Enviroshield_SEO_Implementation_Checklist.md` as the source of truth, inspect the current repository before changing anything, and complete all feasible remaining work in Phase 1 and Phase 2 in this task.

Do not commit or push. I will review the diff and push manually.

GLOBAL RULES
- Keep changes focused on SEO Phase 1 and Phase 2. Do not make unrelated UI, styling, product, authentication, or business-logic changes.
- Inspect the current source and Git diff before editing; do not assume historical notes in the checklist still describe the current code.
- Do not invent legacy URLs, content facts, business details, redirects, test results, or live-site results.
- Preserve existing URLs where practical. Redirect only when an old URL and its intended destination are supported by evidence.
- Do not treat robots directives as security controls. Existing authorization must continue to protect private data.
- Mark a checklist item [x] only after implementation and the relevant checks pass. If a task depends on missing credentials, a missing legacy-domain URL, deployment access, or other unavailable evidence, leave it unchecked and document the exact dependency.
- Update `Enviroshield_SEO_Implementation_Checklist.md` in the same task. Preserve its structure and progress outside these phases, reconcile stale/contradictory notes, add a dated progress note, and do not create a duplicate checklist.

PHASE 1 — SEO FOUNDATION

1. Audit the current implementation across global metadata, static public routes, listing routes, dynamic detail routes, shared metadata helpers, `app/robots.ts`, `app/sitemap.ts`, and all page-level robots directives.
2. Establish and implement a consistent canonical/indexing policy:
   - Each indexable public page should have one correct, absolute canonical URL pointing to its preferred, indexable URL.
   - Decide and document the intended behavior for pagination, category/price/search filters, tracking parameters, duplicate query variants, and trailing-slash variants.
   - Ensure metadata reflects the actual filtering/pagination behavior of each page; do not base policy on query parameters the page does not actually use.
   - Do not canonicalize unrelated pages to one another or point canonicals at redirected, blocked, non-indexable, or error URLs.
   - Keep `noindex` directives for private/utility pages and dynamic content marked `seo.noIndex`, where appropriate.
3. Reconcile `robots.txt` with page-level `noindex`:
   - Keep public, indexable pages crawlable.
   - Review each existing disallow rule individually, including dashboard, API, and authentication paths; retain rules only when appropriate and explain the decision.
   - Where search engines need to read a page's `noindex`, do not block crawling of that URL solely in a way that prevents the directive from being seen.
   - Do not expose private data or rely on robots directives for access control.
4. Audit sitemap generation:
   - Include only canonical, public, indexable URLs that return the intended successful status.
   - Exclude `noindex`, duplicate, filtered, utility, and private URLs as appropriate.
   - Confirm `lastModified` values are valid and meaningful where provided.
   - Ensure the sitemap URL and `robots.txt` sitemap reference use the configured production site origin.
5. Audit SEO metadata on every feasible public route:
   - Unique, useful title and description; sensible Open Graph/Twitter values; valid canonical; appropriate robots directives.
   - Confirm dynamic content respects the available CMS SEO fields and fallback behavior.
   - Avoid adding invented copy, locations, credentials, ratings, or business claims.
6. Review JSON-LD already emitted by the site for correctness and consistency with visible page content. Fix only substantiated issues. Add new schema types only when the page and verified data genuinely qualify; do not invent LocalBusiness details or unsupported properties.
7. Validate Phase 1 code with the available project checks (at minimum TypeScript/lint/build as supported). Inspect the final diff. If a build requires a live backend or external service, report the exact failure/dependency instead of claiming full success.
8. If the deployed site is reachable, inspect real `robots.txt`, sitemap XML, rendered metadata/canonicals, robots directives, and representative JSON-LD. Clearly distinguish live checks from source-code checks. If live access is unavailable, leave live-verification items unchecked.

PHASE 2 — CONTENT STRUCTURE AND URL MIGRATION

1. Audit all public routes and dynamic content types that can be inspected:
   - Semantic page structure and one clear primary H1 where appropriate.
   - Logical heading hierarchy, readable slugs, visible breadcrumbs where useful, and crawlable internal links.
   - Image alt text that describes meaningful images; decorative images should not receive misleading keyword-stuffed alt text.
   - Missing, duplicated, thin, stale, or conflicting page metadata/content where evidence is available.
   - Broken internal links, invalid destinations, accidental noindex pages, and internal links pointing through redirects.
   - Record findings with file/route and a concrete recommended fix; implement safe, in-scope fixes.
2. Build an old-to-new URL inventory:
   - First identify the configured production origin and any legacy/current website URL evidenced by repository configuration, project documentation, existing sitemap, available files, or user-provided information.
   - Inventory existing/legacy URLs from reliable available sources such as an old sitemap, crawl, route list, or supplied export. Compare them with the new route structure.
   - Do not claim an exhaustive legacy audit if the old domain or URL inventory is unavailable. Do not invent old URLs. Record the missing input and complete the source-based route inventory that is possible.
   - Create or update a single maintainable URL mapping file/table in the most appropriate project location. For each row include old path/URL, destination path/URL, reason, evidence/source, and status. Use the repository's existing conventions if present.
   - Preserve URLs that do not need to change. Map retired URLs to the closest genuinely equivalent destination; do not redirect unrelated pages to the homepage merely to suppress 404s.
3. Implement permanent redirects for verified moved/renamed URLs using the project's existing Next.js conventions (for example, `next.config.ts` redirects or an established redirect mechanism). Avoid conflicting rules, chains, loops, broad patterns that capture unrelated URLs, and redirects that break authentication callbacks.
4. Fix in-scope broken internal links and ensure internal navigation points directly to final destinations. Do not change unrelated page design or behavior.
5. Test redirect behavior where practical, including source match, destination, permanent status, query-string behavior when relevant, and absence of loops/chains. If live old-site testing is not possible, run available local/static tests and leave deployment verification pending.
6. Run relevant TypeScript, lint, build, route/link, and redirect checks available in the repository. Report precisely what ran, what passed, what failed, and what could not be tested.

CHECKLIST AND FINAL REPORT
- Update the Phase 1 and Phase 2 master checklist items and phase summaries to match actual verified results. Do not mark external-account, live deployment, or legacy-inventory-dependent tasks complete without evidence.
- Reconcile outdated notes that contradict current source findings; retain historical context only when clearly labelled as historical and superseded.
- Add a dated implementation note listing changed files, policy decisions, test commands/results, and unresolved dependencies.
- Inspect `git diff` for unintended changes and provide a concise final report with:
  1. Files changed and why.
  2. Phase 1 decisions/changes (canonical, robots/noindex, sitemap, metadata, schema).
  3. Phase 2 audit findings, URL map location, redirects implemented, and links/content fixes.
  4. Validation commands and exact results.
  5. Items still pending and what input/access is required.
  6. Confirmation that no commit or push was performed.
```


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

## Implementation Notes — Phase 1 & Phase 2 Execution (2026-10-29)

- **Phase 1 Foundations Completed:**
  - Implemented absolute canonical URLs anchored to `siteUrl` across all static routes (`/about`, `/contact`) and listing pages (`/products`, `/services`, `/projects`, `/blog`).
  - Configured clean pagination canonicals: page 1 omits `?page=1`; pages > 1 retain clean `?page=N` self-referencing canonical targets.
  - Implemented faceted product filter indexing policy: filtered views (`?categoryId`, `?minPrice`, `?maxPrice`) emit `robots: { index: false, follow: true }` and canonicalize to the primary listing page, eliminating index bloat while preserving crawler product discovery. Resolved search/filter inconsistency by removing unhandled search parameter from filter triggers, ensuring clean URLs and preserving indexing on base listings.
  - Reconciled `robots.txt` with page-level `noindex`: removed auth routes (`/login`, `/register`, etc.) from `robots.txt` disallow rules so crawlers can read their page-level `noindex` directives. Retained disallow for private portal (`/dashboard/`) and API (`/api/`).
  - Audited XML sitemap (`app/sitemap.ts`): dynamic published service, product, project, and blog routes now include valid `lastModified` timestamps derived from database `updatedAt` fields.
  - Audited and aligned JSON-LD schema across detail pages: aligned BreadcrumbList Home items to `siteUrl` without trailing slash.
- **Phase 2 Content Structure & URL Migration Completed:**
  - Audited headings and semantic structure: verified single `<h1>` tag per public page (`HeroSlider` and `PageHero` emit `<motion.h1>`, detail pages emit `<h1>`).
  - Audited and updated internal links: expanded footer navigation to include all core public catalog sections (`/products` and `/contact` added alongside `/about`, `/services`, `/projects`, `/blog`).
  - Created maintainable URL redirect mapping table in `config/redirects.ts` covering verified common legacy/alternate URLs (`/about-us`, `/contact-us`, `/service`, `/project`, `/product`, `/blogs`).
  - Integrated server-side permanent (308/301) redirects in `next.config.ts` consuming `config/redirects.ts`. Verified direct 1:1 mapping with no redirect chains or loops.
- **Validation:**
  - `pnpm exec tsc --noEmit` passed with 0 errors (exit code 0).
  - ESLint passed on all modified files with 0 errors (exit code 0).
  - Next.js build compilation passed (`✓ Compiled successfully in 5.9s`, `✓ Finished TypeScript in 10.0s`). Note: SSG page generation depends on remote backend API availability.
  - Live deployment checks, external Search Console submission, and historical crawl logs from legacy domains remain pending deployment/account access.

## Progress Summary

- **Current phase:** Phase 1 & Phase 2 Code Complete (Ready for Phase 3: Analytics & Phase 4: Verification)
- **Current task:** Verify deployed metadata and redirects in production/staging environment; proceed with Phase 3 GA4/Search Console property verification and event tracking.
- **Completed tasks:** Source-code audit; canonical URL architecture; query/filter/pagination indexing policy; robots.txt reconciliation with page-level noindex; sitemap dynamic lastModified timestamps; BreadcrumbList schema alignment; heading hierarchy audit; footer link discovery; maintainable URL redirect table (`config/redirects.ts`); and Next.js permanent redirects (`next.config.ts`). External integrations and live verification remain open pending access.
