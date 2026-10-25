"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const notifications = {
  "login-required": {
    type: "info",
    message: "Please log in to continue.",
    description: "Sign in to access this page and continue where you left off.",
  },
  "access-denied": {
    type: "error",
    message: "Access restricted",
    description: "You don't have permission to access this page.",
  },
} as const;

export default function GlobalToastListener() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledNotice = useRef<string | null>(null);

  useEffect(() => {
    const notice = searchParams.get("notice");

    if (!notice) {
      handledNotice.current = null;
      return;
    }

    const notification =
      notifications[notice as keyof typeof notifications];

    if (!notification || handledNotice.current === notice) {
      return;
    }

    handledNotice.current = notice;

    if (notification.type === "error") {
  toast.error(notification.message, {
    description: notification.description,
  });
} else {
  toast.info(notification.message, {
    description: notification.description,
  });
}

    // Remove the notification parameter after displaying the toast.
    const params = new URLSearchParams(searchParams.toString());
    params.delete("notice");

    const query = params.toString();
    const cleanUrl = query ? `${pathname}?${query}` : pathname;

    router.replace(cleanUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}