import { axiosInstance } from "./../axios";

type TFetchParams = Record<string, any>;

export const fetcher = async (
  key: string | [string, TFetchParams],
) => {
  if (typeof key === "string") {
    const res = await axiosInstance.get(key);
    return res.data;
  }

  const [url, params] = key;
  const res = await axiosInstance.get(url, { params });
  return res.data;
};
