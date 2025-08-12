import "../_styles/main.css";
import { ThemeProvider } from "next-themes";
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
      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <AppHeader />
          <main className="sm:px-2 flex-1 sm:relative flex flex-row overflow-hidden">
            <AppSidebar />
            <AppMain>{props.children}</AppMain>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
