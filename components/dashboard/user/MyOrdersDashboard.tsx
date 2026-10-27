"use client";

import {
  CalendarDays,
  CreditCard,
  MapPin,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  UserDashboardMetric,
  UserListPagination,
  UserStatusBadge,
} from "./UserDashboardUI";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";
type PaymentStatus = "Paid" | "Pending" | "Refunded";
type OrderStatusFilter = "all" | OrderStatus;

interface UserOrder {
  orderNumber: string;
  date: string;
  products: string[];
  itemCount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryLocation: string;
}

const ORDERS: UserOrder[] = [
  {
    orderNumber: "ES-2026-1048",
    date: "2026-10-18",
    products: ["Heat Reflective Roof Coating", "Roof Primer"],
    itemCount: 3,
    total: 18450,
    status: "Processing",
    paymentStatus: "Paid",
    deliveryLocation: "Dhanmondi, Dhaka",
  },
  {
    orderNumber: "ES-2026-1019",
    date: "2026-10-07",
    products: ["AquaSeal Waterproof Membrane"],
    itemCount: 2,
    total: 12700,
    status: "Shipped",
    paymentStatus: "Paid",
    deliveryLocation: "Uttara, Dhaka",
  },
  {
    orderNumber: "ES-2026-0962",
    date: "2026-09-21",
    products: ["Concrete Crack Repair Kit", "Bonding Primer"],
    itemCount: 2,
    total: 8650,
    status: "Delivered",
    paymentStatus: "Paid",
    deliveryLocation: "Chattogram Sadar, Chattogram",
  },
  {
    orderNumber: "ES-2026-0914",
    date: "2026-09-12",
    products: ["Protective Floor Coating"],
    itemCount: 1,
    total: 7250,
    status: "Delivered",
    paymentStatus: "Paid",
    deliveryLocation: "Sylhet Sadar, Sylhet",
  },
  {
    orderNumber: "ES-2026-0851",
    date: "2026-08-29",
    products: ["Basement Waterproofing Compound", "Application Brush Set"],
    itemCount: 4,
    total: 11900,
    status: "Cancelled",
    paymentStatus: "Refunded",
    deliveryLocation: "Khulna Sadar, Khulna",
  },
  {
    orderNumber: "ES-2026-0784",
    date: "2026-08-14",
    products: ["Exterior Wall Shield"],
    itemCount: 2,
    total: 9600,
    status: "Delivered",
    paymentStatus: "Pending",
    deliveryLocation: "Rajshahi Sadar, Rajshahi",
  },
];

const PAGE_SIZE = 4;
const currencyFormatter = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatCurrency(amount: number) {
  return `৳${currencyFormatter.format(amount)}`;
}

function formatOrderDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

export default function MyOrdersDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatusFilter>("all");
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return ORDERS.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        order.orderNumber.toLowerCase().includes(normalizedSearch) ||
        order.products.some((product) => product.toLowerCase().includes(normalizedSearch));
      const matchesStatus = status === "all" || order.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const totalSpent = ORDERS
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const activeOrders = ORDERS.filter((order) =>
    order.status === "Processing" || order.status === "Shipped",
  ).length;
  const completedOrders = ORDERS.filter((order) => order.status === "Delivered").length;

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const visibleOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start = filteredOrders.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const end = Math.min(page * PAGE_SIZE, filteredOrders.length);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value: string | null) {
    if (value === "all" || value === "Processing" || value === "Shipped" || value === "Delivered" || value === "Cancelled") {
      setStatus(value);
      setPage(1);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 p-6 sm:p-8 lg:p-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">Your account</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">My Orders</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Keep track of your purchases, check delivery progress, and review your order history.
          </p>
        </div>
        <Badge variant="outline" className="w-fit rounded-full border-blue/20 bg-blue/5 px-3 py-1.5 text-sm font-semibold text-blue">
          {ORDERS.length} orders total
        </Badge>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Order summaries">
        <UserDashboardMetric
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          description="Across non-cancelled orders"
          icon={CreditCard}
          tone="blue"
        />
        <UserDashboardMetric
          title="Active Orders"
          value={String(activeOrders)}
          description="Processing or on the way"
          icon={Truck}
          tone="amber"
        />
        <UserDashboardMetric
          title="Completed Orders"
          value={String(completedOrders)}
          description="Successfully delivered"
          icon={PackageCheck}
          tone="teal"
        />
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">Order history</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Browse and filter your recent purchases.</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search order number or product..."
                aria-label="Search orders by order number or product"
                className="h-11 rounded-xl pl-9"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="order-status-filter" className="sr-only">Filter orders by status</label>
              <Select value={status} onValueChange={updateStatus}>
                <SelectTrigger id="order-status-filter" className="h-11 w-full rounded-xl">
                  <SelectValue placeholder="All orders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All orders</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-navy">No orders found</h2>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Try another order number, product name, or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border/70">
              {visibleOrders.map((order, index) => (
                <article
                  key={order.orderNumber}
                  className={`p-5 transition-colors hover:bg-muted/20 sm:p-6 ${index > 0 ? "border-t border-border/60" : ""}`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-base font-bold tracking-tight text-navy">{order.orderNumber}</h2>
                        <UserStatusBadge status={order.status} />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="flex min-w-0 items-start gap-2.5">
                          <ShoppingBag className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Items · {order.itemCount}</p>
                            <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">{order.products.join(", ")}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Order date</p>
                            <p className="mt-1 text-sm font-medium text-foreground">{formatOrderDate(order.date)}</p>
                          </div>
                        </div>
                        <div className="flex min-w-0 items-start gap-2.5 sm:col-span-2 xl:col-span-1">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Delivery location</p>
                            <p className="mt-1 truncate text-sm font-medium text-foreground">{order.deliveryLocation}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 lg:min-w-[200px] lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                      <div className="space-y-1 lg:text-right">
                        <p className="text-xs font-medium text-muted-foreground">Order total</p>
                        <p className="font-display text-xl font-bold text-navy">{formatCurrency(order.total)}</p>
                        <UserStatusBadge status={order.paymentStatus} />
                      </div>
                      <Button type="button" variant="outline" size="sm" className="rounded-full" disabled title="Order details are not available yet">
                        View details
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>

        {filteredOrders.length > 0 && (
          <UserListPagination
            page={page}
            totalPages={totalPages}
            start={start}
            end={end}
            total={filteredOrders.length}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}
