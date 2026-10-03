import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type DashboardButtonProps = {
  children?: ReactNode;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link"
    | null
    | undefined;
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
};

export default function DashboardButton({
  children,
  variant = "default",
  icon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ariaLabel = "",
}: DashboardButtonProps) {
  return (
    <Button
      variant={variant}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        className
          ? className
          : "group min-h-12 rounded-4xl bg-blue px-5 text-[13px] font-bold tracking-[0.01em] text-white shadow-[0_4px_14px_rgba(1,110,220,0.22)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:shadow-[0_6px_18px_rgba(1,110,220,0.28)]",
      )}
      aria-label={ariaLabel}
    >
      {icon && (
        <span className="flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}

      {children}
    </Button>
  );
}
