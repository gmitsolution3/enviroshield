
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FolderTree,
  Package,
  Plus,
  Search,
  Tags,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import DashboardButton from "@/components/dashboard/DashboardButton";

type CategoryStatus = "Active" | "Draft";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  products: number;
  status: CategoryStatus;
  createdAt: string;
};

const dummyCategories: Category[] = [
  {
    id: "CAT-001",
    name: "Waterproofing",
    slug: "waterproofing",
    description: "Waterproofing products and solutions.",
    products: 12,
    status: "Active",
    createdAt: "Oct 12, 2026",
  },
  {
    id: "CAT-002",
    name: "Flooring",
    slug: "flooring",
    description: "Flooring materials and protective systems.",
    products: 8,
    status: "Active",
    createdAt: "Oct 10, 2026",
  },
  {
    id: "CAT-003",
    name: "Protective Coatings",
    slug: "protective-coatings",
    description: "Protective coating products for surfaces.",
    products: 6,
    status: "Active",
    createdAt: "Oct 08, 2026",
  },
  {
    id: "CAT-004",
    name: "Construction Chemicals",
    slug: "construction-chemicals",
    description: "Chemical solutions for construction projects.",
    products: 0,
    status: "Draft",
    createdAt: "Oct 06, 2026",
  },
  {
    id: "CAT-005",
    name: "Repair Solutions",
    slug: "repair-solutions",
    description: "Repair and maintenance materials.",
    products: 4,
    status: "Active",
    createdAt: "Oct 03, 2026",
  },
  {
    id: "CAT-006",
    name: "Sealants",
    slug: "sealants",
    description: "Sealants for joints, gaps, and surfaces.",
    products: 0,
    status: "Draft",
    createdAt: "Oct 01, 2026",
  },
];

export default function CategoriesDashboard() {
  const [search, setSearch] = useState("");

  const categories = dummyCategories.filter((category) => {
    const query = search.toLowerCase().trim();

    return (
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    );
  });

  const activeCount = dummyCategories.filter(
    (category) => category.status === "Active",
  ).length;

  const draftCount = dummyCategories.filter(
    (category) => category.status === "Draft",
  ).length;

  const productCount = dummyCategories.reduce(
    (total, category) => total + category.products,
    0,
  );

  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FolderTree className="h-4 w-4" />
            <span>Ecommerce</span>
            <span>/</span>
            <span>Categories</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-navy">
            Category Management
          </h1>

          <p className="mt-2 text-muted-foreground">
            Organize your products into clear, manageable categories.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Showing {categories.length} of {dummyCategories.length} categories
          </p>
        </div>

        <DashboardButton
          disabled
          icon={<Plus className="h-4 w-4" />}
          className="min-h-10 rounded-full bg-blue px-5 text-sm font-semibold text-white opacity-60"
        >
          Add Category
        </DashboardButton>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-0 p-5 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Categories
              </p>
              <p className="mt-3 text-3xl font-bold text-navy">
                {dummyCategories.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                All catalog categories
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue/10 text-blue">
              <FolderTree className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-0 p-5 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Categories
              </p>
              <p className="mt-3 text-3xl font-bold text-navy">
                {activeCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Available in the catalog
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-0 p-5 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Draft Categories
              </p>
              <p className="mt-3 text-3xl font-bold text-navy">
                {draftCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Not yet published
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Tags className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-0 p-5 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Assigned Products
              </p>
              <p className="mt-3 text-3xl font-bold text-navy">
                {productCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Across all categories
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Category table */}
      <Card className="overflow-hidden border-0 p-0 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-navy">
              All Categories
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              View and organize your product categories.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              aria-label="Search categories"
              className="h-10 w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-blue/50 focus:ring-2 focus:ring-blue/10"
            />
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <FolderTree className="h-5 w-5" />
            </div>

            <h3 className="font-semibold text-navy">
              No categories found
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Try a different category name or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b bg-slate-50/80">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Slug
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Products
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b transition-colors last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                          <FolderTree className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800">
                            {category.name}
                          </p>
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                        /{category.slug}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Package className="h-4 w-4 text-slate-400" />
                        {category.products}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {category.status === "Active" ? (
                        <Badge className="border-0 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="px-2.5 py-1 text-xs font-semibold"
                        >
                          Draft
                        </Badge>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {category.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t bg-slate-50/50 px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Demo data only · Changes are not saved.
          </p>
        </div>
      </Card>
    </section>
  );
}
