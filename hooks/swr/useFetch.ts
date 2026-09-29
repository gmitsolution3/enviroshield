import useSWR, { SWRConfiguration } from "swr";
import { fetcher } from "@/lib/fetchers/fetcher";

type TFetchParams = Record<string, any>;

type UseFetchOptions<T> = SWRConfiguration<T> & {
  params?: TFetchParams;
};

export const useFetch = <T = any>(
  url: string | null,
  options?: UseFetchOptions<T>,
) => {
  const { params, ...swrOptions } = options || {};

  const key = url ? (params ? [url, params] : url) : null;

  const { data, error, isLoading, mutate, isValidating } = useSWR<T>(
    key,
    fetcher,
    { ...swrOptions, revalidateOnFocus: false },
  );

  return {
    data,
    isLoading: isLoading || isValidating,
    isError: error,
    refetch: mutate,
  };
};