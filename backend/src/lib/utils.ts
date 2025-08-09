import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function ok<D>(ctx: Context, data?: D, status?: ContentfulStatusCode) {
  return ctx.json({ data: data ?? null }, status ?? 200);
}

export function err<E>(ctx: Context, error: E, status?: ContentfulStatusCode) {
  return ctx.json({ error }, status ?? 400);
}
