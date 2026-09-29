import { axiosInstance } from "../axios";

export const deleteFetcher = async (
  url: string,
  { arg }: { arg: string | number },
) => {
  const res = await axiosInstance.delete(`${url}/${arg}`);
  return res.data;
};
