import { UserRound } from "lucide-react";

export default function EmptyUsers() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <UserRound className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-semibold">No users found</h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Try changing your search.
      </p>
    </div>
  );
}
