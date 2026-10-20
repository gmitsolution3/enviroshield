import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import PriceFilter from "@/components/products/PriceFilter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { getAllCategories, getPublishedProducts } from "@/lib/api/products";
import { siteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Paints, Primers & Finishing Products | Enviroshield",
  description:
    "Explore Enviroshield's range of interior and exterior paints, primers, decorative finishes, surface preparation products, and wallcoverings.",
  alternates: { canonical: `${siteUrl}/products` },
};

type SearchParams = Record<string, string | string[] | undefined>;

const PAGE_SIZE = 12;
const PRICE_MAX = 10000; // upper bound of the price slider — set to your highest product price
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

type State = { categoryId: string; minPrice: string; maxPrice: string; page: number };

function href(s: Partial<State>) {
  const qs = new URLSearchParams();
  if (s.categoryId) qs.set("categoryId", s.categoryId);
  if (s.minPrice) qs.set("minPrice", s.minPrice);
  if (s.maxPrice) qs.set("maxPrice", s.maxPrice);
  if (s.page && s.page > 1) qs.set("page", String(s.page));
  const str = qs.toString();
  return str ? `/products?${str}` : "/products";
}

function pageItems(page: number, totalPages: number): (number | "gap")[] {
  const set = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) items.push("gap");
    items.push(p);
  });
  return items;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  const rawPage = Number(first(params.page) || "1");
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const rawCat = first(params.categoryId) || "";
  const categoryId = /^[0-9a-fA-F]{24}$/.test(rawCat) ? rawCat : "";
  const rawMin = first(params.minPrice) || "";
  const rawMax = first(params.maxPrice) || "";
  const numRe = /^\d+(\.\d+)?$/;
  const minPrice = numRe.test(rawMin) ? Number(rawMin) : undefined;
  const maxPrice = numRe.test(rawMax) ? Number(rawMax) : undefined;

  const state: State = {
    categoryId,
    minPrice: minPrice !== undefined ? rawMin : "",
    maxPrice: maxPrice !== undefined ? rawMax : "",
    page,
  };

  const [productsResult, categoriesResult] = await Promise.allSettled([
    getPublishedProducts({ page, limit: PAGE_SIZE, search: "", categoryId, minPrice, maxPrice }),
    getAllCategories(),
  ]);

  const productResponse = productsResult.status === "fulfilled" ? productsResult.value : null;
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const error =
    productsResult.status === "rejected"
      ? "Products could not be loaded right now. Please try again later."
      : null;
  const hasPrice = minPrice !== undefined || maxPrice !== undefined;
  const hasFilters = Boolean(categoryId) || hasPrice;

  return (
    <>
      <PageHero
        eyebrow="PRODUCTS"
        title="Finishes and materials you can trust."
        text="A curated range of paints, primers, coatings and wallcoverings — chosen for performance, feel, and longevity."
        image="/images/service-hero.jpg"
      />

      <section aria-label="Product catalogue" className="py-16 max-[600px]:py-10">
        <Container>
          <div className="grid grid-cols-[280px_1fr] items-start gap-12 max-[1000px]:grid-cols-1 max-[1000px]:gap-8">
            {/* ============ LEFT: price range + categories ============ */}
            <aside aria-label="Product filters" className="flex flex-col gap-8">
              <div>
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-navy">
                  Filter by price
                </h3>
                <PriceFilter
                  key={`${state.minPrice}-${state.maxPrice}`}
                  max={PRICE_MAX}
                  initialMin={minPrice}
                  initialMax={maxPrice}
                  hidden={categoryId ? { categoryId } : {}}
                  resetHref={href({ categoryId })}
                  isFiltered={hasPrice}
                />
              </div>

              <Separator className="bg-line" />

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy">
                  Categories
                </h3>
                <ul className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_14px_rgba(0,51,78,0.05)]">
                  {[{ _id: "", name: "All products" }, ...categories].map(
                    (cat: { _id: string; name: string }) => {
                      const active = cat._id === categoryId;
                      return (
                        <li key={cat._id || "all"} className="border-b border-line last:border-b-0">
                          <Link
                            href={href({ ...state, categoryId: cat._id, page: 1 })}
                            scroll={false}
                            aria-current={active ? "true" : undefined}
                            className={cn(
                              "group relative flex items-center justify-between gap-3 px-5 py-3.5 text-sm transition-all duration-300",
                              active
                                ? "bg-mist font-semibold text-blue"
                                : "text-ink/80 hover:bg-mist/70 hover:pl-6 hover:text-navy",
                            )}
                          >
                            {/* accent bar */}
                            <span
                              aria-hidden
                              className={cn(
                                "absolute inset-y-0 left-0 w-[3px] origin-center bg-blue transition-transform duration-300",
                                active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100",
                              )}
                            />
                            <span className="truncate">{cat.name}</span>
                            <ChevronRight
                              aria-hidden
                              size={16}
                              className={cn(
                                "shrink-0 transition-all duration-300",
                                active
                                  ? "text-blue opacity-100"
                                  : "-translate-x-1 text-blue opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                              )}
                            />
                          </Link>
                        </li>
                      );
                    },
                  )}
                </ul>
                {categoriesResult.status === "rejected" && (
                  <p role="status" className="mt-2 text-xs text-amber-800">
                    Categories could not be loaded.
                  </p>
                )}
              </div>
            </aside>

            {/* ============ RIGHT: product listing ============ */}
            <div className="min-w-0">
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>
                    {error}{" "}
                    <Link href={href(state)} className="font-medium underline underline-offset-4">
                      Try again
                    </Link>
                  </AlertDescription>
                </Alert>
              ) : productResponse?.data.length ? (
                <>
                  <StaggerContainer
                    className="grid grid-cols-3 gap-x-6 gap-y-10 max-[1200px]:grid-cols-2 max-[600px]:grid-cols-1"
                    id="product-grid"
                  >
                    {productResponse.data.map((product) => (
                      <StaggerItem key={product._id} data-category={product.categoryId.name}>
                        <ProductCard product={product} />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {productResponse.meta.totalPages > 1 && (
                    <Pagination className="mt-12">
                      <PaginationContent>
                        {productResponse.meta.page > 1 && (
                          <PaginationItem>
                            <PaginationPrevious href={href({ ...state, page: productResponse.meta.page - 1 })} />
                          </PaginationItem>
                        )}
                        {pageItems(productResponse.meta.page, productResponse.meta.totalPages).map((it, i) =>
                          it === "gap" ? (
                            <PaginationItem key={`gap-${i}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={it}>
                              <PaginationLink
                                href={href({ ...state, page: it })}
                                isActive={it === productResponse.meta.page}
                                className={it === productResponse.meta.page ? "border-blue text-blue" : ""}
                              >
                                {it}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}
                        {productResponse.meta.page < productResponse.meta.totalPages && (
                          <PaginationItem>
                            <PaginationNext href={href({ ...state, page: productResponse.meta.page + 1 })} />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-line bg-white px-6 py-20 text-center">
                  <p className="text-base font-semibold text-navy">No products found</p>
                  <p className="mx-auto mt-2 max-w-[420px] text-sm text-ink/70">
                    {hasFilters
                      ? "Nothing matches your current filters. Try a different price range or category."
                      : "There are no published products yet. Please check back soon."}
                  </p>
                  {hasFilters && (
                    <Button href="/products" className="mt-6">
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
