"use client";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useFetch } from "@/hooks/swr/useFetch";
import type {
  IContact,
  IContactResponse,
  TContactSource,
  TContactStatus,
} from "@/types";

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
import EditContactModal from "./EditContactModal";
import ViewContactModal from "./ViewContactModal";
import DeleteContactDialog from "./DeleteContactDialog";

const features = tableFeatures({});

const statusLabels: Record<TContactStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  "site-visit": "Site Visit",
  "proposal-sent": "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

const sourceLabels: Record<TContactSource, string> = {
  website: "Website",
  phone: "Phone",
  referral: "Referral",
  other: "Other",
};

function formatContactDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatProjectType(value?: string) {
  if (!value) return "—";

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusBadgeClass(status: TContactStatus) {
  switch (status) {
    case "new":
      return "bg-blue text-white hover:bg-blue";

    case "contacted":
      return "bg-amber-500 text-white hover:bg-amber-600";

    case "qualified":
      return "bg-violet-500 text-white hover:bg-violet-600";

    case "site-visit":
      return "bg-cyan-500 text-white hover:bg-cyan-600";

    case "proposal-sent":
      return "bg-indigo-500 text-white hover:bg-indigo-600";

    case "won":
      return "bg-green-500 text-white hover:bg-green-600";

    case "lost":
      return "bg-red-500 text-white hover:bg-red-600";

    default:
      return "";
  }
}

export default function ContactsDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filterStatus, setFilterStatus] = useState<
    TContactStatus | ""
  >("");

  const [filterSource, setFilterSource] = useState<
    TContactSource | ""
  >("");

  const [selectedContact, setSelectedContact] =
    useState<IContact | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryParams = new URLSearchParams();

  queryParams.set("page", String(currentPage));
  queryParams.set("limit", String(limit));

  if (filterStatus) {
    queryParams.set("status", filterStatus);
  }

  if (filterSource) {
    queryParams.set("source", filterSource);
  }

  const contactQuery = `/contact?${queryParams.toString()}`;

  const { data, isLoading, isError, refetch } =
    useFetch<IContactResponse>(contactQuery);

  const contacts = data?.data || [];
  const meta = data?.meta;

  const handleView = (contact: IContact) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);
  };

  const handleEdit = (contact: IContact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const handleDelete = (contact: IContact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusChange = (value: string | null) => {
    setFilterStatus((value as TContactStatus | "") ?? "");
    setCurrentPage(1);
  };

  const handleSourceChange = (value: string | null) => {
    setFilterSource((value as TContactSource | "") ?? "");
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterStatus("");
    setFilterSource("");
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

  const columns: ColumnDef<typeof features, IContact>[] = [
    {
      accessorKey: "fullName",
      header: "Contact",

      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="flex min-w-[320px] items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue/10 bg-blue/5 text-blue">
              <User className="h-5 w-5" />
            </div>

            <div className="min-w-0 space-y-1.5">
              <div className="font-semibold leading-5 text-slate-900">
                {contact.fullName}
              </div>

              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <Mail className="h-3.5 w-3.5" />

                <span className="truncate">{contact.email}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Phone className="h-3.5 w-3.5" />

                <span>{contact.phoneNumber}</span>
              </div>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "projectName",
      header: "Project",

      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="min-w-[280px] space-y-1.5">
            <div className="font-semibold text-slate-700">
              {contact.projectName || "No project name"}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              {contact.projectType && (
                <span className="font-medium text-slate-500">
                  {formatProjectType(contact.projectType)}
                </span>
              )}

              {contact.projectLocation && (
                <>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />

                  <span>
                    {contact.projectLocation.city},{" "}
                    {contact.projectLocation.country}
                  </span>
                </>
              )}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="min-w-[140px] space-y-2">
            <Badge
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusBadgeClass(
                contact.status,
              )}`}
            >
              {statusLabels[contact.status]}
            </Badge>

            <div className="text-[11px] text-slate-400">
              Source:{" "}
              <span className="font-medium text-slate-500">
                {sourceLabels[contact.source]}
              </span>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "projectAreaSize",
      header: "Project Size",

      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="min-w-[130px]">
            {contact.projectAreaSize ? (
              <div className="font-semibold text-slate-700">
                {contact.projectAreaSize.toLocaleString()}{" "}
                {contact.projectAreaUnit || ""}
              </div>
            ) : (
              <span className="text-sm text-slate-400">—</span>
            )}

            {contact.siteVisitRequired && (
              <div className="mt-1 text-[11px] font-medium text-blue">
                Site visit required
              </div>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Received",

      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="min-w-[150px] space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
              </span>

              <span>{formatContactDate(contact.createdAt)}</span>
            </div>

            <div className="pl-9 text-[11px] text-slate-400">
              Updated {formatContactDate(contact.updatedAt)}
            </div>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="flex items-center gap-1.5">
            <DashboardButton
              variant="outline"
              className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleView(contact)}
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
                    onClick={() => handleEdit(row.original)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleDelete(row.original)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
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
    data: contacts,
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
          <h1 className="text-3xl font-bold">Contact Management</h1>

          <p className="mt-1 text-muted-foreground">
            Manage and review contact submissions received through the
            Enviroshield website.
          </p>

          {meta && (
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {contacts.length} of {meta.total} contacts
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm font-medium">Filter:</span>
        </div>

        {/* Status */}
        <Select
          value={filterStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="h-9 w-[170px] rounded-full border-blue/30 bg-muted/30 px-4 text-xs !text-navy font-semibold shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/5 focus:border-blue/40 focus:ring-2 focus:ring-blue/10">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="new">New</SelectItem>

            <SelectItem value="contacted">Contacted</SelectItem>

            <SelectItem value="qualified">Qualified</SelectItem>

            <SelectItem value="site-visit">Site Visit</SelectItem>

            <SelectItem value="proposal-sent">
              Proposal Sent
            </SelectItem>

            <SelectItem value="won">Won</SelectItem>

            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>

        {/* Source */}
        <Select
          value={filterSource}
          onValueChange={handleSourceChange}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-full border-blue/30 bg-muted/30 px-4 text-xs !text-navy font-semibold shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/5 focus:border-blue/40 focus:ring-2 focus:ring-blue/10">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="website">Website</SelectItem>

            <SelectItem value="phone">Phone</SelectItem>

            <SelectItem value="referral">Referral</SelectItem>

            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {(filterStatus || filterSource) && (
          <DashboardButton
            variant="outline"
            onClick={clearFilters}
            className="h-9 rounded-full border-blue/60 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
          >
            Clear filters
          </DashboardButton>
        )}
      </div>

      {/* Contact table */}
      {contacts.length === 0 ? (
        <DashboardEmpty
          title="No contacts found"
          description="There are no contact submissions matching the selected filters."
          icon={<Mail className="h-6 w-6" />}
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
      {contacts.length > 0 && (
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

      <ViewContactModal
        isModalOpen={isViewModalOpen}
        setIsModalOpen={(open) => {
          setIsViewModalOpen(open);

          if (!open) {
            setSelectedContact(null);
          }
        }}
        contact={selectedContact}
      />

      <EditContactModal
        contact={selectedContact}
        open={isEditModalOpen}
        revalidateKey={contactQuery}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedContact(null);
        }}
      />

      <DeleteContactDialog
        contact={selectedContact}
        open={isDeleteDialogOpen}
        revalidateKey={contactQuery}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedContact(null);
        }}
      />
    </section>
  );
}
