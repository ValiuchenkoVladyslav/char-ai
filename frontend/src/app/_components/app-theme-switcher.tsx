"use client";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { Button } from "@/shared/ui/button";

const themeIcon = (theme: string | undefined) => {
  switch (theme) {
    case "light":
      return <Sun suppressHydrationWarning />;
    case "dark":
      return <Moon suppressHydrationWarning />;
    default:
      return <SunMoon suppressHydrationWarning />;
  }
};
export const AppThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const setThemeHandler = useCallback(
    (theme: string | undefined) => {
      switch (theme) {
        case "light":
          setTheme("dark");
          break;
        case "dark":
          setTheme("system");
          break;
        default:
          setTheme("light");
          break;
      }
    },
    [setTheme],
  );

  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      type="button"
      suppressHydrationWarning
      onClick={() => setThemeHandler(theme)}
    >
      {themeIcon(theme)}
    </Button>
  );
};
