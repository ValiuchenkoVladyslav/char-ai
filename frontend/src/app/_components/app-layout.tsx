import "../_styles/main.css";

/**
 * required in:
 * - `app/layout.tsx`
 * - `app/global-error.tsx`
 * - `app/global-not-found.tsx`
 */
export function AppLayout(props: WithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{props.children}</body>
    </html>
  );
}
