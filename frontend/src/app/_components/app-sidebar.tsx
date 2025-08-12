"use client";
import { clsx } from "clsx";
import { Cross, Menu, X } from "lucide-react";
import { memo, useEffect } from "react";
import { create } from "zustand";
import { Button } from "@/shared/ui/button";

type SideBarStore = {
  isOpen: boolean;
  toggleIsOpen: () => void;
};
export const useSidebarStore = create<SideBarStore>((set) => ({
  isOpen: false,
  toggleIsOpen: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
}));

export const AppSideBarButton = memo(() => {
  const { toggleIsOpen } = useSidebarStore();
  return (
    <Button
      onClick={toggleIsOpen}
      variant="ghost"
      className="px-2! h-max cursor-pointer"
    >
      <Menu />
    </Button>
  );
});

export const AppSidebar = () => {
  const { isOpen, toggleIsOpen } = useSidebarStore();

  return (
    <div
      className={clsx(
        "absolute top-0 left-0 bottom-0 flex flex-col w-full bg-background transform duration-500 overflow-y-auto sm:w-80",
        isOpen && "translate-x-0",
        !isOpen && "-translate-x-full sm:-translate-x-82",
      )}
    >
      <div className="flex justify-end sm:hidden">
        <Button variant="ghost" onClick={toggleIsOpen}>
          <X />
        </Button>
      </div>
      <Button variant="outline">New chat</Button>
      <span>test 1 </span>
      <span>test 2</span>
    </div>
  );
};
