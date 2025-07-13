"use client";

import { MoonStar, Sun } from "lucide-react";
import { MenuBtn } from "~/components/menu";

function switchTheme() {
  const theme = localStorage.getItem("theme") ?? "dark";
  const newTheme = theme === "dark" ? "light" : "dark";

  if (newTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  localStorage.setItem("theme", newTheme);
}

export function ThemeSwitch() {
  return (
    <MenuBtn onClick={switchTheme}>
      <MoonStar className="not-dark:hidden w-5" />
      <Sun className="dark:hidden w-5" />

      <h4>Theme</h4>
    </MenuBtn>
  );
}
