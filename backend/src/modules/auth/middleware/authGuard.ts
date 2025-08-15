import { and, eq } from "drizzle-orm/sql";
import { createMiddleware } from "hono/factory";
import { db } from "~/lib/db";
import { sessionTbl } from "~/lib/db/schema";
import { logErrWithFallback } from "~/lib/utils";
import { AuthCookie } from "../lib/auth-cookie";
import { AuthToken } from "../lib/auth-token";

interface AuthEnv {
  Variables: {
    userId: number;
  };
}

export const authGuard = createMiddleware<AuthEnv>(async (ctx, next) => {
  const token = AuthCookie.get(ctx);

  if (!token) {
    return ctx.text("Unauthorized", 401);
  }

  const userId = AuthToken.getUserId(token);

  if (!userId) {
    return ctx.text("Unauthorized", 401);
  }

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
    return ctx.text(res.message, 500);
  }

  if (!res || res.expiresAt.getTime() < Date.now()) {
    return ctx.text("Unauthorized", 401);
  }

  ctx.set("userId", userId);

  await next();
});
