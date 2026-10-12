const configuredSiteUrl =
  process.env.SITE_URL || "https://enviroshieldbd.com";

export const siteUrl = configuredSiteUrl.replace(/\/+$/, "");
