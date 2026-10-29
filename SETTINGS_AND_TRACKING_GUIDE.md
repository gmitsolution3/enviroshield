# Enviroshield — SEO, Analytics, Marketing & Consent Management Guide

This document explains the architecture, configuration options, provider setups, consent enforcement, and testing procedures for the centralized settings system in Enviroshield.

---

## 1. Architecture Overview

Configuration is centralized in MongoDB via the backend `Settings` singleton document model, accessible through protected admin APIs and a cached public endpoint.

```
┌────────────────────────────────┐
│   Admin Settings Dashboard     │ (/dashboard/settings)
└───────────────┬────────────────┘
                │ PATCH /settings (Role: admin)
                ▼
┌────────────────────────────────┐
│      Backend Settings API      │ (Express + Mongoose + Zod)
└───────────────┬────────────────┘
                │ GET /settings/public (Revalidate: 60s)
                ▼
┌────────────────────────────────┐
│   Public Website & Tracking    │ (app/layout.tsx, Next/Script)
│   - Metadata & Verification    │
│   - Google Consent Mode v2     │
│   - GA4 / GTM / Meta Pixel     │
│   - Cookie Consent Banner      │
└────────────────────────────────┘
```

- **Storage Location:** MongoDB collection `settings` (singleton record).
- **Backend Module:** `backend/src/modules/settings/`
  - Model: `settings.model.ts`
  - Validation: `settings.validation.ts`
  - Controller: `settings.controller.ts`
  - Routes: `settings.route.ts` (`/public`, `/`)
- **Frontend Dashboard:** `frontend/components/dashboard/admin/settings/`
  - Page: `frontend/app/(dashboard)/dashboard/(general-dashboard)/settings/page.tsx`
  - Tabs: General SEO, Analytics, Advertising, Privacy & Consent, Account Preferences.
- **Public Integration:**
  - Metadata & Verification: `frontend/app/layout.tsx` (`generateMetadata`)
  - Tracking Scripts: `frontend/components/tracking/TrackingScripts.tsx`
  - Cookie Consent Banner & Dialog: `frontend/components/consent/CookieConsentBanner.tsx`
  - Reopen Preferences: `frontend/components/consent/CookiePreferencesButton.tsx` (in `Footer.tsx`)
  - Event Dispatcher: `frontend/lib/analytics/events.ts`

---

## 2. Supported Settings & Identifier Formats

| Category | Field | Required Format / Type | Purpose |
| :--- | :--- | :--- | :--- |
| **General SEO** | `siteName` | String | Global brand name in title templates and Open Graph. |
| | `defaultTitle` | String | Fallback title for routes without custom metadata. |
| | `defaultDescription`| String | Fallback meta description (140–160 chars recommended). |
| | `defaultOgImage` | String / URL | Fallback social-share image. |
| | `googleVerificationToken` | String | Meta tag token: `<meta name="google-site-verification" content="..." />`. |
| | `bingVerificationToken` | String | Meta tag token: `<meta name="msvalidate.01" content="..." />`. |
| | `defaultRobots` | `{ index: boolean, follow: boolean }` | Baseline public crawl/index rules. |
| **Analytics** | `ga4.enabled` | Boolean | Enable/disable direct GA4 gtag.js measurement. |
| | `ga4.measurementId` | `^G-[A-Z0-9]+$` (e.g. `G-XXXXXXXXXX`) | Google Analytics 4 data stream identifier. |
| | `gtm.enabled` | Boolean | Enable/disable Google Tag Manager container. |
| | `gtm.containerId` | `^GTM-[A-Z0-9]+$` (e.g. `GTM-XXXXXXX`) | Google Tag Manager Web Container ID. |
| **Advertising** | `metaPixel.enabled` | Boolean | Enable/disable Meta Pixel tracking. |
| | `metaPixel.pixelId` | `^\d{8,20}$` (numeric digits) | Meta Events Manager Pixel ID. |
| | `googleAds.enabled` | Boolean | Enable/disable Google Ads conversion reporting. |
| | `googleAds.conversionId` | `^(AW-)?[0-9]+$` (e.g. `AW-123456789`) | Google Ads Conversion Tracking ID. |
| | `googleAds.conversionLabels` | Alphanumeric string per action | Label mapping for conversions (see Section 5). |
| **Consent** | `enabled` | Boolean | Toggle public cookie banner and consent checks. |
| | `requireAnalyticsConsent` | Boolean | Block GA4/GTM until visitor grants analytics permission. |
| | `requireMarketingConsent` | Boolean | Block Meta Pixel / Ads until visitor grants marketing permission. |
| | `bannerTitle` | String | Header text on the floating consent banner. |
| | `bannerDescription` | String | Body text explaining tracking and cookies. |

---

## 3. How to Configure Providers

### A. Google Search Console Verification
1. Open [Google Search Console](https://search.google.com/search-console).
2. Choose **Add Property** $\rightarrow$ **URL Prefix** (`https://enviroshieldbd.com`).
3. Select **HTML tag** as the verification method.
4. Copy only the value inside `content="..."` (e.g. `dBj...`).
5. In Enviroshield Admin Dashboard $\rightarrow$ **Settings** $\rightarrow$ **General SEO**, paste it into **Google Search Console Verification Token** and click **Save Settings**.
6. Return to Google Search Console and click **Verify**.

### B. Google Analytics 4 (GA4)
1. In Google Analytics, navigate to **Admin** $\rightarrow$ **Data Streams** $\rightarrow$ select your Web Stream.
2. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`).
3. In Enviroshield Admin Dashboard $\rightarrow$ **Settings** $\rightarrow$ **Analytics**, toggle **Google Analytics 4** to ON, paste your Measurement ID, and click **Save Settings**.
4. *Important:* If your Google Tag Manager container already loads GA4, keep direct GA4 toggled OFF to prevent double-counting page views.

### C. Google Tag Manager (GTM)
1. In Google Tag Manager, locate your **Container ID** in the top navigation bar (format: `GTM-XXXXXXX`).
2. In Enviroshield Admin Dashboard $\rightarrow$ **Settings** $\rightarrow$ **Analytics**, toggle **Google Tag Manager** to ON, paste your Container ID, and click **Save Settings**.

### D. Meta Pixel
1. In [Meta Events Manager](https://business.facebook.com/events_manager2), go to **Data Sources** and copy your **Pixel ID** (15–16 digit number).
2. In Enviroshield Admin Dashboard $\rightarrow$ **Settings** $\rightarrow$ **Advertising**, toggle **Meta Pixel** to ON, paste your Pixel ID, and click **Save Settings**.

---

## 4. Consent Management & Google Consent Mode v2

The system implements strict **Google Consent Mode v2** and persistent client-side consent storage:

1. **Default State:**
   - Before visitor interaction, Google Consent Mode initializes with denied states:
     - `analytics_storage: 'denied'`
     - `ad_storage: 'denied'`
     - `ad_user_data: 'denied'`
     - `ad_personalization: 'denied'`
   - Meta Pixel initializes in revoked mode (`fbq('consent', 'revoke')`).
2. **Visitor Actions:**
   - **Accept All:** Grants both analytics and marketing permissions immediately. Signals are dispatched to Google Tag Manager / gtag and Meta Pixel (`fbq('consent', 'grant')`).
   - **Reject Non-Essential:** Retains denied status for non-essential cookies while allowing core website functionality.
   - **Customize / Manage Preferences:** Opens the modal to toggle Analytics and Marketing individually.
3. **Reopening Consent Preferences:**
   - Visitors can change or withdraw consent at any time by clicking the **Cookie Preferences** button in the website footer.
   - When consent is withdrawn, subsequent non-essential tracking is instantly halted.

---

## 5. Conversion Tracking Architecture

High-intent user actions trigger centralized conversions via `trackConversion(action, payload)` in `frontend/lib/analytics/events.ts`:

| Conversion Action | Trigger Condition | GA4 / GTM Event | Meta Pixel Event | Google Ads Action |
| :--- | :--- | :--- | :--- | :--- |
| `contact_form_submitted` | Successful lead form submit (`response.success === true`) | `contact_form_submitted` | `Lead` | `conversionLabels.contactForm` |
| `consultation_booking_submitted` | Successful booking submit (`response.data._id` exists) | `consultation_booking_submitted` | `Schedule` | `conversionLabels.consultationRequest` |
| `quote_request_submitted` | Successful quote form submit | `quote_request_submitted` | `Lead` | `conversionLabels.quoteRequest` |
| `phone_number_clicked` | Click on any `tel:` link | `phone_number_clicked` | `Contact` | `conversionLabels.phoneClick` |
| `email_link_clicked` | Click on any `mailto:` link | `email_link_clicked` | `Contact` | `conversionLabels.emailClick` |
| `whatsapp_link_clicked` | Click on WhatsApp link (`wa.me` / `whatsapp.com`) | `whatsapp_link_clicked` | `Contact` | `conversionLabels.whatsappClick` |

### Google Ads Conversion Safety Rule
Conversions are only transmitted to Google Ads if a label is explicitly defined in the settings:
```ts
if (label && label.trim().length > 0) {
  gtag('event', 'conversion', { send_to: `${conversionId}/${label}` });
}
```
If an action has no configured label, no blank, synthetic, or failed conversion request is emitted.

---

## 6. Testing & Quality Verification

### Verifying GA4 & GTM
1. Open the website in Chrome with the **Google Analytics Debugger** extension or GTM **Tag Assistant Preview**.
2. Confirm `gtag('consent', 'default', { ... })` initializes.
3. On the Cookie Banner, click **Accept All** and verify that `consent update` fires with `'granted'` status.
4. Verify page_view fires in the GA4 Realtime DebugView.

### Verifying Meta Pixel
1. Open the website with the **Meta Pixel Helper** extension.
2. When the page loads before consent, observe `PageView` is held or marked consent-restricted.
3. Click **Accept All**; observe `fbq('consent', 'grant')` and subsequent events.
4. Submit the contact form; observe the `Lead` event fire with non-PII category details.

---

## 7. Known Architectural Notes & Next Steps

1. **Next.js Revalidation:** The public settings endpoint is cached with Next.js ISR (`next: { revalidate: 60, tags: ["site-settings"] }`). Updates saved in the Admin Dashboard become visible across public server components within 60 seconds.
2. **Graceful Build Fallbacks:** If the backend database or API is temporarily unreachable during Next.js static page prerendering, `getPublicSettings()` automatically uses default brand settings so builds never fail.
3. **External Dependencies:**
   - GSC property ownership requires clicking "Verify" in Search Console after saving the token.
   - GA4 and Meta Pixel require active web data streams configured in Google and Meta consoles.
