import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-border" />;
}

export function ToolbarButton({
  children,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-8 w-8 rounded-md",
        active && "bg-blue/10 text-blue hover:bg-blue/15 hover:text-blue",
      )}
    >
      {children}
    </Button>
  );
}

export function ToolbarSmallButton({
  label,
  active = false,
  destructive = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-7 px-2 text-xs",
        active && "border-primary bg-primary/10 text-primary",
        destructive &&
          "border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive",
      )}
    >
      {label}
    </Button>
  );
}
