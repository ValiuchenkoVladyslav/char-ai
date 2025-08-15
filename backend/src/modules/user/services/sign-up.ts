import { AuthMethod, type SignUpDto } from "@repo/schema";
import { eq, or } from "drizzle-orm/sql";
import type { Context } from "hono";
import { Argon2, randomBytesB64 } from "~/lib/crypto";
import { db, redis } from "~/lib/db";
import { userTbl } from "~/lib/db/schema";
import { sendEmail } from "~/lib/email";
import { logErrWithFallback } from "~/lib/utils";

import { Session } from "~/modules/auth/lib/session";

export async function handleSignUpForm(ctx: Context, signUpData: SignUpDto) {
  const taken = await db
    .select({ tag: userTbl.tag, email: userTbl.email })
    .from(userTbl)
    .where(
      or(eq(userTbl.email, signUpData.email), eq(userTbl.tag, signUpData.tag)),
    )
    .then((res) => res.at(0))
    .catch(
      logErrWithFallback(
        "Failed to check for existing user",
        new Error("Unknown error!"),
      ),
    );

  if (taken instanceof Error) {
    return ctx.text(taken.message, 500);
  }

  if (taken) {
    return ctx.text(
      signUpData.email === taken.email
        ? "Email already taken!"
        : "Username already taken!",
      400,
    );
  }

  signUpData.password = Argon2.hash(signUpData.password);

  const token = randomBytesB64(6); // we use 6 byte token instead of digit-only security code
  redis.setex(token, 60 * 15, JSON.stringify(signUpData));

  sendEmail(
    signUpData.email,
    "Sign-Up Security Code",
    `<h3>Your Security Code:</h3>\n<h2>${token}</h2><br/><p>Ignore this email if it wasn't you!</p>`,
  );

  return ctx.text("OK", 200);
}

export async function signUpEmailPass(ctx: Context, token: string) {
  const userData = await redis.getdel(token);
  if (!userData) {
    return ctx.text("Invalid or expired confirmation code!", 400);
  }

  const data: SignUpDto = JSON.parse(userData);

  const res = await db
    .insert(userTbl)
    .values({
      tag: data.tag,
      name: data.name,
      email: data.email,
      passwordHash: data.password, // already hashed
      authMethod: AuthMethod.EmailPass,
    })
    .returning({ id: userTbl.id })
    .then((res) => res.at(0))
    .catch(logErrWithFallback("Failed to create user", undefined));

  if (!res) {
    return ctx.text("Unknown error occurred!", 500);
  }

  await Session.create(ctx, res.id);

  return ctx.json(
    {
      userId: res.id,
      name: data.name,
      email: data.email,
      pfp: null,
    },
    201,
  );
}
