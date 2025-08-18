import { hc } from "hono/client";
import type { HonoApp } from "~/main";

export const api = hc<HonoApp>(process.env.NEXT_PUBLIC_BACKEND_ORIGIN, {
  fetch(input: URL | RequestInfo, init?: RequestInit) {
    return globalThis.fetch(input, {
      ...init,
      credentials: "include",
    });
  },
});
