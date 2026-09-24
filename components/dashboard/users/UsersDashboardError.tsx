"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface UsersDashboardErrorProps {
  fetchUsers: () => Promise<void>;
}

export default function UsersDashboardError({
  fetchUsers,
}: UsersDashboardErrorProps) {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Administration
        </p>

        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
          Users
        </h1>
      </div>

      <Card>
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <p className="font-semibold">
            Unable to load users
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while loading the user list.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-5 rounded-full"
            onClick={() => void fetchUsers()}
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}