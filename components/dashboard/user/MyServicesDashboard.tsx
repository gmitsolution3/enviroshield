"use client";

import {
  CalendarDays,
  ClipboardList,
  Clock3,
  Search,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";

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

type RequestStatus = "Submitted" | "Under Review" | "In Progress" | "Completed" | "Rejected";
type StatusFilter = "all" | RequestStatus;

interface ServiceRequest {
  reference: string;
  serviceName: string;
  submittedAt: string;
  description: string;
  status: RequestStatus;
  appointmentDate?: string;
}

const SERVICE_REQUESTS: ServiceRequest[] = [
  {
    reference: "SR-2026-0284",
    serviceName: "Roof Waterproofing",
    submittedAt: "2026-10-21",
    description: "Water seepage around the rooftop stairwell and parapet walls of a two-storey home.",
    status: "In Progress",
    appointmentDate: "2026-10-30",
  },
  {
    reference: "SR-2026-0261",
    serviceName: "Concrete Repair",
    submittedAt: "2026-10-14",
    description: "Assessment and repair recommendation for hairline cracks in the front balcony slab.",
    status: "Under Review",
    appointmentDate: "2026-11-02",
  },
  {
    reference: "SR-2026-0218",
    serviceName: "Basement Waterproofing",
    submittedAt: "2026-09-26",
    description: "Request to inspect damp patches appearing along the north basement wall after heavy rain.",
    status: "Submitted",
  },
  {
    reference: "SR-2026-0187",
    serviceName: "Protective Coating",
    submittedAt: "2026-09-08",
    description: "Protective coating applied to the rooftop water tank and adjoining service platform.",
    status: "Completed",
  },
  {
    reference: "SR-2026-0142",
    serviceName: "Roof Waterproofing",
    submittedAt: "2026-08-19",
    description: "Roof inspection and membrane application for a small commercial property in Banani.",
    status: "Completed",
  },
  {
    reference: "SR-2026-0093",
    serviceName: "Concrete Repair",
    submittedAt: "2026-07-30",
    description: "Request for a structural assessment of exterior concrete steps and landing.",
    status: "Rejected",
  },
];

const PAGE_SIZE = 4;
const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

export default function MyServicesDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return SERVICE_REQUESTS.filter((request) => {
      const matchesSearch =
        !normalizedSearch ||
        request.serviceName.toLowerCase().includes(normalizedSearch) ||
        request.reference.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === "all" || request.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const inProgress = SERVICE_REQUESTS.filter((request) => request.status === "In Progress").length;
  const completed = SERVICE_REQUESTS.filter((request) => request.status === "Completed").length;
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const visibleRequests = filteredRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start = filteredRequests.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const end = Math.min(page * PAGE_SIZE, filteredRequests.length);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value: string | null) {
    if (
      value === "all" || value === "Submitted" || value === "Under Review" ||
      value === "In Progress" || value === "Completed" || value === "Rejected"
    ) {
      setStatus(value);
      setPage(1);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 p-6 sm:p-8 lg:p-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">Your account</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">My Services</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Track your service requests and stay updated on their progress.
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-blue/20 bg-blue/5 px-3 py-1.5 text-sm font-semibold text-blue">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          {SERVICE_REQUESTS.length} requests total
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Service request summaries">
        <UserDashboardMetric
          title="Total Requests"
          value={String(SERVICE_REQUESTS.length)}
          description="All submitted service requests"
          icon={ClipboardList}
          tone="blue"
        />
        <UserDashboardMetric
          title="In Progress"
          value={String(inProgress)}
          description="Currently being processed"
          icon={Clock3}
          tone="amber"
        />
        <UserDashboardMetric
          title="Completed"
          value={String(completed)}
          description="Successfully completed requests"
          icon={Wrench}
          tone="teal"
        />
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
              <Wrench className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">Service requests</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Your service applications and their latest status.</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_210px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search service or reference..."
                aria-label="Search service requests by service name or reference"
                className="h-11 rounded-xl pl-9"
              />
            </div>
            <div>
              <label htmlFor="service-status-filter" className="sr-only">Filter service requests by status</label>
              <Select value={status} onValueChange={updateStatus}>
                <SelectTrigger id="service-status-filter" className="h-11 w-full rounded-xl">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ClipboardList className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-navy">No service requests found</h2>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Try a different service name, reference number, or status.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleRequests.map((request) => (
                <article
                  key={request.reference}
                  className="rounded-2xl border border-border/70 p-5 transition-colors hover:border-blue/25 hover:bg-muted/10 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold tracking-wide text-muted-foreground">{request.reference}</span>
                        <UserStatusBadge status={request.status} />
                      </div>
                      <h2 className="mt-3 font-display text-lg font-bold tracking-tight text-navy">{request.serviceName}</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{request.description}</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="w-fit shrink-0 rounded-full" disabled title="Request details are not available yet">
                      View details
                    </Button>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-border/60 pt-4 text-sm sm:flex-row sm:items-center sm:gap-8">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Submitted <span className="font-medium text-foreground">{formatDate(request.submittedAt)}</span></span>
                    </div>
                    {request.appointmentDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock3 className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Site visit <span className="font-medium text-foreground">{formatDate(request.appointmentDate)}</span></span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>

        {filteredRequests.length > 0 && (
          <UserListPagination
            page={page}
            totalPages={totalPages}
            start={start}
            end={end}
            total={filteredRequests.length}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}
