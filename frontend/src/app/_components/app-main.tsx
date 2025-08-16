"use client";
import clsx from "clsx";
import { useSidebarStore } from "./app-sidebar";

export const AppMain = ({ children }: WithChildren) => {
  const isOpen = useSidebarStore((s) => s.isOpen);

  return (
    <main
      className={clsx(
        "w-full border-2 bg-card p-2 transition-[left] duration-500 sm:w-auto sm:absolute sm:left-3 sm:top-0 sm:bottom-3 sm:right-3 sm:rounded-md overflow-y-auto",
        isOpen && "sm:left-85",
      )}
    >
      {children}
    </main>
  );
};
