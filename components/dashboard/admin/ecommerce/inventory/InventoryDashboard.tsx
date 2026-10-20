
"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  Boxes,
  CheckCircle2,
  ChevronDown,
  Package,
  Search,
  TrendingDown,
  Warehouse,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DashboardButton from "@/components/dashboard/DashboardButton";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

type InventoryProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  threshold: number;
  location: string;
};

const initialInventory: InventoryProduct[] = [
  {
    id: "1",
    name: "PU Waterproofing Membrane",
    sku: "ENV-PU-001",
    category: "Waterproofing",
    quantity: 148,
    threshold: 30,
    location: "Main Warehouse",
  },
  {
    id: "2",
    name: "Cementitious Waterproof Coating",
    sku: "ENV-CW-002",
    category: "Waterproofing",
    quantity: 24,
    threshold: 40,
    location: "Main Warehouse",
  },
  {
    id: "3",
    name: "Protective Roof Coating",
    sku: "ENV-RC-003",
    category: "Roof Protection",
    quantity: 76,
    threshold: 20,
    location: "Warehouse A",
  },
  {
    id: "4",
    name: "Crystalline Waterproofing Compound",
    sku: "ENV-CR-004",
    category: "Concrete Protection",
    quantity: 0,
    threshold: 15,
    location: "Warehouse B",
  },
  {
    id: "5",
    name: "Expansion Joint Sealant",
    sku: "ENV-EJ-005",
    category: "Joint Sealing",
    quantity: 12,
    threshold: 20,
    location: "Warehouse A",
  },
  {
    id: "6",
    name: "Bituminous Waterproof Coating",
    sku: "ENV-BW-006",
    category: "Waterproofing",
    quantity: 215,
    threshold: 50,
    location: "Main Warehouse",
  },
  {
    id: "7",
    name: "Concrete Repair Mortar",
    sku: "ENV-CR-007",
    category: "Concrete Repair",
    quantity: 63,
    threshold: 20,
    location: "Warehouse B",
  },
  {
    id: "8",
    name: "Waterproofing Primer",
    sku: "ENV-PR-008",
    category: "Primers",
    quantity: 8,
    threshold: 25,
    location: "Warehouse A",
  },
];

function getStockStatus(product: InventoryProduct): StockStatus {
  if (product.quantity <= 0) return "Out of Stock";

  if (product.quantity <= product.threshold) return "Low Stock";

  return "In Stock";
}

function StockBadge({ status }: { status: StockStatus }) {
  const styles: Record<StockStatus, string> = {
    "In Stock": "border-emerald-200 bg-emerald-50 text-emerald-700",
    "Low Stock": "border-amber-200 bg-amber-50 text-amber-700",
    "Out of Stock": "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <Badge
      variant="outline"
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}
    >
      {status === "In Stock" && <CheckCircle2 className="h-3 w-3" />}
      {status === "Low Stock" && <AlertTriangle className="h-3 w-3" />}
      {status === "Out of Stock" && <TrendingDown className="h-3 w-3" />}
      {status}
    </Badge>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  iconClass,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <Card className="gap-0 rounded-2xl border-0 bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-navy">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </Card>
  );
}

export default function InventoryDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const inventory = initialInventory;

  const summary = useMemo(() => {
    const totalUnits = inventory.reduce(
      (total, product) => total + product.quantity,
      0,
    );

    const lowStock = inventory.filter(
      (product) => getStockStatus(product) === "Low Stock",
    ).length;

    const outOfStock = inventory.filter(
      (product) => getStockStatus(product) === "Out of Stock",
    ).length;

    return {
      totalProducts: inventory.length,
      totalUnits,
      lowStock,
      outOfStock,
    };
  }, [inventory]);

  const categories = Array.from(
    new Set(inventory.map((product) => product.category)),
  );

  const filteredInventory = inventory.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.location.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      getStockStatus(product) === statusFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    categoryFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const exportCsv = () => {
    const headers = [
      "Product",
      "SKU",
      "Category",
      "Quantity",
      "Low Stock Threshold",
      "Status",
      "Location",
    ];

    const rows = filteredInventory.map((product) => [
      product.name,
      product.sku,
      product.category,
      product.quantity,
      product.threshold,
      getStockStatus(product),
      product.location,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "enviroshield-inventory.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue">
            <Warehouse className="h-4 w-4" />
            Store Management
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Inventory Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor stock levels, identify products that need replenishment,
            and keep your inventory organized.
          </p>
        </div>

        <DashboardButton
          icon={<ArrowDownToLine className="h-4 w-4" />}
          onClick={exportCsv}
          className="min-h-10 rounded-xl bg-blue px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#005cb9]"
        >
          Export Inventory
        </DashboardButton>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Products"
          value={String(summary.totalProducts)}
          description="Products currently tracked in inventory"
          icon={<Package className="h-5 w-5" />}
          iconClass="bg-blue/10 text-blue"
        />

        <SummaryCard
          title="Total Units"
          value={summary.totalUnits.toLocaleString("en-BD")}
          description="Combined units across all inventory items"
          icon={<Boxes className="h-5 w-5" />}
          iconClass="bg-violet-50 text-violet-600"
        />

        <SummaryCard
          title="Low Stock"
          value={String(summary.lowStock)}
          description="Products at or below their stock threshold"
          icon={<AlertTriangle className="h-5 w-5" />}
          iconClass="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          title="Out of Stock"
          value={String(summary.outOfStock)}
          description="Products that currently have zero units"
          icon={<TrendingDown className="h-5 w-5" />}
          iconClass="bg-red-50 text-red-600"
        />
      </div>

      {/* Stock attention panel */}
      {(summary.lowStock > 0 || summary.outOfStock > 0) && (
        <div className="mb-8 grid gap-3 md:grid-cols-2">
          {summary.lowStock > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Low-stock attention needed
                </p>
                <p className="mt-1 text-sm leading-5 text-amber-800">
                  {summary.lowStock} product(s) have reached their
                  replenishment threshold.
                </p>
              </div>
            </div>
          )}

          {summary.outOfStock > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <TrendingDown className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-red-900">
                  Out-of-stock products
                </p>
                <p className="mt-1 text-sm leading-5 text-red-800">
                  {summary.outOfStock} product(s) currently have no available
                  units.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventory table */}
      <Card className="gap-0 overflow-hidden rounded-2xl border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy">
                Stock Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review product quantities and stock status.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {filteredInventory.length} of {inventory.length} products
            </span>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product, SKU, or warehouse..."
                className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm focus-visible:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  aria-label="Filter by stock status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-10 min-w-[150px] appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue"
                >
                  <option value="all">All stock statuses</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by category"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="h-10 min-w-[150px] appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue"
                >
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-10 rounded-xl px-3 text-sm font-semibold text-blue transition-colors hover:bg-blue/5"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Product
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Category
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Stock Level
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Threshold
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((product) => {
                const stockStatus = getStockStatus(product);

                const stockPercentage =
                  product.threshold > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (product.quantity / (product.threshold * 2)) * 100,
                        ),
                      )
                    : product.quantity > 0
                      ? 100
                      : 0;

                const barColor =
                  stockStatus === "Out of Stock"
                    ? "bg-red-500"
                    : stockStatus === "Low Stock"
                      ? "bg-amber-500"
                      : "bg-emerald-500";

                return (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                          <Package className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="max-w-[260px] truncate text-sm font-semibold text-navy">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="w-36">
                        <div className="mb-2 flex items-baseline justify-between gap-3">
                          <span className="text-sm font-bold text-navy">
                            {product.quantity.toLocaleString("en-BD")}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            units
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${barColor}`}
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {product.threshold} units
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Warehouse className="h-4 w-4 text-slate-400" />
                        {product.location}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StockBadge status={stockStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredInventory.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-navy">
                No inventory found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another search term or adjust your filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-semibold text-blue hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            Showing {filteredInventory.length} inventory items
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Healthy stock
            <span className="ml-2 h-2 w-2 rounded-full bg-amber-500" />
            Low stock
            <span className="ml-2 h-2 w-2 rounded-full bg-red-500" />
            Out of stock
          </span>
        </div>
      </Card>

      <p className="mt-4 text-xs text-slate-400">
        Preview mode: inventory values are sample data and are not connected
        to the live product database.
      </p>
    </section>
  );
}
