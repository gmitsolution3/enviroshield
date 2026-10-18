"use client";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  FolderTree,
  MoreHorizontal,
  Trash,
   Edit,
  Plus,
} from "lucide-react";
import { useState } from "react";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useFetch } from "@/hooks/swr/useFetch";
import type { ICategory, ICategoryResponse } from "@/types";

import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DashboardButton from "@/components/dashboard/DashboardButton";
import DashboardEmpty from "@/components/dashboard/DashboardEmpty";
import DashboardError from "@/components/dashboard/DashboardError";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

import CreateCategoryModal from "./CreateCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import ViewCategoryModal from "./ViewCategoryModal";

import { formatDate } from "@/utils/formatDate";

const features = tableFeatures({});

export default function CategoriesDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [selectedCategory, setSelectedCategory] =
    useState<ICategory | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [categoryToDelete, setCategoryToDelete] =
    useState<ICategory | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch } =
    useFetch<ICategoryResponse>(
      `/category?page=${currentPage}&limit=${limit}`,
    );

  const categories = data?.data ?? [];
  const meta = data?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: string | null) => {
    if (!newLimit) return;

    setLimit(Number(newLimit));
    setCurrentPage(1);
  };

  const handleView = (category: ICategory) => {
    setSelectedCategory(category);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (category: ICategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnDef<typeof features, ICategory>[] = [
    {
      accessorKey: "name",
      header: "Category",

      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="flex min-w-[260px] items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue/10 bg-blue/5 text-blue">
              <FolderTree className="h-5 w-5" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="truncate font-semibold leading-5 text-slate-900">
                {category.name}
              </div>

              <div className="text-[12px] text-slate-500">
                Category
              </div>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "slug",
      header: "Slug",

      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="min-w-[200px]">
            <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              /{category.slug}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Created",

      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="min-w-[140px] space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
              </span>

              <span>{formatDate(category.createdAt)}</span>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "updatedAt",
      header: "Last Updated",

      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="min-w-[140px] space-y-1.5">
            <div className="text-sm font-semibold text-slate-700">
              {formatDate(category.updatedAt)}
            </div>

            <div className="text-[11px] text-slate-400">
              Last modified
            </div>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="flex items-center gap-1.5">
            <DashboardButton
              variant="outline"
              className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleView(category)}
              ariaLabel="View category details"
            />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <DashboardButton
                  variant="outline"
                  className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
                  icon={<MoreHorizontal className="h-4 w-4" />}
                  ariaLabel="Category actions"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleView(category)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>

                  <DropdownMenuItem
  className="cursor-pointer"
  onClick={() => {
    setSelectedCategory(category);
    setIsUpdateModalOpen(true);
  }}
>
  <Edit className="mr-2 h-4 w-4" />
  Edit
</DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => handleDelete(category)}
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
    data: categories,
  });

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (isError) {
    return <DashboardError onRetry={() => refetch()} />;
  }

  const totalPages = meta?.totalPages || 1;
  const currentPageNum = meta?.page || currentPage;

  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 className="text-3xl font-bold">Category Management</h1>

    <p className="mt-1 text-muted-foreground">
      Manage the product categories available across Enviroshield.
    </p>

    {meta && (
      <p className="mt-1 text-sm text-muted-foreground">
        Showing {categories.length} of {meta.total} categories
      </p>
    )}
  </div>

  <DashboardButton
    icon={<Plus className="h-4 w-4" />}
    onClick={() => setIsCreateModalOpen(true)}
  >
    Add Category
  </DashboardButton>
</div>

      {/* Categories table */}
      {categories.length === 0 ? (
        <DashboardEmpty
          title="No categories found"
          description="There are no categories to display yet."
          icon={<FolderTree className="h-6 w-6" />}
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
                    key={row.id}
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
      {categories.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>

            <Select
              value={String(limit)}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="h-8 w-20 rounded-full border-blue/30 bg-muted/30 px-4 text-xs !text-navy font-semibold shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/5 focus:border-blue/40 focus:ring-2 focus:ring-blue/10">
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

          <div className="flex items-center gap-2">
            <DashboardButton
              variant="outline"
              disabled={currentPageNum <= 1}
              onClick={() => handlePageChange(currentPageNum - 1)}
              icon={<ChevronLeft className="h-4 w-4" />}
              className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
              ariaLabel="Previous page"
            />

            <span className="text-sm text-muted-foreground">
              Page {currentPageNum} of {totalPages}
            </span>

            <DashboardButton
              variant="outline"
              disabled={currentPageNum >= totalPages}
              onClick={() => handlePageChange(currentPageNum + 1)}
              icon={<ChevronRight className="h-4 w-4" />}
              className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
              ariaLabel="Next page"
            />
          </div>
        </div>
      )}

      <CreateCategoryModal
  isModalOpen={isCreateModalOpen}
  setIsModalOpen={setIsCreateModalOpen}
  revalidateKey={`/category?page=${currentPage}&limit=${limit}`}
/>

<UpdateCategoryModal
  category={selectedCategory}
  open={isUpdateModalOpen}
  revalidateKey={`/category?page=${currentPage}&limit=${limit}`}
  onClose={() => {
    setIsUpdateModalOpen(false);
    setSelectedCategory(null);
  }}
/>

      <ViewCategoryModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        category={selectedCategory}
      />

      <DeleteCategoryDialog
        category={categoryToDelete}
        open={isDeleteDialogOpen}
        revalidateKey={`/category?page=${currentPage}&limit=${limit}`}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
      />
    </section>
  );
}
