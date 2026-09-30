import { Plus } from "lucide-react";

import { Card } from "@/components/ui/card";
import DashboardButton from "./DashboardButton";

type DashboardEmptyProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export default function DashboardEmpty({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: DashboardEmptyProps) {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {icon ?? <span className="text-2xl">📭</span>}
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold">{title}</h3>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {actionLabel && (
          <DashboardButton
            onClick={onAction}
            icon={<Plus className="h-4 w-4" />}
          >
            {actionLabel}
          </DashboardButton>
        )}
      </div>
    </Card>
  );
}
