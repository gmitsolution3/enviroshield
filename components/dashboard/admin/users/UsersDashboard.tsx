"use client";
import { getInitials } from "@/lib/utils";

import {
    Ban,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    Mail,
    Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
    rowPaginationFeature,
    tableFeatures,
    useTable,
    type ColumnDef,
    type PaginationState,
} from "@tanstack/react-table";

import { authClient } from "@/lib/auth-client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type {
    AdminDashboardUser,
    AdminUsersResponse,
} from "@/types/user.type";
import DashboardButton from "../../DashboardButton";

import EmptyUsers from "./EmptyUsers";
import MobileUserCard from "./MobileUserCard";
import RoleBadge from "./RoleBadge";
import UserActions from "./UserActions";
import UsersDashboardError from "./UsersDashboardError";
import UsersDashboardLoader from "./UsersDashboardLoader";

const PAGE_SIZE = 10;

const features = tableFeatures({
  rowPaginationFeature,
});

type DashboardUser = AdminDashboardUser;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown) {
  return value === null || typeof value === "string";
}

function isAdminDashboardUser(value: unknown): value is AdminDashboardUser {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.emailVerified === "boolean" &&
    isNullableString(value.image) &&
    (value.imagePublicId === undefined || isNullableString(value.imagePublicId)) &&
    (value.phone === undefined || isNullableString(value.phone)) &&
    isNullableString(value.createdAt) &&
    isNullableString(value.updatedAt) &&
    typeof value.role === "string" &&
    typeof value.banned === "boolean" &&
    isNullableString(value.banReason) &&
    isNullableString(value.banExpires)
  );
}

function isAdminUsersResponse(value: unknown): value is AdminUsersResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.users) &&
    value.users.every(isAdminDashboardUser) &&
    typeof value.total === "number" &&
    Number.isInteger(value.total) &&
    value.total >= 0
  );
}

function formatUserDate(value: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not available";
}

export default function UsersDashboard() {
  const { data: session } = authClient.useSession();

  const [users, setUsers] = useState<DashboardUser[]>([]);

  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchUsers = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setIsError(false);

    const offset = pagination.pageIndex * pagination.pageSize;

    try {
      const params = new URLSearchParams({
        limit: String(pagination.pageSize),
        offset: String(offset),
      });

      if (searchValue) {
        params.set("search", searchValue);
      }

      const response = await fetch(
        `/api/admin/users?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Unable to load users.");
      }

      const data: unknown = await response.json();
      if (!isAdminUsersResponse(data)) {
        throw new Error("The user search response was invalid.");
      }

      setUsers(data.users);

      setTotal(data.total);

      // If the current page is no longer valid, return to page one.
      const totalPages = Math.max(
        1,
        Math.ceil(data.total / pagination.pageSize),
      );

      if (pagination.pageIndex >= totalPages) {
        setPagination((current) => ({
          ...current,
          pageIndex: Math.max(0, totalPages - 1),
        }));
      }
    } catch {
      setUsers([]);
      setTotal(0);
      setIsError(true);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, searchValue]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [fetchUsers]);

  const columns = useMemo<
    ColumnDef<typeof features, DashboardUser>[]
  >(
    () => [
      {
        id: "user",
        header: "User",

        cell: ({ row }) => {
          const user = row.original;

          const initials = getInitials(user.name, user.email);

          return (
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-10 w-10 rounded-xl">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
                />

                <AvatarFallback className="rounded-xl bg-violet-100 text-sm font-semibold text-violet-700">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate font-medium">
                  {user.name || "Unnamed user"}
                </p>

                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  Joined{" "}
                  {formatUserDate(user.createdAt)}
                </p>
              </div>
            </div>
          );
        },
      },

      {
        id: "contact",
        header: "Contact",

        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-2">
            <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

            <span className="truncate text-sm">
              {row.original.email}
            </span>
          </div>
        ),
      },

      {
        id: "role",
        header: "Role",

        cell: ({ row }) => (
          <RoleBadge role={row.original.role} />
        ),
      },

      {
        id: "status",
        header: "Status",

        cell: ({ row }) => {
          const isBanned = Boolean(row.original.banned);
          const isPermanent = isBanned && !row.original.banExpires;

          return isBanned ? (
            <Badge
              variant="outline"
              className="border-red-200 bg-red-50 text-red-700"
            >
              <Ban className="mr-1.5 h-3 w-3" />
              {isPermanent ? "Permanently Banned" : "Banned"}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              <CheckCircle2 className="mr-1.5 h-3 w-3" />
              Active
            </Badge>
          );
        },
      },

      {
        id: "emailVerification",
        header: "Email Verification",

        cell: ({ row }) => {
          const isVerified = row.original.emailVerified === true;

          return isVerified ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              <CheckCircle2 className="mr-1.5 h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700"
            >
              <CircleAlert className="mr-1.5 h-3 w-3" />
              Not verified
            </Badge>
          );
        },
      },

      {
        id: "actions",
        header: "",
        enableHiding: false,

        cell: ({ row }) => (
          <UserActions
            user={row.original}
            currentUserId={session?.user.id}
            onSuccess={() => fetchUsers(false)}
          />
        ),
      },
    ],
    [session?.user, fetchUsers],
  );

  const table = useTable({
    key: "users-dashboard",
    features,
    columns,
    data: users,
    manualPagination: true,
    rowCount: total,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  function handleSearch() {
    setPagination((current) => ({
      ...current,
      pageIndex: 0,
    }));

    setSearchValue(search.trim());
  }

  function handleClearSearch() {
    setSearch("");
    setSearchValue("");

    setPagination((current) => ({
      ...current,
      pageIndex: 0,
    }));
  }

  function handlePageSizeChange(value: string | null) {
    if (!value) return;

    setPagination({
      pageIndex: 0,
      pageSize: Number(value),
    });
  }

  if (isLoading) {
    return <UsersDashboardLoader />;
  }

  if (isError) {
    return <UsersDashboardError fetchUsers={fetchUsers} />;
  }

  const currentPage = pagination.pageIndex + 1;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pagination.pageSize),
  );

  const firstUser =
    total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;

  const lastUser = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    total,
  );

  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>

          <p className="mt-1 text-muted-foreground">
            Manage users, roles, and account access across
            Enviroshield.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Showing {users.length} of {total} users
          </p>
        </div>
      </div>

      {/* User list */}
      <Card className="overflow-hidden border p-0 shadow-sm">
        <CardHeader className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>User List</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {total} {total === 1 ? "user" : "users"} registered
              </p>
            </div>

            {/* Search */}
            <div className="flex items-center w-full flex-col gap-2 sm:flex-row lg:max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Search users by name..."
                  className="pl-10 py-5"
                />
              </div>

              <DashboardButton
                type="button"
                onClick={handleSearch}
                icon={<Search className="h-4 w-4" />}
              >
                Search
              </DashboardButton>

              {searchValue && (
                <DashboardButton
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                  className="h-9 rounded-full border-blue/60 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
                >
                  Clear
                </DashboardButton>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
          {users.length === 0 ? (
            <EmptyUsers />
          ) : (
            <>
              {/* Desktop table */}
              <div className="overflow-hidden rounded-xl border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                            >
                              {header.isPlaceholder ? null : (
                                <table.FlexRender header={header} />
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>

                    <tbody className="divide-y">
                      {table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="transition-colors hover:bg-muted/20"
                        >
                          {row.getAllCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-4">
                              <table.FlexRender cell={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile user cards */}
              <div className="space-y-3 md:hidden">
                {users.map((user) => (
                  <MobileUserCard
                    key={user.id}
                    user={user}
                    currentUserId={session?.user.id}
                    onSuccess={() => fetchUsers(false)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Rows per page */}
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-sm text-muted-foreground">
                    Rows per page:
                  </span>

                  <Select
                    value={String(pagination.pageSize)}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="h-8 w-20 rounded-full border-blue/30 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/5 focus:border-blue/40 focus:ring-2 focus:ring-blue/10">
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

                {/* Page information and navigation */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                  <span className="whitespace-nowrap text-sm text-muted-foreground">
                    Showing {firstUser}–{lastUser} of {total}
                  </span>

                  <span className="whitespace-nowrap text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>

                  <div className="flex items-center gap-2">
                    <DashboardButton
                      variant="outline"
                      disabled={!table.getCanPreviousPage()}
                      onClick={() => table.previousPage()}
                      icon={<ChevronLeft className="h-4 w-4" />}
                      className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
                      ariaLabel="Previous page"
                    />

                    <DashboardButton
                      variant="outline"
                      disabled={!table.getCanNextPage()}
                      onClick={() => table.nextPage()}
                      icon={<ChevronRight className="h-4 w-4" />}
                      className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
                      ariaLabel="Next page"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
