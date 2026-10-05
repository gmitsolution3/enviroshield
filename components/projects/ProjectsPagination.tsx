import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

type ProjectsPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function ProjectsPagination({
  currentPage,
  totalPages,
}: ProjectsPaginationProps) {
  if (totalPages < 1) {
    return null;
  }

  const createPageUrl = (page: number) => {
    return page === 1 ? "/projects" : `/projects?page=${page}`;
  };

  return (
    <nav
      aria-label="Projects pagination"
      className="mt-14 flex items-center justify-center gap-3"
    >
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          rel="prev"
          aria-label="Previous page of projects"
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
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const isCurrent = page === currentPage;

          return isCurrent ? (
            <span
              key={page}
              aria-current="page"
              className="grid size-11 place-items-center rounded-full bg-navy text-sm font-bold text-white"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={createPageUrl(page)}
              aria-label={`Go to projects page ${page}`}
              className="grid size-11 place-items-center rounded-full border border-navy/10 text-sm font-bold text-navy transition-colors duration-200 hover:bg-navy hover:text-white"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          rel="next"
          aria-label="Next page of projects"
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
