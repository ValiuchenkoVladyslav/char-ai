import { AuthMethod, type ConfirmEmailDto, type SignInDto } from "@repo/schema";
import { eq } from "drizzle-orm";
import type { Context } from "hono";

import { Argon2, randomBase64 } from "~/lib/crypto";
import { sendEmail } from "~/lib/email";
import { db, redis } from "~/lib/storage";
import { userTbl } from "~/lib/storage/schema";
import { logErrWithFallback } from "~/lib/utils";
import type { AuthData } from "~/modules/user/lib/auth-data";
import { Session } from "~/modules/user/lib/session";

export async function handleSignInForm(ctx: Context, signInData: SignInDto) {
  const exists = await db
    .select({
      authMethod: userTbl.authMethod,
      passwordHash: userTbl.passwordHash,

      id: userTbl.id,
      name: userTbl.name,
      pfpUrl: userTbl.pfpUrl,
      tag: userTbl.tag,
    })
    .from(userTbl)
    .where(eq(userTbl.email, signInData.email))
    .then((res) => res.at(0))
    .catch(
      logErrWithFallback(
        "Failed to check for existing user",
        new Error("Unknown error!"),
      ),
    );

  if (exists instanceof Error) {
    return ctx.text(exists.message, 500);
  }

  if (!exists) {
    return ctx.text("Invalid email or password!", 400);
  }

  if (
    exists.authMethod !== AuthMethod.EmailPass &&
    exists.authMethod !== AuthMethod.Both
  ) {
    return ctx.text("Invalid email or password!", 400);
  }

  // we checked auth method above
  if (!Argon2.verify(exists.passwordHash as string, signInData.password)) {
    return ctx.text("Invalid email or password!", 400);
  }

  const token = randomBase64(6); // we use 6 byte token instead of digit-only security code
  redis.setex(
    token,
    60 * 15,
    JSON.stringify({
      email: signInData.email,
      id: exists.id,
      name: exists.name,
      pfpUrl: exists.pfpUrl,
    } satisfies AuthData),
  );

  sendEmail(
    signInData.email,
    "Sign-In Security Code",
    `<h3>Your Security Code:</h3>\n<h2>${token}</h2><br/><p>Ignore this email if it wasn't you!</p>`,
  );

  return ctx.text("OK", 200);
}

export async function signInEmailPass(
  ctx: Context,
  confirmData: ConfirmEmailDto,
) {
  const authData = await redis.getdel(confirmData.token);
  if (!authData) {
    return ctx.text("Invalid or expired confirmation code!", 400);
  }

  const parsedAuthData: AuthData = JSON.parse(authData);

  await Session.create(ctx, parsedAuthData.id);

  return ctx.json(parsedAuthData, 200);
}
