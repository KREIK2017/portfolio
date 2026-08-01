import { cn } from "@/lib/utils";

/** Єдине місце, що задає максимальну ширину й бічні відступи сторінки. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
