import { clsx } from "clsx";
import type React from "react";

type IDividerProps = {
  children?: React.ReactNode;
  className?: string;
};
export function Divider({ children, className }: IDividerProps) {
  return (
    <div
      className={clsx(
        "w-full flex items-center text-center after:content-[''] after:flex-1 after:border after:border-neutral-700 before:content-[''] before:flex-1 before:border before:border-neutral-700",
        className,
      )}
    >
      {children}
    </div>
  );
}
