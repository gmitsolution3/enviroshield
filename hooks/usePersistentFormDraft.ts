"use client";

import { useCallback, useEffect, useRef } from "react";
import type {
  DefaultValues,
  FieldValues,
  UseFormReset,
  UseFormWatch,
} from "react-hook-form";

type UsePersistentFormDraftOptions<T extends FieldValues> = {
  storageKey: string;
  watch: UseFormWatch<T>;
  reset: UseFormReset<T>;
  defaultValues: DefaultValues<T>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function mergeWithDefaults<T>(defaults: T, saved: unknown): T {
  if (!isRecord(defaults) || !isRecord(saved)) {
    return (saved === undefined ? defaults : saved) as T;
  }

  const merged: Record<string, unknown> = { ...defaults };

  for (const [key, savedValue] of Object.entries(saved)) {
    const defaultValue = defaults[key];

    if (isRecord(defaultValue) && isRecord(savedValue)) {
      merged[key] = mergeWithDefaults(defaultValue, savedValue);
    } else {
      // Arrays are replaced, not merged by index.
      merged[key] = savedValue;
    }
  }

  return merged as T;
}

export function usePersistentFormDraft<T extends FieldValues>({
  storageKey,
  watch,
  reset,
  defaultValues,
}: UsePersistentFormDraftOptions<T>) {
  const isResettingRef = useRef(false);

  useEffect(() => {
    // Restore before subscribing to changes, so restoring
    // a draft doesn't accidentally overwrite it.
    try {
      const storedDraft = window.localStorage.getItem(storageKey);

      if (storedDraft) {
        const parsed: unknown = JSON.parse(storedDraft);

        if (isRecord(parsed)) {
          reset(mergeWithDefaults(defaultValues, parsed));
        } else {
          window.localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error(
        `Unable to restore form draft "${storageKey}":`,
        error,
      );
    }

    const subscription = watch((values) => {
      if (isResettingRef.current) return;

      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify(values),
        );
      } catch (error) {
        // Storage may be unavailable or full.
        // Don't interrupt the user's form.
        console.error(
          `Unable to save form draft "${storageKey}":`,
          error,
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [storageKey, watch, reset, defaultValues]);

  const clearDraft = useCallback(() => {
    isResettingRef.current = true;

    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(
        `Unable to clear form draft "${storageKey}":`,
        error,
      );
    }

    reset(defaultValues);

    isResettingRef.current = false;
  }, [storageKey, reset, defaultValues]);

  return { clearDraft };
}
