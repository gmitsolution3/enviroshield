import fs from "fs";
import path from "path";
import assert from "assert";

console.log("=== ENVIROSHIELD SETTINGS, TRACKING & CONSENT VERIFICATION SUITE ===\n");

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`✓ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ [FAIL] ${name}`);
    console.error(`  Error: ${err.message}`);
  }
}

const rootDir = path.resolve(".");
const frontendDir = path.join(rootDir, "frontend");
const backendDir = path.join(rootDir, "backend");

// 1. Backend Settings Schema & Module Check
test("Backend settings module, model, and routes are configured", () => {
  const modelPath = path.join(backendDir, "src/modules/settings/settings.model.ts");
  const routePath = path.join(backendDir, "src/modules/settings/settings.route.ts");
  const routesIndexPath = path.join(backendDir, "src/routes/index.ts");

  assert(fs.existsSync(modelPath), "settings.model.ts must exist");
  assert(fs.existsSync(routePath), "settings.route.ts must exist");
  assert(fs.existsSync(routesIndexPath), "routes/index.ts must exist");

  const modelContent = fs.readFileSync(modelPath, "utf8");
  assert(modelContent.includes("seo:"), "Model must include seo section");
  assert(modelContent.includes("analytics:"), "Model must include analytics section");
  assert(modelContent.includes("marketing:"), "Model must include marketing section");
  assert(modelContent.includes("consent:"), "Model must include consent section");

  const routesIndex = fs.readFileSync(routesIndexPath, "utf8");
  assert(routesIndex.includes("settingsRoutes"), "routes/index.ts must import settingsRoutes");
  assert(routesIndex.includes('path: "/settings"'), "routes/index.ts must mount /settings");
});

// 2. Backend Validation Rules Check
test("Backend Zod validation enforces format regexes for GA4, GTM, Meta Pixel, and Google Ads", () => {
  const validationPath = path.join(backendDir, "src/modules/settings/settings.validation.ts");
  assert(fs.existsSync(validationPath), "settings.validation.ts must exist");
  const content = fs.readFileSync(validationPath, "utf8");

  assert(content.includes("/^G-[A-Z0-9]+$/i"), "Must validate GA4 Measurement ID format");
  assert(content.includes("/^GTM-[A-Z0-9]+$/i"), "Must validate GTM Container ID format");
  assert(content.includes("/^\\d{8,20}$/"), "Must validate Meta Pixel numeric ID format");
  assert(content.includes("/^(AW-)?[0-9]+$/i"), "Must validate Google Ads Conversion ID format");
});

// 3. Backend Authorization Guard Check
test("Backend routes enforce admin authentication and authorization for settings modifications", () => {
  const routePath = path.join(backendDir, "src/modules/settings/settings.route.ts");
  const content = fs.readFileSync(routePath, "utf8");

  assert(content.includes("authenticate"), "Must require authenticate middleware");
  assert(content.includes('authorize("admin")'), "Must require admin role authorization");
  assert(content.includes('router.get("/public"'), "Must expose public endpoint without admin requirement");
});

// 4. Frontend API Client & Fallbacks
test("Frontend API exports getPublicSettings and admin settings methods with fallback", () => {
  const apiPath = path.join(frontendDir, "lib/api/settings.ts");
  assert(fs.existsSync(apiPath), "lib/api/settings.ts must exist");
  const content = fs.readFileSync(apiPath, "utf8");

  assert(content.includes("export async function getPublicSettings()"), "Must export getPublicSettings");
  assert(content.includes("defaultSettingsValues"), "Must fallback to defaultSettingsValues on failure");
  assert(content.includes("settingsApi = {"), "Must export settingsApi object");
  assert(content.includes("getAdminSettings:"), "Must provide getAdminSettings");
  assert(content.includes("updateSettings:"), "Must provide updateSettings");
});

// 5. Admin Settings Page & Tab Architecture
test("Admin Settings page supports SEO, Analytics, Advertising, Consent, and preserved Account cards", () => {
  const pagePath = path.join(frontendDir, "app/(dashboard)/dashboard/(admin-dashboard)/settings/page.tsx");
  const managerPath = path.join(frontendDir, "components/dashboard/admin/settings/AdminSettingsManager.tsx");

  assert(fs.existsSync(pagePath), "settings/page.tsx must exist in (admin-dashboard)");
  assert(fs.existsSync(managerPath), "AdminSettingsManager.tsx must exist");

  const pageContent = fs.readFileSync(pagePath, "utf8");
  assert(pageContent.includes('requireRole("admin")'), "Must enforce admin role authorization");
  assert(pageContent.includes("<AdminSettingsManager"), "Must render AdminSettingsManager");

  const managerContent = fs.readFileSync(managerPath, "utf8");
  assert(managerContent.includes("General SEO"), "Must have General SEO tab");
  assert(managerContent.includes("Analytics"), "Must have Analytics tab");
  assert(managerContent.includes("Advertising"), "Must have Advertising tab");
  assert(managerContent.includes("Privacy & Consent") || managerContent.includes("consent"), "Must have Privacy & Consent tab");
  assert(managerContent.includes("Preferences"), "Must preserve Preferences card");
  assert(managerContent.includes("Security"), "Must preserve Security card");
  assert(managerContent.includes("Danger zone"), "Must preserve Danger zone card");
});

// 6. Public SEO Verification Meta Tags
test("Root layout generateMetadata renders Google and Bing verification tags dynamically", () => {
  const layoutPath = path.join(frontendDir, "app/layout.tsx");
  assert(fs.existsSync(layoutPath), "app/layout.tsx must exist");
  const content = fs.readFileSync(layoutPath, "utf8");

  assert(content.includes("export async function generateMetadata()"), "generateMetadata must be dynamic async function");
  assert(content.includes("getPublicSettings()"), "generateMetadata must query getPublicSettings()");
  assert(content.includes("verification.google = settings.seo.googleVerificationToken"), "Must set verification.google");
  assert(content.includes('"msvalidate.01": settings.seo.bingVerificationToken'), "Must set Bing verification tag");
  assert(content.includes("<TrackingScripts"), "RootLayout must render TrackingScripts");
  assert(content.includes("<CookieConsentBanner"), "RootLayout must render CookieConsentBanner");
});

// 7. Tracking Scripts & Google Consent Mode v2
test("Tracking scripts implement Google Consent Mode v2 and reactive consent updates", () => {
  const trackingPath = path.join(frontendDir, "components/tracking/TrackingScripts.tsx");
  assert(fs.existsSync(trackingPath), "TrackingScripts.tsx must exist");
  const content = fs.readFileSync(trackingPath, "utf8");

  assert(content.includes("google-consent-mode-init"), "Must include consent mode initialization");
  assert(content.includes("gtag('consent', 'default'"), "Must initialize default consent state");
  assert(content.includes('gtag("consent", "update"') || content.includes("gtag('consent', 'update'"), "Must reactively update consent mode upon changes");
  assert(content.includes("fbq('consent', 'grant')"), "Must grant Meta Pixel consent upon permission");
  assert(content.includes("fbq('consent', 'revoke')"), "Must revoke Meta Pixel consent when withheld");
});

// 8. Cookie Consent Banner & Preferences Reopening
test("Cookie consent banner supports Accept All, Reject Non-Essential, Customize, and Footer reopening", () => {
  const bannerPath = path.join(frontendDir, "components/consent/CookieConsentBanner.tsx");
  const footerPath = path.join(frontendDir, "components/Footer.tsx");
  const buttonPath = path.join(frontendDir, "components/consent/CookiePreferencesButton.tsx");

  assert(fs.existsSync(bannerPath), "CookieConsentBanner.tsx must exist");
  assert(fs.existsSync(buttonPath), "CookiePreferencesButton.tsx must exist");

  const bannerContent = fs.readFileSync(bannerPath, "utf8");
  assert(bannerContent.includes("handleAcceptAll"), "Must support Accept All");
  assert(bannerContent.includes("handleRejectNonEssential"), "Must support Reject Non-Essential");
  assert(bannerContent.includes("handleSavePreferences"), "Must support granular preferences");
  assert(bannerContent.includes("OPEN_PREFERENCES_EVENT"), "Must listen for reopening event");

  const footerContent = fs.readFileSync(footerPath, "utf8");
  assert(footerContent.includes("CookiePreferencesButton"), "Footer must render CookiePreferencesButton");
});

// 9. Conversion Event Architecture
test("Conversion events trigger on form success and phone/email/whatsapp clicks respecting consent", () => {
  const eventsPath = path.join(frontendDir, "lib/analytics/events.ts");
  const linkTrackerPath = path.join(frontendDir, "components/tracking/GlobalLinkTracker.tsx");
  const contactFormPath = path.join(frontendDir, "components/ContactForm.tsx");
  const bookingFormPath = path.join(frontendDir, "components/services/ServiceBookingForm.tsx");

  assert(fs.existsSync(eventsPath), "events.ts must exist");
  assert(fs.existsSync(linkTrackerPath), "GlobalLinkTracker.tsx must exist");

  const eventsContent = fs.readFileSync(eventsPath, "utf8");
  assert(eventsContent.includes("trackConversion"), "Must export trackConversion function");
  assert(eventsContent.includes("allowAnalytics"), "Must check analytics consent before firing GA4/GTM");
  assert(eventsContent.includes("allowMarketing"), "Must check marketing consent before firing Meta/Ads");
  assert(eventsContent.includes("label") && eventsContent.includes("label.trim().length > 0"), "Strictly must only send Google Ads conversion when label is configured");

  const linkTrackerContent = fs.readFileSync(linkTrackerPath, "utf8");
  assert(linkTrackerContent.includes("phone_number_clicked"), "Must track phone clicks");
  assert(linkTrackerContent.includes("email_link_clicked"), "Must track email clicks");
  assert(linkTrackerContent.includes("whatsapp_link_clicked"), "Must track WhatsApp clicks");

  const contactContent = fs.readFileSync(contactFormPath, "utf8");
  assert(contactContent.includes('trackConversion("contact_form_submitted"'), "ContactForm must trigger contact_form_submitted on success");

  const bookingContent = fs.readFileSync(bookingFormPath, "utf8");
  assert(bookingContent.includes('trackConversion("consultation_booking_submitted"'), "ServiceBookingForm must trigger consultation_booking_submitted on success");
});

console.log(`\nResults: ${passed}/${total} tests passed.`);
if (passed !== total) {
  process.exit(1);
}
