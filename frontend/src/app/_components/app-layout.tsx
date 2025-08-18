import "../_styles/main.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/shared/ui/sonner";
import { AppFooter } from "./app-footer";
import { AppHeader } from "./app-header";
import { AppMain } from "./app-main";
import { AppSidebar } from "./app-sidebar";

/**
 * required in:
 * - `app/layout.tsx`
 * - `app/global-error.tsx`
 * - `app/global-not-found.tsx`
 */
export function AppLayout(props: WithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <AppHeader />
          <div className="sm:px-2 flex-1 sm:relative flex flex-row overflow-hidden">
            <AppSidebar />

            <AppMain>{props.children}</AppMain>
          </div>
          <AppFooter />
          <Toaster richColors={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
