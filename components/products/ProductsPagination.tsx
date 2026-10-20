import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  search: string;
  categoryId: string;
  minPrice?: number;
  maxPrice?: number;
};

function hrefFor(page: number, props: Props) {
  const params = new URLSearchParams({ page: String(page) });
  if (props.search) params.set("search", props.search);
  if (props.categoryId) params.set("categoryId", props.categoryId);
  if (props.minPrice !== undefined) params.set("minPrice", String(props.minPrice));
  if (props.maxPrice !== undefined) params.set("maxPrice", String(props.maxPrice));
  return `/products?${params.toString()}`;
}

export default function ProductsPagination(props: Props) {
  if (props.totalPages <= 1) return null;
  const pages = Array.from({ length: props.totalPages }, (_, index) => index + 1);
  return (
    <nav aria-label="Product pages" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {props.page > 1 && <Link href={hrefFor(props.page - 1, props)} className="rounded-full border border-line px-4 py-2 text-[13px] text-navy transition hover:border-blue hover:text-blue">Previous</Link>}
      {pages.map((page) => (
        <Link key={page} href={hrefFor(page, props)} aria-current={page === props.page ? "page" : undefined} className={`grid h-10 w-10 place-items-center rounded-full border text-[13px] transition ${page === props.page ? "border-blue bg-blue text-white" : "border-line text-navy hover:border-blue hover:text-blue"}`}>
          {page}
        </Link>
      ))}
      {props.page < props.totalPages && <Link href={hrefFor(props.page + 1, props)} className="rounded-full border border-line px-4 py-2 text-[13px] text-navy transition hover:border-blue hover:text-blue">Next</Link>}
    </nav>
  );
}
