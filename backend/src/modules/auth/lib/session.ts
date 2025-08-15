import { and, eq } from "drizzle-orm/sql";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { hmac, randomBytesB64 } from "~/lib/crypto";
import { db } from "~/lib/db";
import { sessionTbl } from "~/lib/db/schema";
import { isId, logErrWithFallback } from "~/lib/utils";

namespace AuthToken {
  export function create(userId: number) {
    return `${userId}-${randomBytesB64(16)}`;
  }

  export function getUserId(token: string) {
    const idx = token.indexOf("-");

    if (idx === -1) {
      return null;
    }

    const userId = Number(token.substring(0, idx));

    if (!isId(userId)) {
      return null;
    }

    return userId;
  }

  export function hash(token: string) {
    return hmac(token).toString("base64");
  }
}

namespace AuthCookie {
  const COOKIE_NAME = "Authorization";
  const COOKIE_PATH = "/";

  export function get(ctx: Context) {
    const token = getCookie(ctx, COOKIE_NAME);

    if (!token) {
      return null;
    }

    const userId = AuthToken.getUserId(token);

    if (!userId) {
      return null;
    }

    return { userId, token };
  }

  export function set(ctx: Context, token: string, expiresAt: Date) {
    setCookie(ctx, COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: COOKIE_PATH,
    });
  }

  export function del(ctx: Context) {
    return deleteCookie(ctx, COOKIE_NAME, { path: COOKIE_PATH });
  }
}

export namespace Session {
  const SESSION_EXPIRES_AFTER_MONTHS = 2;

  /** @returns user id or validation error */
  export async function validate(ctx: Context) {
    const tokenRes = AuthCookie.get(ctx);

    if (!tokenRes) {
      return new Error("Invalid session!");
    }

    const { userId, token } = tokenRes;

    const res = await db
      .select({ expiresAt: sessionTbl.expiresAt })
      .from(sessionTbl)
      .where(
        and(
          eq(sessionTbl.tokenHash, AuthToken.hash(token)),
          eq(sessionTbl.userId, userId),
        ),
      )
      .then((res) => res.at(0))
      .catch(
        logErrWithFallback(
          "Failed to get session!",
          new Error("Unknown error occured!"),
        ),
      );

    if (res instanceof Error) {
      return res;
    }

    if (!res || res.expiresAt.getTime() < Date.now()) {
      return new Error("Invalid or expired session!");
    }

    return userId;
  }

  /** creates a session in db and sets `Authorization` cookie */
  export async function create(ctx: Context, userId: number) {
    if (!isId(userId)) {
      return new Error("Invalid user ID");
    }

    const expiresAt = new Date();
    expiresAt.setMonth(new Date().getMonth() + SESSION_EXPIRES_AFTER_MONTHS);

    const token = AuthToken.create(userId);
    AuthCookie.set(ctx, token, expiresAt);

    return db
      .insert(sessionTbl)
      .values({
        userId,
        tokenHash: AuthToken.hash(token),
        expiresAt,
      })
      .then((res) => res.at(0))
      .catch(
        logErrWithFallback(
          "Failed to create session",
          new Error("Failed to create session!"),
        ),
      );
  }

  /** delete auth cookie & remove session from db */
  export async function del(ctx: Context) {
    const tokenRes = AuthCookie.get(ctx);

    if (!tokenRes) {
      return new Error("Invalid session!");
    }

    const { token, userId } = tokenRes;

    AuthCookie.del(ctx);

    return db
      .delete(sessionTbl)
      .where(
        and(
          eq(sessionTbl.tokenHash, AuthToken.hash(token)),
          eq(sessionTbl.userId, userId),
        ),
      )
      .then((res) => res.at(0))
      .catch(
        logErrWithFallback(
          "Failed to delete session",
          new Error("Failed to delete session!"),
        ),
      );
  }
}
