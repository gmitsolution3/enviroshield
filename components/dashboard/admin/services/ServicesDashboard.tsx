"use client";

import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useFetch } from "@/hooks/swr/useFetch";
import type { IService, IServiceResponse } from "@/types";

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

import CreateServiceModal from "./CreateServiceModal";

const features = tableFeatures({});

export default function ServicesDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } =
    useFetch<IServiceResponse>(
      `/service?page=${currentPage}&limit=${limit}`,
    );

  const services = data?.data || [];
  const meta = data?.meta;

  const handleView = (service: IService) => {
    console.log("View service:", service);
  };

  const handleEdit = (service: IService) => {
    console.log("Edit service:", service);
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

  const filteredServices = services.filter((service) => {
    if (!filterStatus) return true;

    return filterStatus === "published"
      ? service.status === "published"
      : service.status !== "published";
  });

  const columns: ColumnDef<typeof features, IService>[] = [
    {
      accessorKey: "name",
      header: "Service",

      cell: ({ row }) => {
        const service = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              {service.primaryImage?.url ? (
                <img
                  src={service.primaryImage.url}
                  alt={service.primaryImage.alt || service.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="font-semibold">{service.name}</div>

              <div className="mt-0.5 max-w-md truncate text-sm text-muted-foreground">
                {service.description}
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                /{service.slug}
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
        const service = row.original;

        return (
          <>
            {service.status === "published" ? (
              <Badge className="gap-1 bg-green-500 hover:bg-green-600">
                <CheckCircle className="h-3 w-3" />
                Published
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                {service.status}
              </Badge>
            )}

            {service.isFeatured && (
              <Badge variant="outline" className="ml-2">
                Featured
              </Badge>
            )}
          </>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Created",

      cell: ({ row }) => {
        const service = row.original;

        return (
          <>
            <div className="flex items-center text-sm font-medium">
              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />

              {formatDate(service.createdAt)}
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              Updated: {formatDate(service.updatedAt)}
            </div>
          </>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const service = row.original;

        return (
          <div className="flex items-center gap-1">
            <DashboardButton
              variant="outline"
              className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleView(service)}
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
                    onSelect={() => handleEdit(service)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
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
    data: filteredServices,
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
          <h1 className="text-3xl font-bold">Service Management</h1>

          <p className="mt-1 text-muted-foreground">
            Manage the services available across Enviroshield.
          </p>

          {meta && (
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {services.length} of {meta.total} services
            </p>
          )}
        </div>

        <DashboardButton
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Service
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

      {/* Service table */}
      {filteredServices.length === 0 ? (
        <DashboardEmpty
          title="No services found"
          description="Get started by adding your first Enviroshield service."
          icon={<span className="text-2xl">🛠️</span>}
          actionLabel="Add Service"
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
      {filteredServices.length > 0 && (
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

      <CreateServiceModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        onSuccess={() => refetch()}
      />
    </section>
  );
}
