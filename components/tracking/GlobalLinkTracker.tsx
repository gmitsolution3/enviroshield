"use client";

import { useEffect } from "react";
import { trackConversion } from "@/lib/analytics/events";

export function GlobalLinkTracker() {
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;

      const href = target.href.toLowerCase();

      if (href.startsWith("tel:")) {
        trackConversion("phone_number_clicked", {
          link_url: href.substring(0, 30),
        });
      } else if (href.startsWith("mailto:")) {
        trackConversion("email_link_clicked", {
          link_url: href.substring(0, 50),
        });
      } else if (
        href.includes("wa.me") ||
        href.includes("api.whatsapp.com") ||
        href.includes("whatsapp.com")
      ) {
        trackConversion("whatsapp_link_clicked", {
          link_url: "whatsapp",
        });
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
    };
  }, []);

  return null;
}
