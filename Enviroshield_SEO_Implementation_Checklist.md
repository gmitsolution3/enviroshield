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

- [ ] Generate the sitemap automatically.
- [ ] Include relevant, canonical, public URLs only.
- [ ] Keep the sitemap synchronized with published content.
- [ ] Exclude admin/private pages, duplicate URLs, noindex pages, and utility URLs.
- [ ] Reference the sitemap in `robots.txt`.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Check for sitemap errors after launch.

### 7. `robots.txt`

- [ ] Create or verify `robots.txt`.
- [ ] Reference the XML sitemap.
- [ ] Avoid blocking important pages or assets needed for rendering.
- [ ] Restrict crawling of appropriate admin, private, or utility paths.
- [ ] Confirm that important public content remains crawlable.

### 8. Indexing and Canonical Management

- [ ] Decide which page types should be indexable.
- [ ] Ensure intended public pages use appropriate index/follow directives.
- [ ] Add canonical URLs to indexable pages.
- [ ] Ensure canonical targets are valid and indexable.
- [ ] Handle duplicate URLs, query parameters, filters, and trailing-slash variations appropriately.
- [ ] Review canonical and indexing behavior for dynamic service, product, project, and blog pages.
- [ ] Evaluate whether duplicate filter pages, thank-you pages, internal search pages, and utility pages should be excluded from indexing.
- [ ] Check important URLs using Google Search Console URL Inspection.

### 9. SEO Metadata and Open Graph

- [ ] Provide CMS controls for SEO title.
- [ ] Provide CMS controls for meta description.
- [ ] Provide CMS controls for canonical URL.
- [ ] Provide CMS controls for indexing directives where appropriate.
- [ ] Provide Open Graph title, description, and image fields.
- [ ] Provide relevant structured-data fields where needed.
- [ ] Support metadata for pages, products, services, projects, and blog posts.
- [ ] Ensure titles and descriptions are unique, descriptive, and appropriate to each page.
- [ ] Verify metadata in the rendered page HTML.

### 10. Structured Data / Schema Markup

- [ ] Add appropriate `Organization` schema.
- [ ] Add `WebSite` schema where appropriate.
- [ ] Add `BreadcrumbList` schema where breadcrumbs are present.
- [ ] Add `Service` schema to relevant service pages.
- [ ] Add `Product` schema to relevant product pages, where applicable.
- [ ] Add `Article` or `BlogPosting` schema to relevant editorial content.
- [ ] Add `LocalBusiness` schema only if applicable and supported by accurate business details.
- [ ] Ensure schema matches visible page content.
- [ ] Validate structured data and fix relevant errors.

### 11. SEO-Friendly Content and Site Structure

- [ ] Use clear, meaningful URLs.
- [ ] Maintain a logical heading hierarchy.
- [ ] Use semantic HTML.
- [ ] Add descriptive alt text to meaningful images.
- [ ] Ensure navigation links are crawlable.
- [ ] Add breadcrumbs where useful.
- [ ] Build useful internal links between related pages.
- [ ] Review duplicate or thin content.
- [ ] Check for broken links and incorrect HTTP status codes.
- [ ] Ensure important content can be rendered and discovered by search engines.
- [ ] Check mobile layouts and usability.

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
- [ ] Optimize image sizes and delivery.
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

## Recommended Implementation Phases

Work through the phases in order. Mark each task complete only after implementation and verification. We will use this file to track the agreed status.

### Phase 1 — SEO Foundation

- [ ] Audit the existing website and current SEO setup.
- [ ] Plan the SEO metadata architecture.
- [ ] Implement or verify XML sitemap generation.
- [ ] Implement or verify `robots.txt`.
- [ ] Implement canonical URL handling.
- [ ] Implement indexability controls.
- [ ] Implement appropriate structured data/schema markup.

**Phase 1 status:** Not started

### Phase 2 — Content Structure and Migration

- [ ] Review page structure, headings, semantic HTML, breadcrumbs, and internal linking.
- [ ] Ensure meaningful URLs and image alt text.
- [ ] Add SEO fields to the CMS for relevant content types.
- [ ] Audit existing URLs and create an old-to-new URL map.
- [ ] Implement and test 301 redirects for changed URLs.
- [ ] Check for broken links, 404s, and duplicate-content issues.

**Phase 2 status:** Not started

### Phase 3 — Analytics and Conversions

- [ ] Set up or verify Google Search Console.
- [ ] Set up or verify GA4.
- [ ] Implement and test lead/conversion events.
- [ ] Decide whether GTM is needed and configure it if required.
- [ ] Decide whether Meta Pixel and Google Ads conversion tracking are needed and configure them if required.

**Phase 3 status:** Not started

### Phase 4 — Verification and Post-Launch Monitoring

- [ ] Test performance and Core Web Vitals.
- [ ] Test mobile usability and rendering.
- [ ] Verify metadata, canonicals, indexing directives, and structured data.
- [ ] Verify `robots.txt` and sitemap submission/status.
- [ ] Test redirects and fix broken links/404s.
- [ ] Verify GA4 data and conversion events.
- [ ] Review Search Console crawl/indexing reports and indexed/excluded URLs.
- [ ] Monitor organic traffic, impressions, clicks, CTR, queries, and positions after launch.

**Phase 4 status:** Not started

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
- **Current task:** Audit the existing website and current SEO setup
- **Completed tasks:** None confirmed yet
