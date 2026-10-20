"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Package, Ban, CheckCircle, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import DashboardEmpty from "@/components/dashboard/DashboardEmpty";
import DashboardError from "@/components/dashboard/DashboardError";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFetch } from "@/hooks/swr/useFetch";
import type { AdminOrder, OrdersResponse } from "@/types";
import OrderDetailsModal from "./OrderDetailsModal";
import { CancelOrderModal, MarkPaymentPaidModal, UpdateOrderStatusModal } from "./OrderActionModals";
import { formatOrderAmount, formatOrderDate, prettyOrderStatus } from "./orderActionUtils";

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

function StatusBadge({ status, classes }: { status: string; classes: Record<string, string> }) {
  return (
    <Badge variant="outline" className={classes[status] ?? "capitalize"}>
      {prettyOrderStatus(status)}
    </Badge>
  );
}

export default function OrdersDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [activeAction, setActiveAction] = useState<"details" | "status" | "payment" | "cancel" | null>(null);
  const endpoint = `/order?page=${currentPage}&limit=${PAGE_SIZE}`;
  const { data, isLoading, isError, refetch } = useFetch<OrdersResponse>(
    endpoint,
  );

  const closeAction = () => {
    setActiveAction(null);
    setSelectedOrder(null);
  };

  const handleActionSuccess = async (updatedOrder: AdminOrder, message: string) => {
    await refetch(
      (current) => current
        ? { ...current, data: current.data.map((item) => item._id === updatedOrder._id ? updatedOrder : item) }
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
  if (isError && !data) return <DashboardError onRetry={() => void refetch()} />;

  const orders = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <section className="container mx-auto space-y-6 px-5 py-8 lg:px-0">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue">Ecommerce</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review customer orders, payment, and fulfillment status.</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {meta ? `${meta.total.toLocaleString()} orders` : ""}
        </p>
      </header>

      <Card className="overflow-hidden p-0">
        {orders.length === 0 ? (
          <div className="p-4">
            <DashboardEmpty
              title="No orders yet"
              description="Customer orders will appear here when they are placed."
              icon={<Package className="h-7 w-7 text-muted-foreground" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-semibold">Order</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Items</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Payment</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => {
                  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <tr key={order._id} className="align-top transition-colors hover:bg-muted/20">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-navy">{order.orderNumber}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {order.paymentMethod === "cod" ? "Cash on delivery" : prettyOrderStatus(order.paymentMethod)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{order.customer.phone}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{order.customer.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium">{order.items.length} {order.items.length === 1 ? "item" : "items"}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{units} {units === 1 ? "unit" : "units"}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />{formatOrderDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold whitespace-nowrap">{formatOrderAmount(order.totalAmount, order.currency)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.paymentStatus} classes={paymentStatusClasses} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} classes={orderStatusClasses} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label={`Actions for order ${order.orderNumber}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => { setSelectedOrder(order); setActiveAction("details"); }}><Eye /> View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedOrder(order); setActiveAction("status"); }}><Truck /> Update Order Status</DropdownMenuItem>
                            <DropdownMenuItem disabled={order.paymentStatus === "paid"} onClick={() => { setSelectedOrder(order); setActiveAction("payment"); }}><CheckCircle /> Mark Payment as Paid</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" disabled={order.status === "cancelled"} onClick={() => { setSelectedOrder(order); setActiveAction("cancel"); }}><Ban /> Cancel Order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 && (
          <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {meta?.page ?? currentPage} of {Math.max(1, totalPages)}
              {meta ? ` · ${meta.total.toLocaleString()} total orders` : ""}
            </p>
            <div className="flex items-center gap-2">
              <DashboardButton
                variant="outline"
                className="h-9 rounded-lg px-3"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                ariaLabel="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </DashboardButton>
              <DashboardButton
                variant="outline"
                className="h-9 rounded-lg px-3"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                ariaLabel="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </DashboardButton>
            </div>
          </div>
        )}
      </Card>

      {activeAction === "details" && <OrderDetailsModal order={selectedOrder} open onClose={closeAction} />}
      {activeAction === "status" && <UpdateOrderStatusModal order={selectedOrder} open revalidateKey={endpoint} onClose={closeAction} onSuccess={handleActionSuccess} />}
      {activeAction === "payment" && <MarkPaymentPaidModal order={selectedOrder} open revalidateKey={endpoint} onClose={closeAction} onSuccess={handleActionSuccess} />}
      {activeAction === "cancel" && <CancelOrderModal order={selectedOrder} open revalidateKey={endpoint} onClose={closeAction} onSuccess={handleActionSuccess} />}
    </section>
  );
}
