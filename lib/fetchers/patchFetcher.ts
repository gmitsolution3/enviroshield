import { axiosInstance } from "../axios";

type PatchArg = {
  id: string | number;
  data: any;
};

export const patchFetcher = async (
  url: string,
  { arg }: { arg: PatchArg },
) => {
  const { id, data } = arg;

  const res = await axiosInstance.patch(`${url}/${id}`, data);
  return res.data;
};