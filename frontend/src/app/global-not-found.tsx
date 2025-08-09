import type { Metadata } from "next";

import { AppLayout } from "./_components/app-layout";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <AppLayout>
      <h1>404 - Page Not Found</h1>
      <p>This page does not exist.</p>
    </AppLayout>
  );
}
