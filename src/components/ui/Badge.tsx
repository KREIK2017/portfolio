import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variant === "accent"
          ? "border-accent/40 text-accent bg-accent/10"
          : "border-border text-muted bg-surface",
        className,
      )}
    >
      {children}
    </span>
  );
}
