import {
  Activity,
  ArrowUpRight,
  FileText,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminDashboardProps {
  user: {
    name: string;
    email: string;
  };
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-10 p-6 sm:p-8 lg:p-10">
      {/* Introduction */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">
          Administration
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
          Welcome back, {user.name}.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Here&apos;s an overview of what&apos;s happening across
          Enviroshield.
        </p>
      </section>

      {/* Overview metrics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="group rounded-2xl border-border/70 bg-background shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Users
            </CardTitle>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-display text-2xl font-bold tracking-tight">
              —
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              User statistics will appear here.
            </p>
          </CardContent>
        </Card>

        <Card className="group rounded-2xl border-border/70 bg-background shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Applications
            </CardTitle>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/[0.08] text-teal">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-display text-2xl font-bold tracking-tight">
              —
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Application statistics will appear here.
            </p>
          </CardContent>
        </Card>

        <Card className="group rounded-2xl border-border/70 bg-background shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reports
            </CardTitle>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-display text-2xl font-bold tracking-tight">
              —
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Report statistics will appear here.
            </p>
          </CardContent>
        </Card>

        <Card className="group rounded-2xl border-border/70 bg-background shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activity
            </CardTitle>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-display text-2xl font-bold tracking-tight">
              No activity
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Admin activity will appear here.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Lower dashboard */}
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-2xl border-border/70 bg-background shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 px-6 py-5 sm:px-7">
            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Recent activity
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Recent activity across Enviroshield.
              </p>
            </div>

            <Activity className="h-4 w-4 text-muted-foreground/50" />
          </CardHeader>

          <CardContent className="flex min-h-52 items-center justify-center px-6 py-7 sm:px-7">
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Activity className="h-4 w-4" />
              </div>

              <p className="mt-4 text-sm font-medium">
                No recent activity
              </p>

              <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Administrative activity will appear here as your
                platform grows.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-background shadow-none">
          <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
            <CardTitle className="font-display text-base font-bold tracking-tight">
              Quick actions
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Common administrative tasks.
            </p>
          </CardHeader>

          <CardContent className="space-y-2 px-4 py-4 sm:px-5">
            <a
              href="/dashboard/users"
              className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
                  <Users className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">Manage users</p>

                  <p className="text-xs text-muted-foreground">
                    View registered users
                  </p>
                </div>
              </div>

              <ArrowUpRight className="h-4 w-4 text-muted-foreground/50" />
            </a>

            <a
              href="/dashboard/applications"
              className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/[0.08] text-teal">
                  <FileText className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Manage applications
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Review submitted applications
                  </p>
                </div>
              </div>

              <ArrowUpRight className="h-4 w-4 text-muted-foreground/50" />
            </a>
          </CardContent>
        </Card>
      </section>

      {/* Admin status */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardContent className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-sm font-medium">
              Administration status
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your Enviroshield admin dashboard is ready.
            </p>
          </div>

          <Badge
            variant="secondary"
            className="w-fit shrink-0 rounded-full"
          >
            Admin
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
