import "../_styles/main.css";
import { ThemeProvider } from "next-themes";
import AppMain from "@/app/_components/app-main";
import { AppSidebar } from "@/app/_components/app-sidebar";
import { AppHeader } from "./app-header";

/**
 * required in:
 * - `app/layout.tsx`
 * - `app/global-error.tsx`
 * - `app/global-not-found.tsx`
 */
export function AppLayout(props: WithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <AppHeader />
          <main className="container-custom flex-1 sm:relative flex flex-row overflow-hidden">
            <AppSidebar />
            <AppMain>{props.children}</AppMain>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
