import { axiosInstance } from "@/lib/axios";
import {
  ISettings,
  ISettingsResponse,
  defaultSettingsValues,
} from "@/types/settings.type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetch public settings for public layout, metadata, tracking scripts, and cookie banner.
 * Gracefully falls back to default settings if API is unavailable.
 */
export async function getPublicSettings(): Promise<ISettings> {
  if (!API_BASE_URL) {
    return defaultSettingsValues;
  }

  try {
    const baseUrl = API_BASE_URL.replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/settings/public`, {
      next: {
        revalidate: 60,
        tags: ["site-settings"],
      },
    });

    if (!response.ok) {
      console.warn(
        `Failed to fetch public settings: ${response.status} ${response.statusText}. Using fallback defaults.`,
      );
      return defaultSettingsValues;
    }

    const json: ISettingsResponse = await response.json();
    if (json?.success && json?.data) {
      return json.data;
    }

    return defaultSettingsValues;
  } catch (error) {
    console.warn("Public settings fetch error, using fallback defaults:", error);
    return defaultSettingsValues;
  }
}

/**
 * Admin API methods
 */
export const settingsApi = {
  getAdminSettings: async (): Promise<ISettings> => {
    const res = await axiosInstance.get<ISettingsResponse>("/settings");
    return res.data.data;
  },

  updateSettings: async (
    payload: Partial<ISettings>,
  ): Promise<ISettings> => {
    const res = await axiosInstance.patch<ISettingsResponse>(
      "/settings",
      payload,
    );
    return res.data.data;
  },
};
