import Link from "next/link";
import { AlertCircle, SlidersHorizontal, X } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/Button";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import CategorySidebar from "@/components/products/CategorySidebar";
import PriceFilter from "@/components/products/PriceFilter";
import ProductSearch from "@/components/products/ProductSearch";
import ProductSortSelect from "@/components/products/ProductSortSelect";
import ProductStatusFilter from "@/components/products/ProductStatusFilter";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import ProductsPagination from "@/components/products/ProductsPagination";
import {
  getAllCategories,
  getPublishedProducts,
  type ProductSortBy,
  type ProductSortOrder,
} from "@/lib/api/products";
import { siteUrl } from "@/lib/site-url";

type SearchParams = Record<
  string,
  string | string[] | undefined
>;

type ProductsPageProps = {
  searchParams: Promise<SearchParams>;
};

const PAGE_SIZE = 12;
const PRICE_MAX = 10000;

const first = (
  value: string | string[] | undefined,
) => (Array.isArray(value) ? value[0] : value);

/* -------------------------------------------------------------------------- */
/* SEO METADATA                                                               */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number.parseInt(first(params.page) || "1", 10) || 1,
  );

  const isFirstPage = page === 1;

  const rawCategoryId = first(params.categoryId) || "";
  const hasCategory = /^[0-9a-fA-F]{24}$/.test(rawCategoryId);

  const rawMin = first(params.minPrice) || "";
  const rawMax = first(params.maxPrice) || "";
  const numberRegex = /^\d+(\.\d+)?$/;
  const hasPrice = numberRegex.test(rawMin) || numberRegex.test(rawMax);

  const rawSearch = (first(params.search) || "").trim();
  const rawInStock = first(params.inStock);
  const rawIsFeatured = first(params.isFeatured);
  const rawSortBy = first(params.sortBy);
  const hasExtraFilters = Boolean(rawSearch || rawInStock || rawIsFeatured || rawSortBy);

  const hasFilters = hasCategory || hasPrice || hasExtraFilters;

  const title = isFirstPage
    ? "Paints, Primers & Finishing Products in Bangladesh | Enviroshield"
    : `Paints, Primers & Finishing Products — Page ${page} | Enviroshield`;

  const description = isFirstPage
    ? "Explore Enviroshield's range of paints, primers, decorative finishes, surface preparation products, protective coatings, and wallcoverings in Bangladesh."
    : `Explore more of Enviroshield's paints, primers, decorative finishes, protective coatings, and wallcoverings on product catalogue page ${page}.`;

  const canonical = isFirstPage
    ? `${siteUrl}/products`
    : `${siteUrl}/products?page=${page}`;

  return {
    title,
    description,

    keywords: [
      "Enviroshield products",
      "paints and primers Bangladesh",
      "interior paint Bangladesh",
      "exterior paint Bangladesh",
      "decorative wall finishes",
      "surface preparation products",
      "protective coatings Bangladesh",
      "wallcoverings Bangladesh",
      "construction finishing materials",
      "painting products Bangladesh",
      "finishing products Bangladesh",
      "paint primers",
      "decorative coatings",
    ],

    alternates: {
      canonical,
    },

    robots: {
      index: !hasFilters,
      follow: true,
    },

    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: [
        {
          url: "/images/service-hero.jpg",
          width: 1200,
          height: 630,
          alt: "Enviroshield paints, primers, coatings and finishing products",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/service-hero.jpg"],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* TYPES AND HELPERS                                                          */
/* -------------------------------------------------------------------------- */

type State = {
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  isFeatured?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
};

function href(state: Partial<State>) {
  const qs = new URLSearchParams();

  if (state.search?.trim()) {
    qs.set("search", state.search.trim());
  }

  if (state.categoryId) {
    qs.set("categoryId", state.categoryId);
  }

  if (state.minPrice) {
    qs.set("minPrice", state.minPrice);
  }

  if (state.maxPrice) {
    qs.set("maxPrice", state.maxPrice);
  }

  if (state.inStock) {
    qs.set("inStock", state.inStock);
  }

  if (state.isFeatured) {
    qs.set("isFeatured", state.isFeatured);
  }

  if (state.sortBy && state.sortBy !== "createdAt") {
    qs.set("sortBy", state.sortBy);
  }

  if (state.sortOrder && state.sortOrder !== "desc") {
    qs.set("sortOrder", state.sortOrder);
  }

  if (state.page && state.page > 1) {
    qs.set("page", String(state.page));
  }

  const query = qs.toString();

  return query ? `/products?${query}` : "/products";
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const rawPage = Number(first(params.page) || "1");

  const page =
    Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const rawCategoryId = first(params.categoryId) || "";

  const categoryId =
    /^[0-9a-fA-F]{24}$/.test(rawCategoryId)
      ? rawCategoryId
      : "";

  const rawMin = first(params.minPrice) || "";
  const rawMax = first(params.maxPrice) || "";

  const numberRegex = /^\d+(\.\d+)?$/;

  const minPrice = numberRegex.test(rawMin)
    ? Number(rawMin)
    : undefined;

  const maxPrice = numberRegex.test(rawMax)
    ? Number(rawMax)
    : undefined;

  const rawSearch = (first(params.search) || "").trim();
  const search = rawSearch.slice(0, 100);

  const rawInStock = first(params.inStock);
  const inStock =
    rawInStock === "true" || rawInStock === "false"
      ? rawInStock
      : "";

  const rawIsFeatured = first(params.isFeatured);
  const isFeatured =
    rawIsFeatured === "true" || rawIsFeatured === "false"
      ? rawIsFeatured
      : "";

  const validSortBy: ProductSortBy[] = [
    "name",
    "price",
    "createdAt",
    "updatedAt",
    "publishedAt",
    "stockQuantity",
    "weight",
  ];
  const rawSortBy = first(params.sortBy);
  const sortBy = validSortBy.includes(rawSortBy as ProductSortBy)
    ? (rawSortBy as ProductSortBy)
    : undefined;

  const rawSortOrder = first(params.sortOrder);
  const sortOrder =
    rawSortOrder === "asc" || rawSortOrder === "desc"
      ? (rawSortOrder as ProductSortOrder)
      : undefined;

  const state: State = {
    search,
    categoryId,
    minPrice: minPrice !== undefined ? rawMin : "",
    maxPrice: maxPrice !== undefined ? rawMax : "",
    inStock,
    isFeatured,
    sortBy: sortBy || "",
    sortOrder: sortOrder || "",
    page,
  };

  const [
    productsResult,
    categoriesResult,
  ] = await Promise.allSettled([
    getPublishedProducts({
      page,
      limit: PAGE_SIZE,
      search,
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      sortBy,
      sortOrder,
    }),
    getAllCategories(),
  ]);

  const productResponse =
    productsResult.status === "fulfilled"
      ? productsResult.value
      : null;

  const categories =
    categoriesResult.status === "fulfilled"
      ? categoriesResult.value
      : [];

  const selectedCategory = categories.find(
    (c) => c._id === categoryId,
  );

  const error =
    productsResult.status === "rejected"
      ? "Products could not be loaded right now. Please try again later."
      : null;

  const hasPrice =
    minPrice !== undefined || maxPrice !== undefined;

  const hasSearch = Boolean(search);
  const hasInStock = Boolean(inStock);
  const hasFeatured = Boolean(isFeatured);
  const hasSort = Boolean(sortBy && (sortBy !== "createdAt" || sortOrder !== "desc"));

  const hasFilters =
    Boolean(categoryId) ||
    hasPrice ||
    hasSearch ||
    hasInStock ||
    hasFeatured ||
    hasSort;

  // Active hidden values for the price filter slider so it preserves all other filters
  const priceFilterHidden: Record<string, string> = {};
  if (search) priceFilterHidden.search = search;
  if (categoryId) priceFilterHidden.categoryId = categoryId;
  if (inStock) priceFilterHidden.inStock = inStock;
  if (isFeatured) priceFilterHidden.isFeatured = isFeatured;
  if (sortBy) priceFilterHidden.sortBy = sortBy;
  if (sortOrder) priceFilterHidden.sortOrder = sortOrder;

  return (
    <>
      <PageHero
        eyebrow="PRODUCTS"
        title="Finishes and materials you can trust."
        text="A curated range of paints, primers, coatings and wallcoverings — chosen for performance, feel, and longevity."
        image="/images/service-hero.jpg"
      />

      <section
        aria-label="Product catalogue"
        className="py-16 max-[600px]:py-10"
      >
        <Container>
          <div className="grid grid-cols-[280px_1fr] items-start gap-12 max-[1000px]:grid-cols-1 max-[1000px]:gap-8">
            {/* PRODUCT FILTERS: CATEGORIES, PREFERENCES, AND PRICE */}

            <aside
              aria-label="Product filters"
              className="flex flex-col gap-6"
            >
              <CategorySidebar
                categories={categories}
                activeCategoryId={categoryId}
                minPrice={state.minPrice}
                maxPrice={state.maxPrice}
                search={state.search}
                inStock={state.inStock}
                isFeatured={state.isFeatured}
                sortBy={state.sortBy}
                sortOrder={state.sortOrder}
                hasError={categoriesResult.status === "rejected"}
              />

              <ProductStatusFilter
                inStock={inStock}
                isFeatured={isFeatured}
                inStockToggleHref={href({
                  ...state,
                  inStock: inStock === "true" ? "" : "true",
                  page: 1,
                })}
                featuredToggleHref={href({
                  ...state,
                  isFeatured: isFeatured === "true" ? "" : "true",
                  page: 1,
                })}
                resetHref={href({
                  ...state,
                  inStock: "",
                  isFeatured: "",
                  page: 1,
                })}
              />

              <div className="overflow-hidden rounded-2xl border border-line/90 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,51,78,0.06)]">
                <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue/10 text-blue">
                      <SlidersHorizontal size={15} />
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
                      Filter by price
                    </h3>
                  </div>
                </div>

                <PriceFilter
                  key={`${state.minPrice}-${state.maxPrice}`}
                  max={PRICE_MAX}
                  initialMin={minPrice}
                  initialMax={maxPrice}
                  hidden={priceFilterHidden}
                  resetHref={href({
                    ...state,
                    minPrice: "",
                    maxPrice: "",
                    page: 1,
                  })}
                  isFiltered={hasPrice}
                />
              </div>
            </aside>

            {/* PRODUCT LISTING */}

            <div className="min-w-0">
              {/* Controls bar: Search and Sort */}
              <div className="mb-6 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-md">
                  <ProductSearch initialSearch={search} />
                </div>

                <div className="flex items-center justify-between gap-2.5 sm:justify-end">
                  <span className="text-xs font-medium text-ink/60">
                    Sort:
                  </span>
                  <ProductSortSelect
                    currentSortBy={sortBy || "createdAt"}
                    currentSortOrder={sortOrder || "desc"}
                  />
                </div>
              </div>

              {/* Contextual Category Header & Active Filters Bar */}
              <div className="mb-8 flex flex-col gap-4 border-b border-line/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                      {search
                        ? `Results for "${search}"`
                        : selectedCategory
                          ? selectedCategory.name
                          : "All Products"}
                    </h2>
                    <span className="inline-flex items-center rounded-full border border-line bg-mist/80 px-3.5 py-1 text-xs font-semibold text-ink/80">
                      Showing{" "}
                      <strong className="mx-1 font-bold text-navy">
                        {productResponse?.data.length ?? 0}
                      </strong>{" "}
                      {(productResponse?.data.length ?? 0) === 1
                        ? "product"
                        : "products"}{" "}
                      out of{" "}
                      <strong className="mx-1 font-bold text-navy">
                        {productResponse?.meta.total ?? 0}
                      </strong>{" "}
                      {(productResponse?.meta.total ?? 0) === 1
                        ? "product"
                        : "products"}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm text-ink/70">
                    {search
                      ? `Showing products matching your search query.`
                      : selectedCategory
                        ? `Browsing our specialized range in ${selectedCategory.name}.`
                        : "Engineered coatings, primers, and protective materials for demanding conditions."}
                  </p>
                </div>

                {/* Active filter badges if any filter is active */}
                {hasFilters && (
                  <div className="flex flex-wrap items-center gap-2">
                    {hasSearch && (
                      <Link
                        href={href({ ...state, search: "", page: 1 })}
                        scroll={false}
                        aria-label="Remove search filter"
                        className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 text-xs font-semibold text-ink/80 transition hover:bg-line/60 hover:text-navy"
                      >
                        <span>Query: "{search}"</span>
                        <X size={12} className="stroke-[2.5]" />
                      </Link>
                    )}

                    {selectedCategory && (
                      <Link
                        href={href({ ...state, categoryId: "", page: 1 })}
                        scroll={false}
                        aria-label={`Remove filter: ${selectedCategory.name}`}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-blue/20 bg-blue/10 px-3 py-1 text-xs font-semibold text-blue transition hover:bg-blue hover:text-white"
                      >
                        <span>{selectedCategory.name}</span>
                        <X size={12} className="stroke-[2.5]" />
                      </Link>
                    )}

                    {hasPrice && (
                      <Link
                        href={href({
                          ...state,
                          minPrice: "",
                          maxPrice: "",
                          page: 1,
                        })}
                        scroll={false}
                        aria-label="Remove price filter"
                        className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 text-xs font-semibold text-ink/80 transition hover:bg-line/60 hover:text-navy"
                      >
                        <span>
                          ৳{minPrice ?? 0} – ৳{maxPrice ?? PRICE_MAX}
                        </span>
                        <X size={12} className="stroke-[2.5]" />
                      </Link>
                    )}

                    {hasInStock && (
                      <Link
                        href={href({ ...state, inStock: "", page: 1 })}
                        scroll={false}
                        aria-label="Remove in-stock filter"
                        className="group inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                      >
                        <span>In Stock Only</span>
                        <X size={12} className="stroke-[2.5]" />
                      </Link>
                    )}

                    {hasFeatured && (
                      <Link
                        href={href({ ...state, isFeatured: "", page: 1 })}
                        scroll={false}
                        aria-label="Remove featured filter"
                        className="group inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                      >
                        <span>Featured Only</span>
                        <X size={12} className="stroke-[2.5]" />
                      </Link>
                    )}

                    <Link
                      href="/products"
                      scroll={false}
                      className="ml-1 text-xs font-bold text-navy underline underline-offset-4 hover:text-blue"
                    >
                      Clear all
                    </Link>
                  </div>
                )}
              </div>

              {error ? (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>
                    Something went wrong
                  </AlertTitle>

                  <AlertDescription>
                    {error}{" "}
                    <Link
                      href={href(state)}
                      className="font-medium underline underline-offset-4"
                    >
                      Try again
                    </Link>
                  </AlertDescription>
                </Alert>
              ) : productResponse?.data.length ? (
                <>
                  <div
                    key={`product-grid-page-${productResponse.meta.page}`}
                    className="grid grid-cols-3 gap-x-6 gap-y-10 max-[1200px]:grid-cols-2 max-[600px]:grid-cols-1"
                    id="product-grid"
                  >
                    {productResponse.data.map((product) => (
                      <div
                        key={product._id}
                        data-category={product.categoryId?.name}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  <ProductsPagination
                    currentPage={productResponse.meta.page}
                    totalPages={productResponse.meta.totalPages}
                  />
                </>
              ) : (
                <div className="rounded-xl border border-line bg-white px-6 py-20 text-center">
                  <p className="text-base font-semibold text-navy">
                    No products found
                  </p>

                  <p className="mx-auto mt-2 max-w-[420px] text-sm text-ink/70">
                    {hasFilters
                      ? "Nothing matches your current filters. Try a different search, price range, or category."
                      : "There are no published products yet. Please check back soon."}
                  </p>

                  {hasFilters && (
                    <Button
                      href="/products"
                      className="mt-6"
                    >
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
