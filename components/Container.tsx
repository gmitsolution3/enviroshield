import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-[calc(100%_-_48px)] max-w-[1200px]",
        "max-[900px]:w-[min(calc(100%_-_40px),680px)]",
        "max-[600px]:w-[calc(100%_-_32px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
