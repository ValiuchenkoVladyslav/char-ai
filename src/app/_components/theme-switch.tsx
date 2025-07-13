"use client";

import { MoonStar, Sun } from "lucide-react";

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
    <button
      type="button"
      className="rounded-lg p-1.5 duration-200 hover:bg-active"
      onClick={switchTheme}
    >
      <MoonStar className="not-dark:hidden" />
      <Sun className="dark:hidden" />
    </button>
  );
}
