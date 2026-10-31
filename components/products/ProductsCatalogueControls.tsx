"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ICategory } from "@/types/category.type";

type Props = {
  categories: ICategory[];
  initialSearch: string;
  initialCategoryId: string;
  initialMinPrice: string;
  initialMaxPrice: string;
};

function buildHref(values: {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
}) {
  const params = new URLSearchParams();
  const search = values.search.trim();
  if (search) params.set("search", search);
  if (values.categoryId) params.set("categoryId", values.categoryId);
  if (values.minPrice) params.set("minPrice", values.minPrice);
  if (values.maxPrice) params.set("maxPrice", values.maxPrice);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default function ProductsCatalogueControls({
  categories,
  initialSearch,
  initialCategoryId,
  initialMinPrice,
  initialMaxPrice,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [priceError, setPriceError] = useState("");

  const apply = (next: { search: string; categoryId: string; minPrice: string; maxPrice: string }) => {
    setPriceError("");
    startTransition(() => router.push(buildHref(next), { scroll: false }));
  };

  const validatePrice = () => {
    const min = minPrice === "" ? undefined : Number(minPrice);
    const max = maxPrice === "" ? undefined : Number(maxPrice);
    if ((min !== undefined && (!Number.isFinite(min) || min < 0)) || (max !== undefined && (!Number.isFinite(max) || max < 0))) {
      setPriceError("Enter a valid price of zero or more.");
      return false;
    }
    if (min !== undefined && max !== undefined && min > max) {
      setPriceError("Minimum price must be less than or equal to maximum price.");
      return false;
    }
    return true;
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validatePrice()) apply({ search, categoryId, minPrice, maxPrice });
  };

  const submitPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validatePrice()) apply({ search, categoryId, minPrice, maxPrice });
  };

  return (
    <div className="mb-8">
      <form onSubmit={submitSearch} role="search" className="mb-5 flex gap-3 max-[600px]:flex-col">
        <label htmlFor="product-search" className="sr-only">Search products</label>
        <input
          id="product-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products"
          className="min-h-11 flex-1 rounded-[7px] border border-line bg-white px-4 text-[13px] text-ink outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/15"
        />
        <button type="submit" disabled={isPending} className="min-h-11 rounded-[7px] bg-navy px-5 text-[13px] font-bold text-white transition hover:bg-blue disabled:opacity-60">
          Search
        </button>
      </form>

      <div className="grid gap-5 rounded-[12px] border border-line bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <form onSubmit={submitPrice} aria-label="Filter by price" className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-[12px] font-semibold text-navy">
            Minimum price
            <input type="number" min="0" step="any" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} className="h-10 w-36 rounded-[7px] border border-line px-3 text-[13px] font-normal text-ink outline-none focus:border-blue" />
          </label>
          <label className="grid gap-1 text-[12px] font-semibold text-navy">
            Maximum price
            <input type="number" min="0" step="any" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="h-10 w-36 rounded-[7px] border border-line px-3 text-[13px] font-normal text-ink outline-none focus:border-blue" />
          </label>
          <button type="submit" disabled={isPending} className="h-10 rounded-[7px] border border-line px-4 text-[13px] font-bold text-navy transition hover:border-blue hover:text-blue disabled:opacity-60">
            Apply price
          </button>
          {priceError && <p role="alert" className="basis-full text-[12px] text-red-700">{priceError}</p>}
        </form>
        <button
          type="button"
          disabled={isPending || (!search && !categoryId && !minPrice && !maxPrice)}
          onClick={() => { setSearch(""); setCategoryId(""); setMinPrice(""); setMaxPrice(""); apply({ search: "", categoryId: "", minPrice: "", maxPrice: "" }); }}
          className="h-10 rounded-[7px] px-3 text-[13px] font-bold text-blue transition hover:bg-[#e9f3fd] disabled:cursor-not-allowed disabled:opacity-50"
        >Clear filters</button>
      </div>

      <p className="sr-only" aria-live="polite">{isPending ? "Updating products" : ""}</p>
      <div className="mt-5 flex flex-wrap gap-[5px]" role="group" aria-label="Product categories">
        <button type="button" aria-pressed={!categoryId} onClick={() => { setCategoryId(""); if (validatePrice()) apply({ search, categoryId: "", minPrice, maxPrice }); }} className={`rounded-[7px] px-3 py-[10px] text-left text-[13px] text-ink transition-colors ${!categoryId ? "bg-[#e9f3fd] font-bold text-blue" : "hover:bg-[#e9f3fd] hover:font-bold hover:text-blue"} border border-line`}>
          All
        </button>
        {categories.map((category) => (
          <button key={category._id} type="button" aria-pressed={categoryId === category._id} onClick={() => { setCategoryId(category._id); if (validatePrice()) apply({ search, categoryId: category._id, minPrice, maxPrice }); }} className={`rounded-[7px] px-3 py-[10px] text-left text-[13px] text-ink transition-colors ${categoryId === category._id ? "bg-[#e9f3fd] font-bold text-blue" : "hover:bg-[#e9f3fd] hover:font-bold hover:text-blue"} border border-line`}>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
