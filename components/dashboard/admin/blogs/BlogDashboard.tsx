"use client";

import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Trash,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useFetch } from "@/hooks/swr/useFetch";
import type { IBlog, IBlogResponse } from "@/types";

import { Badge } from "@/components/ui/badge";
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

import { formatDate } from "../../../../utils/formatDate";
import DashboardButton from "../../DashboardButton";
import DashboardEmpty from "../../DashboardEmpty";
import DashboardError from "../../DashboardError";
import DashboardLoading from "../../DashboardLoading";

import CreateBlogModal from "./CreateBlogModal";
import EditBlogModal from "./EditBlogModal";

const features = tableFeatures({});

//todo: yet to complete the blog management dashboard with add, edit, delete, and view functionalities. Currently, it fetches and displays blogs with filtering and pagination.

export default function BlogDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(
    null,
  );

  const { data, isLoading, isError, refetch } =
    useFetch<IBlogResponse>(
      `/blog?page=${currentPage}&limit=${limit}`,
    );

  const blogs = data?.data || [];
  const meta = data?.meta;

  const handleView = (blog: IBlog) => {
    console.log("View blog:", blog);
  };

  const handleEdit = (blog: IBlog) => {
    setSelectedBlog(blog);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (blog: IBlog) => {
    console.log("Delete blog:", blog);
  };

  const handleFilterChange = (value: string | null) => {
    setFilterStatus(value ?? "");
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFilterStatus("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: string | null) => {
    if (!newLimit) return;

    setLimit(Number(newLimit));
    setCurrentPage(1);
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (!filterStatus) return true;

    return filterStatus === "published"
      ? blog.status === "published"
      : blog.status !== "published";
  });

  const columns: ColumnDef<typeof features, IBlog>[] = [
    {
      accessorKey: "title",
      header: "Blog",

      cell: ({ row }) => {
        const blog = row.original;

        return (
          <div className="flex min-w-[380px] items-start gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
              {blog.coverImage?.url ? (
                <div className="relative h-full w-full">
                  <Image
                    src={blog.coverImage.url}
                    alt={blog.coverImage.alt || blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue">
                  <FileText className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-1.5">
              <div className="font-semibold leading-5 text-slate-900">
                {blog.title}
              </div>

              <p className="max-w-xl truncate text-[13px] leading-5 text-slate-500">
                {blog.excerpt}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-medium text-slate-500">
                  /{blog.slug}
                </span>

                {blog.tags.length > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />

                    <span>
                      {blog.tags.length}{" "}
                      {blog.tags.length === 1 ? "tag" : "tags"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const blog = row.original;

        return (
          <div className="flex min-w-[150px] flex-col items-start gap-2">
            {blog.status === "published" ? (
              <Badge className="gap-1 rounded-full bg-green-500 px-3 py-1 text-[11px] font-semibold hover:bg-green-600">
                <CheckCircle className="h-3 w-3" />
                Published
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="gap-1 rounded-full px-3 py-1 text-[11px] font-semibold capitalize"
              >
                <XCircle className="h-3 w-3" />
                {blog.status}
              </Badge>
            )}

            <span className="text-[11px] text-slate-400">
              {blog.publishedAt
                ? `Published ${formatDate(blog.publishedAt)}`
                : "Not published yet"}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Created",

      cell: ({ row }) => {
        const blog = row.original;

        return (
          <div className="min-w-[140px] space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
              </span>

              <span>{formatDate(blog.createdAt)}</span>
            </div>

            <div className="pl-9 text-[11px] text-slate-400">
              Updated {formatDate(blog.updatedAt)}
            </div>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const blog = row.original;

        return (
          <div className="flex items-center gap-1.5">
            <DashboardButton
              variant="outline"
              className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleView(blog)}
            />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <DashboardButton
                  variant="outline"
                  className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
                  icon={<MoreHorizontal className="h-4 w-4" />}
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleEdit(blog)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => handleDelete(blog)}
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
    data: filteredBlogs,
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
          <h1 className="text-3xl font-bold">Blog Management</h1>

          <p className="mt-1 text-muted-foreground">
            Manage the blog articles available across Enviroshield.
          </p>

          {meta && (
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {blogs.length} of {meta.total} blogs
            </p>
          )}
        </div>

        <DashboardButton
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Blog
        </DashboardButton>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select
          value={filterStatus}
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-full border-blue/30 bg-muted/30 px-4 text-xs !text-navy font-semibold shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/5 focus:border-blue/40 focus:ring-2 focus:ring-blue/10">
            <SelectValue placeholder="All status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="published">Published</SelectItem>

            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        {filterStatus && (
          <DashboardButton
            variant="outline"
            onClick={clearFilter}
            className="h-9 rounded-full border-blue/60 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
          >
            Clear filter
          </DashboardButton>
        )}
      </div>

      {/* Blog table */}
      {filteredBlogs.length === 0 ? (
        <DashboardEmpty
          title="No blogs found"
          description="Get started by adding your first Enviroshield blog."
          icon={<FileText className="h-6 w-6" />}
          actionLabel="Add Blog"
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
      {filteredBlogs.length > 0 && (
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

      <CreateBlogModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        onSuccess={() => refetch()}
      />

      <EditBlogModal
        blog={selectedBlog}
        open={isUpdateModalOpen}
        revalidateKey="/blog"
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedBlog(null);
          refetch();
        }}
      />
    </section>
  );
}
