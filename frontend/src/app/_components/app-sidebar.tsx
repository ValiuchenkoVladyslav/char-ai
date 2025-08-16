"use client";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { create } from "zustand";
import { Button } from "@/shared/ui/button";

interface SidebarStore {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  toggleOpen: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
}));

export const AppSidebarButton = () => {
  const { isOpen, toggleOpen } = useSidebarStore();

  return (
    <Button
      onClick={toggleOpen}
      variant="ghost"
      className="cursor-pointer"
      aria-controls="app-sidebar"
      aria-expanded={isOpen}
      aria-label="Toggle sidebar"
      title="Toggle sidebar"
    >
      <Menu aria-hidden="true" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
};

export const AppSidebar = () => {
  const { isOpen, toggleOpen } = useSidebarStore();

  return (
    <aside
      id="app-sidebar"
      aria-label="Sidebar"
      className={clsx(
        "absolute top-0 left-0 right-0 bottom-2 flex flex-col w-full bg-background transition-transform duration-500 overflow-y-auto not-sm:px-3 not-sm:py-2 sm:w-80 sm:left-3",
        isOpen ? "translate-x-0" : "-translate-x-full sm:-translate-x-85",
      )}
    >
      <div className="flex justify-end sm:hidden">
        <Button
          variant="ghost"
          onClick={toggleOpen}
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <X aria-hidden="true" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <Button variant="outline">New chat</Button>
      <span>test 1 </span>
      <span>test 2</span>
    </aside>
  );
};
