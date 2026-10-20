"use client";

import {
  Ban,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Search,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import DashboardEmpty from "@/components/dashboard/DashboardEmpty";
import DashboardError from "@/components/dashboard/DashboardError";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useFetch } from "@/hooks/swr/useFetch";
import type { AdminOrder, OrdersResponse } from "@/types";
import {
  CancelOrderModal,
  MarkPaymentPaidModal,
  UpdateOrderStatusModal,
} from "./OrderActionModals";
import {
  formatOrderAmount,
  formatOrderDate,
  prettyOrderStatus,
} from "./orderActionUtils";
import OrderDetailsModal from "./OrderDetailsModal";

const PAGE_SIZE = 10;

const orderStatusClasses: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  processing: "border-indigo-200 bg-indigo-50 text-indigo-700",
  shipped: "border-violet-200 bg-violet-50 text-violet-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

const paymentStatusClasses: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-red-200 bg-red-50 text-red-700",
  refunded: "border-slate-200 bg-slate-100 text-slate-700",
};

function StatusBadge({
  status,
  classes,
}: {
  status: string;
  classes: Record<string, string>;
}) {
  return (
    <Badge
      variant={
        status === "pending" ||
        status === "failed" ||
        status === "cancelled"
          ? "secondary"
          : "default"
      }
      className={`gap-1 rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${classes[status] ?? ""}`}
    >
      {prettyOrderStatus(status)}
    </Badge>
  );
}

export default function OrdersDashboard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);
  const [activeAction, setActiveAction] = useState<
    "details" | "status" | "payment" | "cancel" | null
  >(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  const endpoint = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(PAGE_SIZE));
    if (orderStatus) params.set("status", orderStatus);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    if (debouncedSearch) params.set("search", debouncedSearch);
    return `/order?${params.toString()}`;
  }, [currentPage, orderStatus, paymentStatus, debouncedSearch]);

  const { data, isLoading, isError, refetch } =
    useFetch<OrdersResponse>(endpoint);

  const hasActiveFilters =
    search.trim() !== "" || Boolean(orderStatus) || Boolean(paymentStatus);
  const isSearchPending = search.trim() !== debouncedSearch;

  const handleOrderStatusChange = (value: string | null) => {
    setOrderStatus(value === "all" || value === null ? "" : value);
    setCurrentPage(1);
  };

  const handlePaymentStatusChange = (value: string | null) => {
    setPaymentStatus(value === "all" || value === null ? "" : value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setOrderStatus("");
    setPaymentStatus("");
    setCurrentPage(1);
  };

  const closeAction = () => {
    setActiveAction(null);
    setSelectedOrder(null);
  };

  const handleActionSuccess = async (
    updatedOrder: AdminOrder,
    message: string,
  ) => {
    await refetch(
      (current) =>
        current
          ? {
              ...current,
              data: current.data.map((item) =>
                item._id === updatedOrder._id ? updatedOrder : item,
              ),
            }
          : current,
      { revalidate: false },
    );
    setSelectedOrder(updatedOrder);
    setActiveAction(null);
    toast.success(message);
    await refetch();
    setSelectedOrder(null);
  };

  if (isLoading && !data) return <DashboardLoading />;
  if (isError && !data)
    return <DashboardError onRetry={() => void refetch()} />;

  const orders = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="mt-1 text-muted-foreground">
            Review customer orders, payment, and fulfillment status.
          </p>
          {meta && !isSearchPending && (
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {orders.length} of {meta.total} orders
            </p>
          )}
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64 sm:shrink-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order number, customer, email, or ID..."
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="h-9 rounded-full border-blue/30 bg-muted/30 pl-9 text-xs shadow-sm transition-all duration-200 focus:border-blue/40 focus:ring-2 focus:ring-blue/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:ml-auto sm:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Order status
            </label>
            <Select
              value={orderStatus || "all"}
              onValueChange={handleOrderStatusChange}
            >
              <SelectTrigger className="h-9 w-[155px] rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy">
                <SelectValue placeholder="All Order Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Order Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Payment
            </label>
            <Select
              value={paymentStatus || "all"}
              onValueChange={handlePaymentStatusChange}
            >
              <SelectTrigger className="h-9 w-[155px] rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy">
                <SelectValue placeholder="All Payment Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
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

      {isSearchPending ? (
        <Card
          className="overflow-hidden border p-0 shadow-sm"
          aria-label="Loading matching orders"
          aria-busy="true"
        >
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="h-12 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        </Card>
      ) : orders.length === 0 ? (
        <DashboardEmpty
          title={hasActiveFilters ? "No matching orders" : "No orders found"}
          description={
            hasActiveFilters
              ? "Try changing your search or filters."
              : "Customer orders will appear here when they are placed."
          }
          icon={<Package className="h-6 w-6" />}
        />
      ) : (
        <Card className="overflow-hidden border p-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const units = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  );

                  return (
                    <tr
                      key={order._id}
                      className="border-b transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-navy">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {order.paymentMethod === "cod"
                            ? "Cash on delivery"
                            : prettyOrderStatus(order.paymentMethod)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">
                          {order.customer.name}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {order.customer.phone}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {order.customer.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">
                          {order.items.length}{" "}
                          {order.items.length === 1
                            ? "item"
                            : "items"}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {units} {units === 1 ? "unit" : "units"}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          {formatOrderDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        {formatOrderAmount(
                          order.totalAmount,
                          order.currency,
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={order.paymentStatus}
                          classes={paymentStatusClasses}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={order.status}
                          classes={orderStatusClasses}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <DashboardButton
                              variant="outline"
                              className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
                              icon={
                                <MoreHorizontal className="h-4 w-4" />
                              }
                              ariaLabel={`Actions for order ${order.orderNumber}`}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-52"
                          >
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActiveAction("details");
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActiveAction("status");
                                }}
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Update Order Status
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                disabled={
                                  order.paymentStatus === "paid"
                                }
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActiveAction("payment");
                                }}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Payment as Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                disabled={
                                  order.status === "cancelled"
                                }
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActiveAction("cancel");
                                }}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {orders.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Rows per page: {PAGE_SIZE}
          </p>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <DashboardButton
              variant="outline"
              className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
              disabled={currentPage <= 1 || isLoading}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              icon={<ChevronLeft className="h-4 w-4" />}
              ariaLabel="Previous page"
            />
            <span className="text-sm text-muted-foreground">
              Page {meta?.page ?? currentPage} of{" "}
              {Math.max(1, totalPages)}
            </span>
            <DashboardButton
              variant="outline"
              className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1),
                )
              }
              icon={<ChevronRight className="h-4 w-4" />}
              ariaLabel="Next page"
            />
          </div>
        </div>
      )}

      {activeAction === "details" && (
        <OrderDetailsModal
          order={selectedOrder}
          open
          onClose={closeAction}
        />
      )}
      {activeAction === "status" && (
        <UpdateOrderStatusModal
          order={selectedOrder}
          open
          revalidateKey={endpoint}
          onClose={closeAction}
          onSuccess={handleActionSuccess}
        />
      )}
      {activeAction === "payment" && (
        <MarkPaymentPaidModal
          order={selectedOrder}
          open
          revalidateKey={endpoint}
          onClose={closeAction}
          onSuccess={handleActionSuccess}
        />
      )}
      {activeAction === "cancel" && (
        <CancelOrderModal
          order={selectedOrder}
          open
          revalidateKey={endpoint}
          onClose={closeAction}
          onSuccess={handleActionSuccess}
        />
      )}
    </section>
  );
}
