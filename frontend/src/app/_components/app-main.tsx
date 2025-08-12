"use client";
import clsx from "clsx";
import type React from "react";
import { AppFooter } from "@/app/_components/app-footer";
import { useSidebarStore } from "@/app/_components/app-sidebar";

interface IMainProps {
  children?: React.ReactNode;
}
const AppMain = ({ children }: IMainProps) => {
  const { isOpen } = useSidebarStore();
  return (
    <div
      className={clsx(
        "w-full border-neutral-800 border-2 bg-neutral-900 p-2 duration-500 sm:w-auto sm:absolute sm:left-0 sm:top-0 sm:bottom-0 sm:right-0 sm:rounded-md overflow-y-auto",
        isOpen && "sm:left-82",
      )}
    >
      {children}
      <AppFooter />
    </div>
  );
};

export default AppMain;
