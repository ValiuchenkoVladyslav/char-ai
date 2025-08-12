import "../_styles/main.css";
import { ThemeProvider } from "next-themes";
import { TheFooter } from "@/widgets/TheFooter";
import { TheHeader } from "@/widgets/TheHeader";

/**
 * required in:
 * - `app/layout.tsx`
 * - `app/global-error.tsx`
 * - `app/global-not-found.tsx`
 */
export function AppLayout(props: WithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          <TheHeader />
          <main>
            {props.children}
            <TheFooter />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
