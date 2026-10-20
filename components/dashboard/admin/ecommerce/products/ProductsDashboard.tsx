"use client";

import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  XCircle,
  Edit,
  MoreHorizontal,
  Trash,
  Send,
  EyeOff,
  History,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { tableFeatures, useTable, type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DashboardButton from "@/components/dashboard/DashboardButton";
import DashboardEmpty from "@/components/dashboard/DashboardEmpty";
import DashboardError from "@/components/dashboard/DashboardError";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import ViewProductModal from "./ViewProductModal";
import DeleteProductDialog from "./DeleteProductDialog";
import ProductStatusDialog from "./ProductStatusDialog";

import { useFetch } from "@/hooks/swr/useFetch";
import type { IProduct, IProductResponse } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { Input } from "@/components/ui/input";

const features = tableFeatures({});

export default function ProductsDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState("all");
  const [inStock, setInStock] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [productToChangeStatus, setProductToChangeStatus] = useState<
    IProduct | null
  >(null);

  // Debounce search input before requesting the API.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  // Build the endpoint using the supported query parameters.
  const endpoint = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (status !== "all") {
      params.set("status", status);
    }

    if (inStock !== "all") {
      params.set("inStock", inStock);
    }

    params.set("page", String(currentPage));
    params.set("limit", String(limit));
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);

    return `/product?${params.toString()}`;
  }, [debouncedSearch, status, inStock, currentPage, limit, sortBy, sortOrder]);

  const { data, isLoading, isError, refetch } =
    useFetch<IProductResponse>(endpoint);

  const products = data?.data ?? [];
  const meta = data?.meta;

  const handleStatusChange = (value: string | null) => {
    setStatus(value ?? "all");
    setCurrentPage(1);
  };

  const handleStockChange = (value: string | null) => {
    setInStock(value ?? "all");
    setCurrentPage(1);
  };

  const handleLimitChange = (value: string | null) => {
    if (!value) return;

    setLimit(Number(value));
    setCurrentPage(1);
  };

  const handleSortByChange = (value: string | null) => {
    if (!value) return;

    setSortBy(value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (value: string | null) => {
    if (!value) return;

    setSortOrder(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("all");
    setInStock("all");
    setCurrentPage(1);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleView = (product: IProduct) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleProductStatusAction = (product: IProduct) => {
    setProductToChangeStatus(product);
    setIsStatusDialogOpen(true);
  };

  const handleInventoryMovements = (product: IProduct) => {
    router.push(
      `/dashboard/ecommerce/products/${encodeURIComponent(product._id)}/inventory-movements`,
    );
  };

  const handleDelete = (product: IProduct) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnDef<typeof features, IProduct>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex min-w-[300px] items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {product.primaryImage?.url ? (
                <Image
                  src={product.primaryImage.url}
                  alt={product.primaryImage.alt || product.name}
                  fill
                  sizes="56px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-blue">
                  <Package className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold leading-5 text-slate-900">
                  {product.name}
                </span>

                {product.isFeatured && (
                  <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-semibold text-blue">
                    Featured
                  </span>
                )}
              </div>

              <p className="max-w-md truncate text-[13px] text-slate-500">
                {product.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="font-medium text-slate-500">
                  SKU: {product.sku}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>/{product.slug}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => (
        <span className="inline-flex max-w-[170px] truncate rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
          {row.original.categoryId.name}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="min-w-[100px]">
          <p className="font-semibold text-slate-800">
            ৳{row.original.price.toLocaleString("en-BD")}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Cost: ৳{row.original.costPrice.toLocaleString("en-BD")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "stockQuantity",
      header: "Stock",
      cell: ({ row }) => {
        const product = row.original;
        const isOutOfStock = product.stockQuantity <= 0;
        const isLowStock =
          !isOutOfStock && product.stockQuantity <= product.lowStockThreshold;

        return (
          <div className="min-w-[110px] space-y-1">
            <span
              className={`text-sm font-semibold ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                    ? "text-amber-700"
                    : "text-slate-800"
              }`}
            >
              {product.stockQuantity} units
            </span>

            <p className="text-[11px] text-slate-400">
              {isOutOfStock
                ? "Out of stock"
                : isLowStock
                  ? "Low stock"
                  : "In stock"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const product = row.original;
        const isPublished = product.status === "published";

        return (
          <div className="flex min-w-[130px] flex-col items-start gap-2">
            {isPublished ? (
              <Badge className="gap-1 rounded-full bg-green-500 px-3 py-1 text-[11px] font-semibold capitalize hover:bg-green-600">
                <CheckCircle className="h-3 w-3" />
                Published
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="gap-1 rounded-full px-3 py-1 text-[11px] font-semibold capitalize"
              >
                <XCircle className="h-3 w-3" />
                {product.status}
              </Badge>
            )}

            <span className="text-[11px] text-slate-400">
              {product.publishedAt
                ? `Published ${formatDate(product.publishedAt)}`
                : "Not published yet"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => (
        <div className="min-w-[130px] space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {formatDate(row.original.updatedAt)}
          </div>

          <p className="text-[11px] text-slate-400">
            Created {formatDate(row.original.createdAt)}
          </p>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex items-center gap-1.5">
            <DashboardButton
              variant="outline"
              className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleView(product)}
              ariaLabel="View product details"
            />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <DashboardButton
                  variant="outline"
                  className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
                  icon={<MoreHorizontal className="h-4 w-4" />}
                  ariaLabel="Product actions"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleProductStatusAction(product)}
                  >
                    {product.status === "published" ? (
                      <EyeOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {product.status === "published" ? "Unpublish" : "Publish"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleInventoryMovements(product)}
                  >
                    <History className="mr-2 h-4 w-4" />
                    View Inventory Movements
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useTable({
    features,
    columns,
    data: products,
  });

  if (isLoading && !data) {
    return <DashboardLoading />;
  }

  if (isError && !data) {
    return <DashboardError onRetry={() => refetch()} />;
  }

  const totalPages = meta?.totalPages ?? 1;
  const currentPageNum = meta?.page ?? currentPage;
  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "all" ||
    inStock !== "all" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>

          <p className="mt-1 text-muted-foreground">
            Manage product information, pricing, stock, and publishing.
          </p>

          {meta && (
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {products.length} products on this page of {meta.total}{" "}
              total products
            </p>
          )}
        </div>

        <DashboardButton
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Product
        </DashboardButton>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-64 sm:shrink-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-full border-blue/30 bg-muted/30 pl-9 text-xs shadow-sm transition-all duration-200 focus:border-blue/40 focus:ring-2 focus:ring-blue/10"
          />
        </div>

        {/* Filters */}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 sm:ml-auto sm:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 w-[125px] rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stock filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Stock
            </label>
            <Select value={inStock} onValueChange={handleStockChange}>
              <SelectTrigger className="h-9 w-[125px] rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy">
                <SelectValue placeholder="All stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stock</SelectItem>
                <SelectItem value="true">In stock</SelectItem>
                <SelectItem value="false">Out of stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort field */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Sort by
            </label>
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="h-9 w-[140px] rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date created</SelectItem>
                <SelectItem value="updatedAt">Last updated</SelectItem>
                <SelectItem value="name">Product name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="stockQuantity">Stock quantity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort direction */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Order
            </label>
            <Select value={sortOrder} onValueChange={handleSortOrderChange}>
              <SelectTrigger className="h-9 w-[115px] rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <DashboardButton
              variant="outline"
              onClick={clearFilters}
              className="h-9 rounded-full px-4 text-xs"
            >
              Clear
            </DashboardButton>
          )}
        </div>
      </div>

      {/* Products table */}
      {products.length === 0 ? (
        <DashboardEmpty
          title="No products found"
          description={
            hasActiveFilters
              ? "Try changing your search or filters."
              : "Your product catalogue is empty. Add your first product to get started."
          }
          icon={<Package className="h-6 w-6" />}
          actionLabel={hasActiveFilters ? undefined : "Add Your First Product"}
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <Card className="overflow-hidden border p-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-sm font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.original._id}
                    className="border-b transition-colors last:border-0 hover:bg-muted/30"
                  >
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {products.length > 0 && (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>

            <Select value={String(limit)} onValueChange={handleLimitChange}>
              <SelectTrigger className="h-8 w-20 rounded-full border-blue/30 bg-muted/30 px-4 text-xs font-semibold text-navy">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Page {currentPageNum} of {totalPages}
            </span>

            <DashboardButton
              variant="outline"
              disabled={currentPageNum <= 1}
              onClick={() => setCurrentPage(currentPageNum - 1)}
              icon={<ChevronLeft className="h-4 w-4" />}
              className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white hover:bg-[#005cb9] hover:text-white disabled:pointer-events-none disabled:opacity-50"
              ariaLabel="Previous page"
            />

            <DashboardButton
              variant="outline"
              disabled={currentPageNum >= totalPages}
              onClick={() => setCurrentPage(currentPageNum + 1)}
              icon={<ChevronRight className="h-4 w-4" />}
              className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white hover:bg-[#005cb9] hover:text-white disabled:pointer-events-none disabled:opacity-50"
              ariaLabel="Next page"
            />
          </div>
        </div>
      )}

      {/* CREATE PRODUCT */}
      <CreateProductModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        revalidateKey={`/product?page=${currentPage}&limit=${limit}`}
        onSuccess={() => refetch()}
      />
      
      {/* EDIT PRODUCT */}
      <EditProductModal
        product={selectedProduct}
        open={isEditModalOpen}
        revalidateKey={endpoint}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
          refetch();
        }}
      />

      {/* VIEW PRODUCT */}
      <ViewProductModal
        product={selectedProduct}
        isModalOpen={isViewModalOpen}
        setIsModalOpen={(open) => {
          setIsViewModalOpen(open);

          if (!open) {
            setSelectedProduct(null);
          }
        }}
      />

      {/* PRODUCT STATUS */}
      <ProductStatusDialog
        product={productToChangeStatus}
        open={isStatusDialogOpen}
        revalidateKey={endpoint}
        onClose={() => {
          setIsStatusDialogOpen(false);
          setProductToChangeStatus(null);
        }}
      />

      {/* DELETE PRODUCT */}
      <DeleteProductDialog
        product={productToDelete}
        open={isDeleteDialogOpen}
        revalidateKey={`/product?page=${currentPage}&limit=${limit}`}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
          refetch();
        }}
      />
    </section>
  );
}
