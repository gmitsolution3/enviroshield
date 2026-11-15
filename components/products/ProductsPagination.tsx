"use client";

import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type ProductsPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function getPageNumbers(currentPage: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const set = new Set<number>([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const list = [...set]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];

  list.forEach((value, index) => {
    if (index > 0 && value - list[index - 1] > 1) {
      items.push("gap");
    }
    items.push(value);
  });

  return items;
}

export default function ProductsPagination({
  currentPage,
  totalPages,
}: ProductsPaginationProps) {
  const lenis = useLenis();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) {
    return null;
  }

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const scrollToProducts = () => {
    if (lenis) {
      const target =
        document.getElementById("product-grid") ||
        document.getElementById("products-catalogue");
      if (target) {
        lenis.scrollTo(target, { offset: -120 });
      } else {
        lenis.scrollTo(0);
      }
    } else {
      const target =
        document.getElementById("product-grid") ||
        document.getElementById("products-catalogue");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      aria-label="Products pagination"
      className="mt-14 flex items-center justify-center gap-3"
    >
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          onClick={scrollToProducts}
          rel="prev"
          aria-label="Previous page of products"
          className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-5 py-3 text-sm font-bold text-navy transition-colors duration-200 hover:bg-navy hover:text-white"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Previous
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-2 rounded-full border border-navy/5 px-5 py-3 text-sm font-bold text-navy/30"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Previous
        </span>
      )}

      <div className="flex items-center gap-2">
        {pageNumbers.map((item, index) => {
          if (item === "gap") {
            return (
              <span
                key={`gap-${index}`}
                className="grid size-11 place-items-center text-sm font-bold text-navy/40"
              >
                …
              </span>
            );
          }

          const isCurrent = item === currentPage;

          return isCurrent ? (
            <span
              key={item}
              aria-current="page"
              className="grid size-11 place-items-center rounded-full bg-navy text-sm font-bold text-white"
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={createPageUrl(item)}
              onClick={scrollToProducts}
              aria-label={`Go to products page ${item}`}
              className="grid size-11 place-items-center rounded-full border border-navy/10 text-sm font-bold text-navy transition-colors duration-200 hover:bg-navy hover:text-white"
            >
              {item}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          onClick={scrollToProducts}
          rel="next"
          aria-label="Next page of products"
          className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-5 py-3 text-sm font-bold text-navy transition-colors duration-200 hover:bg-navy hover:text-white"
        >
          Next
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-2 rounded-full border border-navy/5 px-5 py-3 text-sm font-bold text-navy/30"
        >
          Next
          <ArrowRight aria-hidden="true" size={16} />
        </span>
      )}
    </nav>
  );
}
