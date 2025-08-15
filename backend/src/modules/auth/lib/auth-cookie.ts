import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export namespace AuthCookie {
  const COOKIE_NAME = "Authorization";

  export function get(ctx: Context) {
    return getCookie(ctx, COOKIE_NAME);
  }

  export function set(ctx: Context, token: string, expiresAt: Date) {
    setCookie(ctx, COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });
  }

  export function del(ctx: Context) {
    return deleteCookie(ctx, COOKIE_NAME, { path: "/" });
  }
}
