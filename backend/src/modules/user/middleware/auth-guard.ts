import { createMiddleware } from "hono/factory";

import { Session } from "../lib/session";

interface AuthEnv {
  Variables: {
    userId: number;
  };
}

export const authGuard = createMiddleware<AuthEnv>(async (ctx, next) => {
  const res = await Session.validate(ctx);

  if (res instanceof Error) {
    return ctx.text(res.message, 401);
  }

  ctx.set("userId", res);

  await next();
});
