import {
  Bell,
  ChevronRight,
  Monitor,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { requireAuth } from "@/lib/auth-guards";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  await requireAuth();

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-10 p-6 sm:p-8 lg:p-10">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">
          Account
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Manage your account preferences and application
          settings.
        </p>
      </section>

      {/* Preferences */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
              <Monitor className="h-4 w-4" />
            </div>

            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Preferences
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Customize how your Enviroshield experience works.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-2 sm:px-7">
          <div className="flex items-center justify-between gap-6 py-5">
            <div className="flex min-w-0 items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Bell className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Notifications
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Notification preferences will be available here
                  in the future.
                </p>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="shrink-0 rounded-full"
            >
              Coming soon
            </Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-6 py-5">
            <div className="flex min-w-0 items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Monitor className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Appearance
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Theme and appearance preferences will be
                  available here.
                </p>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="shrink-0 rounded-full"
            >
              Coming soon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/[0.08] text-teal">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Security
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage your password and account security.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-2 sm:px-7">
          <div className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="text-sm font-medium">
                Password & security
              </p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Change your password and manage your account
                security from your profile.
              </p>
            </div>

            <Button
              variant="ghost"
              className="shrink-0 rounded-full"
            >
              <a href="/dashboard/profile">
                Manage
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="text-sm font-medium">
                Active sessions
              </p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Session management will be available here in
                the future.
              </p>
            </div>

            <Badge
              variant="secondary"
              className="shrink-0 rounded-full"
            >
              Coming soon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="rounded-2xl border-destructive/20 bg-background shadow-none">
        <CardHeader className="border-b border-destructive/10 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/5 text-destructive">
              <Trash2 className="h-4 w-4" />
            </div>

            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Danger zone
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Permanent account actions.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center sm:px-7">
          <div>
            <p className="text-sm font-medium">
              Delete account
            </p>

            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Permanently delete your Enviroshield account and
              associated data. This functionality is not
              available yet.
            </p>
          </div>

          <Button
            variant="outline"
            disabled
            className="shrink-0 rounded-full border-destructive/20 text-destructive"
          >
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}