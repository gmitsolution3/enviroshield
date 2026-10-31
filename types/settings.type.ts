export interface ISeoSettings {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
  googleVerificationToken: string;
  bingVerificationToken: string;
  defaultRobots: {
    index: boolean;
    follow: boolean;
  };
}

export interface IGa4Settings {
  enabled: boolean;
  measurementId: string;
  label?: string;
}

export interface IGtmSettings {
  enabled: boolean;
  containerId: string;
}

export interface IAnalyticsSettings {
  ga4: IGa4Settings;
  gtm: IGtmSettings;
}

export interface IMetaPixelSettings {
  enabled: boolean;
  pixelId: string;
}

export interface IGoogleAdsConversionLabels {
  contactForm?: string;
  quoteRequest?: string;
  consultationRequest?: string;
  phoneClick?: string;
  emailClick?: string;
  whatsappClick?: string;
}

export interface IGoogleAdsSettings {
  enabled: boolean;
  conversionId: string;
  conversionLabels: IGoogleAdsConversionLabels;
}

export interface IMarketingSettings {
  metaPixel: IMetaPixelSettings;
  googleAds: IGoogleAdsSettings;
}

export interface IConsentSettings {
  enabled: boolean;
  requireAnalyticsConsent: boolean;
  requireMarketingConsent: boolean;
  bannerTitle: string;
  bannerDescription: string;
}

export interface ISettings {
  seo: ISeoSettings;
  analytics: IAnalyticsSettings;
  marketing: IMarketingSettings;
  consent: IConsentSettings;
}

export interface ISettingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ISettings;
}

export const defaultSettingsValues: ISettings = {
  seo: {
    siteName: "Enviroshield",
    defaultTitle: "Enviroshield | Nano-Polymer Coatings & Waterproofing",
    defaultDescription:
      "Advanced waterproofing, corrosion protection, heat-reflective coatings and construction chemicals across Bangladesh.",
    defaultOgImage: "",
    googleVerificationToken: "",
    bingVerificationToken: "",
    defaultRobots: {
      index: true,
      follow: true,
    },
  },
  analytics: {
    ga4: {
      enabled: false,
      measurementId: "",
      label: "",
    },
    gtm: {
      enabled: false,
      containerId: "",
    },
  },
  marketing: {
    metaPixel: {
      enabled: false,
      pixelId: "",
    },
    googleAds: {
      enabled: false,
      conversionId: "",
      conversionLabels: {
        contactForm: "",
        quoteRequest: "",
        consultationRequest: "",
        phoneClick: "",
        emailClick: "",
        whatsappClick: "",
      },
    },
  },
  consent: {
    enabled: true,
    requireAnalyticsConsent: true,
    requireMarketingConsent: true,
    bannerTitle: "We respect your privacy",
    bannerDescription:
      "We use cookies to improve your browsing experience, provide personalized content, and analyze our traffic. You can choose which cookies to allow.",
  },
};

