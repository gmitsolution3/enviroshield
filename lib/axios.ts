import axios from "axios";
import { authClient } from "./auth-client";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const { data: session } = await authClient.getSession();

  if (session!.session?.token) {
    config.headers.Authorization = `Bearer ${session!.session?.token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error.response.data);
  },
);

export { axiosInstance };
