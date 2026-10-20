"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Package } from "lucide-react";

import { useFetch } from "@/hooks/swr/useFetch";
import type { InventoryMovementsResponse } from "@/types/admin/inventory.type";
import type { IProductSingleResponse } from "@/types/admin/product.type";
import InventoryMovementTable from "../inventory/InventoryMovementTable";

const PAGE_SIZE = 10;

export default function ProductInventoryMovementsDashboard({
  productId,
}: {
  productId: string;
}) {
  const isValidProductId = Boolean(productId.trim());
  const [page, setPage] = useState(1);

  const {
    data: movementsResponse,
    isLoading,
    isError,
    refetch,
  } = useFetch<InventoryMovementsResponse>(
    isValidProductId
      ? `/inventory/${encodeURIComponent(productId)}/movements?page=${page}&limit=${PAGE_SIZE}`
      : null,
  );
  const { data: productResponse } = useFetch<IProductSingleResponse>(
    isValidProductId ? `/product/${encodeURIComponent(productId)}` : null,
  );

  const product = productResponse?.data;
  const movementsData = movementsResponse?.data;
  const movements = movementsData?.movements ?? [];

  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      <div className="mb-6">
        <Link
          href="/dashboard/ecommerce/products"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue transition-colors hover:text-[#005cb9]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue">
              <Package className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Product Inventory
              </span>
            </div>
            <h1 className="text-3xl font-bold text-navy">
              Inventory Movement History
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Stock changes for{" "}
              <span className="font-semibold text-slate-700">
                {product?.name ?? `product ${productId}`}
              </span>
              {product?.sku ? ` · SKU: ${product.sku}` : ""}.
            </p>
          </div>
        </div>
      </div>

      {isValidProductId ? (
        <InventoryMovementTable
          title={product?.name ? `${product.name} movements` : "Product movements"}
          description="Review stock changes and the users who recorded them."
          movements={movements}
          pagination={movementsData?.pagination}
          page={page}
          isLoading={isLoading && !movementsResponse}
          isError={Boolean(isError && !movementsResponse)}
          onRetry={() => void refetch()}
          onPageChange={setPage}
        />
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-red-700">
            A product ID is required to view movement history.
          </p>
        </div>
      )}
    </section>
  );
}
