import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, "..");

console.log("=== ENVIROSHIELD SEO VERIFICATION SUITE ===\n");

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`✓ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ [FAIL] ${name}:`, err.message);
  }
}

// 1. Verify siteUrl definition
test("lib/site-url.ts exports valid absolute URL without trailing slash", () => {
  const content = fs.readFileSync(path.join(frontendRoot, "lib/site-url.ts"), "utf8");
  assert(content.includes("https://enviroshieldbd.com"), "Must contain default production origin");
  assert(content.includes("replace(/\\/+$/, \"\")"), "Must strip trailing slashes");
});

// 2. Verify robots.ts configuration
test("app/robots.ts has valid crawl rules and correct sitemap reference", () => {
  const content = fs.readFileSync(path.join(frontendRoot, "app/robots.ts"), "utf8");
  assert(content.includes('allow: "/"'), "Must allow root");
  assert(content.includes('"/dashboard/"'), "Must disallow /dashboard/");
  assert(content.includes('"/api/"'), "Must disallow /api/");
  assert(!content.includes('"/login"'), "Auth routes must not be in robots.txt disallow (to allow crawling page noindex)");
  assert(!content.includes('"/register"'), "Register must not be in robots.txt disallow");
  assert(content.includes("sitemap: `${siteUrl}/sitemap.xml`"), "Must reference absolute sitemap");
});

// 3. Verify sitemap.ts dynamic routes and lastModified
test("app/sitemap.ts includes static routes and dynamic routes with lastModified", () => {
  const content = fs.readFileSync(path.join(frontendRoot, "app/sitemap.ts"), "utf8");
  assert(content.includes("url: siteUrl"), "Must contain homepage");
  assert(content.includes("url: `${siteUrl}/about`"), "Must contain /about");
  assert(content.includes("url: `${siteUrl}/services`"), "Must contain /services");
  assert(content.includes("url: `${siteUrl}/projects`"), "Must contain /projects");
  assert(content.includes("url: `${siteUrl}/products`"), "Must contain /products");
  assert(content.includes("url: `${siteUrl}/blog`"), "Must contain /blog");
  assert(content.includes("url: `${siteUrl}/contact`"), "Must contain /contact");
  assert(content.includes("lastModified: service.updatedAt"), "Services must map updatedAt to lastModified");
  assert(content.includes("lastModified: project.updatedAt"), "Projects must map updatedAt to lastModified");
  assert(content.includes("lastModified: product.updatedAt"), "Products must map updatedAt to lastModified");
  assert(content.includes("lastModified: post.updatedAt"), "Blog must map updatedAt to lastModified");
  assert(content.includes('service.seo?.noIndex !== true'), "Must exclude seo.noIndex services");
  assert(content.includes('product.seo?.noIndex !== true'), "Must exclude seo.noIndex products");
});

// 4. Verify canonical URLs on static pages
test("About and Contact pages have explicit absolute canonical URLs", () => {
  const about = fs.readFileSync(path.join(frontendRoot, "app/(main)/about/page.tsx"), "utf8");
  assert(about.includes("canonical: `${siteUrl}/about`"), "About must canonicalize to ${siteUrl}/about");

  const contact = fs.readFileSync(path.join(frontendRoot, "app/(main)/contact/page.tsx"), "utf8");
  assert(contact.includes("canonical: `${siteUrl}/contact`"), "Contact must canonicalize to ${siteUrl}/contact");
});

// 5. Verify listing pages canonical & pagination policies
test("Listing pages (services, projects, blog) use clean page 1 & paginated canonicals", () => {
  for (const route of ["services", "projects", "blog"]) {
    const page = fs.readFileSync(path.join(frontendRoot, `app/(main)/${route}/page.tsx`), "utf8");
    assert(page.includes(`isFirstPage`), `${route} must distinguish first page`);
    assert(page.includes(`\${siteUrl}/${route}`), `${route} must have absolute clean canonical`);
    assert(page.includes(`\${siteUrl}/${route}?page=\${page}`), `${route} must have paginated canonical`);
  }
});

// 6. Verify products listing search/filter indexing consistency
test("Products listing: filters emit noindex, follow; unhandled queries do not trigger false noindex", () => {
  const page = fs.readFileSync(path.join(frontendRoot, "app/(main)/products/page.tsx"), "utf8");
  assert(page.includes("hasCategory = /^[0-9a-fA-F]{24}$/.test(rawCategoryId)"), "Must validate MongoDB hex ID for category filter");
  assert(page.includes("hasFilters = hasCategory || hasPrice"), "Metadata hasFilters must match page hasFilters exactly");
  assert(!page.includes("hasSearch"), "Metadata must not check search query when UI does not support search");
  assert(page.includes("index: !hasFilters"), "Must set robots index to false when filters are active");
  assert(page.includes("follow: true"), "Must allow crawlers to follow links when filtered");
});

// 7. Verify dynamic detail pages breadcrumbs JSON-LD Home item alignment
test("Dynamic detail pages use canonical siteUrl for Home in BreadcrumbList", () => {
  for (const route of [
    "services/[slug]/page.tsx",
    "projects/[slug]/page.tsx",
    "products/[slug]/page.tsx",
    "blog/[slug]/page.tsx",
  ]) {
    const page = fs.readFileSync(path.join(frontendRoot, `app/(main)/${route}`), "utf8");
    assert(page.includes('item: siteUrl,'), `${route} BreadcrumbList Home item must use siteUrl without trailing slash`);
    assert(!page.includes('item: `${siteUrl}/`,'), `${route} must not use trailing slash on Home item`);
  }
});

// 8. Verify redirects configuration
test("config/redirects.ts: all destinations exist and no loops or chains occur", () => {
  const redirectsFile = fs.readFileSync(path.join(frontendRoot, "config/redirects.ts"), "utf8");
  
  // Extract source and destination pairs
  const regex = /source:\s*"([^"]+)",\s*destination:\s*"([^"]+)"/g;
  const pairs = [];
  let match;
  while ((match = regex.exec(redirectsFile)) !== null) {
    pairs.push({ source: match[1], destination: match[2] });
  }

  assert(pairs.length > 0, "Redirects list must not be empty");

  const sources = new Set(pairs.map((p) => p.source));
  for (const pair of pairs) {
    assert(!pair.source.includes("//"), `Invalid source: ${pair.source}`);
    assert(!pair.destination.includes("//"), `Invalid destination: ${pair.destination}`);
    assert(pair.source !== pair.destination, `Self-redirect detected: ${pair.source}`);
    assert(!sources.has(pair.destination), `Redirect chain detected: ${pair.source} -> ${pair.destination}`);
  }

  // Ensure next.config.ts consumes config/redirects.ts
  const nextConfig = fs.readFileSync(path.join(frontendRoot, "next.config.ts"), "utf8");
  assert(nextConfig.includes('import { urlRedirects } from "./config/redirects"'), "next.config.ts must import urlRedirects");
  assert(nextConfig.includes("async redirects()"), "next.config.ts must implement redirects()");
});

// 9. Verify footer navigation
test("components/Footer.tsx includes all core public catalog links", () => {
  const footer = fs.readFileSync(path.join(frontendRoot, "components/Footer.tsx"), "utf8");
  assert(footer.includes('href: "/about"'), "Footer must link to /about");
  assert(footer.includes('href: "/services"'), "Footer must link to /services");
  assert(footer.includes('href: "/projects"'), "Footer must link to /projects");
  assert(footer.includes('href: "/products"'), "Footer must link to /products");
  assert(footer.includes('href: "/blog"'), "Footer must link to /blog");
  assert(footer.includes('href: "/contact"'), "Footer must link to /contact");
});

console.log(`\nResults: ${passed}/${total} tests passed.\n`);
if (passed !== total) {
  process.exit(1);
}

