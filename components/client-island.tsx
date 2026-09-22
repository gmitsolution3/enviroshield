"use client";
import { useEffect } from "react";

export default function ClientIsland() {
  useEffect(() => {
    function initFilter(filterId: string, gridId: string) {
      const filter = document.getElementById(filterId);
      const grid = document.getElementById(gridId);
      if (!filter || !grid) return;
      const buttons = filter.querySelectorAll("button");
      function apply(cat: string, activeBtn: HTMLButtonElement) {
        buttons.forEach((b) => b.classList.remove("active"));
        activeBtn.classList.add("active");
        grid!.querySelectorAll("[data-category]").forEach((card) => {
          const el = card as HTMLElement;
          el.style.display =
            cat === "All" || el.dataset.category === cat
              ? ""
              : "none";
        });
      }
      buttons.forEach((btn) => {
        btn.addEventListener("click", () =>
          apply(
            btn.dataset.category || "All",
            btn as HTMLButtonElement,
          ),
        );
      });
    }
    initFilter("product-filter", "product-grid");
    initFilter("blog-filter", "blog-grid");
  }, []);
  return null;
}
