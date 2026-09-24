"use client";

import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { Session } from "@/lib/auth-client";

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

type DashboardUser = Session["user"] & {
  banned?: boolean;
};

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

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    const offset = pagination.pageIndex * pagination.pageSize;

    const { data, error } = await authClient.admin.listUsers({
      query: {
        limit: pagination.pageSize,
        offset,

        searchValue: searchValue || undefined,

        searchField: "name",
        searchOperator: "contains",

        sortBy: "createdAt",
        sortDirection: "desc",
      },
    });

    if (error || !data) {
      setUsers([]);
      setTotal(0);
      setIsError(true);
      setIsLoading(false);

      return;
    }

    setUsers(data.users as DashboardUser[]);
    setTotal(data.total);
    setIsLoading(false);
  }, [pagination.pageIndex, pagination.pageSize, searchValue]);

  useEffect(() => {
    void fetchUsers();
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

          const initials = user.name
            ?.split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

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
                  {user.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
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
          <RoleBadge role={row.original.role as string} />
        ),
      },

      {
        id: "status",
        header: "Status",

        cell: ({ row }) => {
          const isBanned = Boolean(row.original.banned);

          return isBanned ? (
            <Badge
              variant="outline"
              className="border-red-200 bg-red-50 text-red-700"
            >
              <Ban className="mr-1.5 h-3 w-3" />
              Banned
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
        id: "actions",
        header: "",
        enableHiding: false,

        cell: ({ row }) => (
          <UserActions
            user={row.original}
            currentUserId={session?.user.id}
            onSuccess={fetchUsers}
          />
        ),
      },
    ],
    [session?.user.id, fetchUsers],
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

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Administration
        </p>

        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
          Users
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage users, roles, and account access.
        </p>
      </div>

      {/* User list */}
      <Card>
        <CardHeader className="gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>User list</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {total} {total === 1 ? "user" : "users"} registered
              </p>
            </div>

            {/* Search */}
            <div className="flex w-full gap-2 lg:max-w-md">
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
                  placeholder="Search by name..."
                  className="pl-9"
                />
              </div>

              <Button type="button" onClick={handleSearch}>
                Search
              </Button>

              {searchValue && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <EmptyUsers />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-2xl border md:block">
                <table className="w-full">
                  <thead className="bg-muted/40">
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

              {/* Mobile list */}
              <div className="space-y-3 md:hidden">
                {users.map((user) => (
                  <MobileUserCard
                    key={user.id}
                    user={user}
                    currentUserId={session?.user.id}
                    onSuccess={fetchUsers}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={!table.getCanPreviousPage()}
                      onClick={() => table.previousPage()}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={!table.getCanNextPage()}
                      onClick={() => table.nextPage()}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
