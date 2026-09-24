import { ShieldCheck, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function RoleBadge({
  role,
}: {
  role?: string;
}) {
  const isAdmin = role === "admin";

  return (
    <Badge
      variant="outline"
      className={
        isAdmin
          ? "border-violet-200 bg-violet-50 text-violet-700"
          : "border-slate-200 bg-slate-50 text-slate-700"
      }
    >
      {isAdmin ? (
        <ShieldCheck className="mr-1.5 h-3 w-3" />
      ) : (
        <UserRound className="mr-1.5 h-3 w-3" />
      )}

      {isAdmin ? "Admin" : "User"}
    </Badge>
  );
}