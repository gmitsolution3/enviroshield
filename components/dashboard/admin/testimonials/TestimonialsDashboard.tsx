"use client";

import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  MessageSquareQuote,
  MoreHorizontal,
  Plus,
  Star,
  Trash,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useFetch } from "@/hooks/swr/useFetch";
import type { ITestimonial, ITestimonialResponse } from "@/types";

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

import DashboardButton from "../../DashboardButton";
import DashboardEmpty from "../../DashboardEmpty";
import DashboardError from "../../DashboardError";
import DashboardLoading from "../../DashboardLoading";
import { formatDate } from "./../../../../utils/formatDate";

import CreateTestimonialModal from "./CreateTestimonialModal";
import DeleteTestimonialDialog from "./DeleteTestimonialDialog";
import UpdateTestimonialModal from "./UpdateTestimonialModal";
import ViewTestimonialModal from "./ViewTestimonialModal";

const features = tableFeatures({});

export default function TestimonialsDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [selectedTestimonial, setSelectedTestimonial] =
    useState<ITestimonial | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [deleteTestimonial, setDeleteTestimonial] =
    useState<ITestimonial | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch } =
    useFetch<ITestimonialResponse>(
      `/testimonial?page=${currentPage}&limit=${limit}`,
    );

  const testimonials = data?.data || [];
  const meta = data?.meta;

  const handleView = (testimonial: ITestimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (testimonial: ITestimonial) => {
    setSelectedTestimonial(testimonial);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (testimonial: ITestimonial) => {
    setDeleteTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
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

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (!filterStatus) return true;

    return filterStatus === "published"
      ? testimonial.status === "published"
      : testimonial.status !== "published";
  });

  const columns: ColumnDef<typeof features, ITestimonial>[] = [
    {
      accessorKey: "clientName",
      header: "Testimonial",

      cell: ({ row }) => {
        const testimonial = row.original;

        return (
          <div className="flex min-w-[380px] items-start gap-4">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
              {testimonial.clientImage?.url ? (
                <img
                  src={testimonial.clientImage.url}
                  alt={
                    testimonial.clientImage.alt ||
                    testimonial.clientName
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue">
                  <MessageSquareQuote className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-1.5">
              <div className="font-semibold leading-5 text-slate-900">
                {testimonial.clientName}
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={[
                      "h-3.5 w-3.5",
                      index < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300",
                    ].join(" ")}
                  />
                ))}

                <span className="ml-1 text-[11px] font-medium text-slate-400">
                  {testimonial.rating}/5
                </span>
              </div>

              <p className="max-w-xl truncate text-[13px] leading-5 text-slate-500">
                “{testimonial.content}”
              </p>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const testimonial = row.original;

        return (
          <div className="flex min-w-[130px] flex-col items-start gap-2">
            {testimonial.status === "published" ? (
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
                {testimonial.status}
              </Badge>
            )}

            <span className="text-[11px] text-slate-400">
              {testimonial.rating}/5 rating
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Created",

      cell: ({ row }) => {
        const testimonial = row.original;

        return (
          <div className="min-w-[140px] space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
              </span>

              <span>{formatDate(testimonial.createdAt)}</span>
            </div>

            <div className="pl-9 text-[11px] text-slate-400">
              Updated {formatDate(testimonial.updatedAt)}
            </div>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const testimonial = row.original;

        return (
          <div className="flex items-center gap-1.5">
            <DashboardButton
              variant="outline"
              className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleView(testimonial)}
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
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => handleDelete(testimonial)}
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
    data: filteredTestimonials,
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
          <h1 className="text-3xl font-bold">
            Testimonial Management
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage customer testimonials displayed across the
            Enviroshield website.
          </p>

          {meta && (
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {testimonials.length} of {meta.total}{" "}
              testimonials
            </p>
          )}
        </div>

        <DashboardButton
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Testimonial
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

      {/* Testimonial table */}
      {filteredTestimonials.length === 0 ? (
        <DashboardEmpty
          title="No testimonials found"
          description="Get started by adding your first customer testimonial."
          icon={<MessageSquareQuote className="h-6 w-6" />}
          actionLabel="Add Testimonial"
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
      {filteredTestimonials.length > 0 && (
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

      <CreateTestimonialModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        onSuccess={() => refetch()}
      />

      <UpdateTestimonialModal
        testimonial={selectedTestimonial}
        open={isUpdateModalOpen}
        revalidateKey={`/testimonial?page=${currentPage}&limit=${limit}`}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedTestimonial(null);
        }}
      />

      <ViewTestimonialModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        testimonial={selectedTestimonial}
      />

      <DeleteTestimonialDialog
        testimonial={deleteTestimonial}
        open={isDeleteDialogOpen}
        revalidateKey={`/testimonial?page=${currentPage}&limit=${limit}`}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeleteTestimonial(null);
        }}
      />
    </section>
  );
}
