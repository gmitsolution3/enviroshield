"use client";

import Script from "next/script";
import { useEffect } from "react";
import {
  CONSENT_EVENT_NAME,
  VisitorConsent,
} from "@/lib/consent/consent-store";
import { setClientTrackingSettings } from "@/lib/analytics/events";
import { ISettings } from "@/types/admin/settings.type";
import { GlobalLinkTracker } from "./GlobalLinkTracker";

interface TrackingScriptsProps {
  settings: ISettings;
}

type TrackingWindow = Window & {
  gtag?: (
    command: string,
    action: string,
    params?: Record<string, unknown>,
  ) => void;
  fbq?: {
    (command: "consent", action: "grant" | "revoke"): void;
  };
};

export function TrackingScripts({ settings }: TrackingScriptsProps) {
  setClientTrackingSettings(settings);

  const { analytics, marketing, consent } = settings;

  const isConsentEnabled = Boolean(consent?.enabled);
  const ga4Enabled = Boolean(analytics?.ga4?.enabled && analytics?.ga4?.measurementId);
  const gtmEnabled = Boolean(analytics?.gtm?.enabled && analytics?.gtm?.containerId);
  const metaPixelEnabled = Boolean(
    marketing?.metaPixel?.enabled && marketing?.metaPixel?.pixelId,
  );
  const googleAdsEnabled = Boolean(
    marketing?.googleAds?.enabled && marketing?.googleAds?.conversionId,
  );

  useEffect(() => {
    // Listen for visitor consent changes and update tag consent states dynamically
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<VisitorConsent>;
      const detail = customEvent.detail;
      if (!detail) return;

      if (typeof window !== "undefined") {
        const currentWindow = window as TrackingWindow;

        // Update Google Consent Mode v2
        if (typeof currentWindow.gtag === "function") {
          currentWindow.gtag("consent", "update", {
            analytics_storage: detail.analytics ? "granted" : "denied",
            ad_storage: detail.marketing ? "granted" : "denied",
            ad_user_data: detail.marketing ? "granted" : "denied",
            ad_personalization: detail.marketing ? "granted" : "denied",
          });
        }

        // Update Meta Pixel consent
        if (typeof currentWindow.fbq === "function") {
          if (detail.marketing) {
            currentWindow.fbq("consent", "grant");
          } else {
            currentWindow.fbq("consent", "revoke");
          }
        }
      }
    };

    window.addEventListener(CONSENT_EVENT_NAME, handleConsentChange);
    return () => {
      window.removeEventListener(CONSENT_EVENT_NAME, handleConsentChange);
    };
  }, []);

  return (
    <>
      <GlobalLinkTracker />

      {/* 1. Google Consent Mode v2 Default Initialization */}
      {(ga4Enabled || gtmEnabled || googleAdsEnabled) && (
        <script
          id="google-consent-mode-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              (function() {
                var storedConsent = null;
                try {
                  var raw = localStorage.getItem('enviroshield_consent_preferences');
                  if (raw) storedConsent = JSON.parse(raw);
                } catch(e) {}

                var isConsentActive = ${isConsentEnabled ? "true" : "false"};
                var reqAnalytics = ${Boolean(consent?.requireAnalyticsConsent) ? "true" : "false"};
                var reqMarketing = ${Boolean(consent?.requireMarketingConsent) ? "true" : "false"};

                var analyticsStatus = 'granted';
                var marketingStatus = 'granted';

                if (isConsentActive) {
                  if (storedConsent && storedConsent.decided) {
                    analyticsStatus = storedConsent.analytics ? 'granted' : 'denied';
                    marketingStatus = storedConsent.marketing ? 'granted' : 'denied';
                  } else {
                    if (reqAnalytics) analyticsStatus = 'denied';
                    if (reqMarketing) marketingStatus = 'denied';
                  }
                }

                gtag('consent', 'default', {
                  'analytics_storage': analyticsStatus,
                  'ad_storage': marketingStatus,
                  'ad_user_data': marketingStatus,
                  'ad_personalization': marketingStatus,
                  'wait_for_update': 500
                });
              })();
            `,
          }}
        />
      )}

      {/* 2. Google Analytics 4 (gtag.js) */}
      {ga4Enabled && (
        <>
          <Script
            id="ga4-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics.ga4.measurementId}`}
          />
          <Script
            id="ga4-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analytics.ga4.measurementId}', {
                  send_page_view: true
                });
                ${
                  googleAdsEnabled
                    ? `gtag('config', '${marketing.googleAds.conversionId}');`
                    : ""
                }
              `,
            }}
          />
        </>
      )}

      {/* 3. Google Tag Manager */}
      {gtmEnabled && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'dataLayer','${analytics.gtm.containerId}');
            `,
          }}
        />
      )}

      {/* 4. Meta Pixel */}
      {metaPixelEnabled && (
        <Script
          id="meta-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              
              (function() {
                var storedConsent = null;
                try {
                  var raw = localStorage.getItem('enviroshield_consent_preferences');
                  if (raw) storedConsent = JSON.parse(raw);
                } catch(e) {}

                var isConsentActive = ${isConsentEnabled ? "true" : "false"};
                var reqMarketing = ${Boolean(consent?.requireMarketingConsent) ? "true" : "false"};

                if (isConsentActive && reqMarketing) {
                  if (storedConsent && storedConsent.decided && storedConsent.marketing) {
                    fbq('consent', 'grant');
                  } else {
                    fbq('consent', 'revoke');
                  }
                } else {
                  fbq('consent', 'grant');
                }

                fbq('init', '${marketing.metaPixel.pixelId}');
                fbq('track', 'PageView');
              })();
            `,
          }}
        />
      )}
    </>
  );
}
