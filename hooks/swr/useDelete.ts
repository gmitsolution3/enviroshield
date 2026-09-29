// hooks/useDelete.ts
import { deleteFetcher } from "@/lib/fetchers/deleteFetcher";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

type UseDeleteOptions = {
  revalidateKey?: string | string[];
};

export const useDelete = (
  url: string,
  options?: UseDeleteOptions,
) => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    url,
    deleteFetcher,
    {
      onSuccess: () => {
        if (!options?.revalidateKey) return;

        const keys = Array.isArray(options.revalidateKey)
          ? options.revalidateKey
          : [options.revalidateKey];

        keys.forEach((key) => mutate(key));
      },
    },
  );

  return {
    data,
    isLoading: isMutating,
    isError: error,
    mutate: trigger,
  };
};
