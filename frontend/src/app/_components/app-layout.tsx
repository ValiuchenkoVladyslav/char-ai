import "../_styles/main.css";
import { ThemeProvider } from "next-themes";

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
          {props.children}
        </ThemeProvider>
      </body>
    </html>
  );
}
