import { axiosInstance } from "@/lib/axios";

export const postFetcher = async (
  url: string,
  { arg }: { arg: any }
) => {
  const res = await axiosInstance.post(url, arg);
  return res.data;
};