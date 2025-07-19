"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm/sql";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";

import type { AuthData } from "~/modules/auth/lib/base";
import { setAuthCookie } from "~/modules/auth/lib/cookies";
import { verifyPassword } from "~/modules/auth/lib/password";
import { signInSchema } from "~/modules/auth/lib/sign-in-schema";

import { AuthMethod, userTable } from "~/modules/user/server";

import { db, redis } from "~/shared/lib/db";
import { sendEmail } from "~/shared/lib/email";
import { err, parseFormData, succ } from "~/shared/lib/utils";

/**
 * Handle email and password sign-in form.
 *
 * - Sends a confirmation email with a magic link.
 *
 * @param formData email, password
 * @param successPath path to redirect on success
 * @param confirmPath email link path. ?t= param provides JWT encoded user data
 * @returns error or redirects to `successPath`
 */
export async function handleSignInForm(
  formData: FormData,
  successPath: string,
  confirmPath: string,
) {
  const { data, error } = parseFormData(formData, signInSchema);

  if (error) {
    return err(error.message);
  }

  const selectedUser = await db
    .select({
      userId: userTable.id,
      pfp: userTable.pfp,
      username: userTable.username,
      passwordHash: userTable.passwordHash,
      authMethod: userTable.authMethod,
    })
    .from(userTable)
    .where(eq(userTable.email, data.email))
    .then((res) => res.at(0));

  if (!selectedUser || selectedUser.authMethod === AuthMethod.GoogleId) {
    return err("Invalid email or password.");
  }

  // biome-ignore lint/style/noNonNullAssertion: we checked authMethod above
  const res = verifyPassword(data.password, selectedUser.passwordHash!);

  if (!res) {
    return err("Invalid email or password.");
  }

  const token = randomBytes(24).toString("base64url");
  const str = JSON.stringify({
    userId: selectedUser.userId,
    email: data.email,
    pfp: selectedUser.pfp,
    username: selectedUser.username,
  } satisfies AuthData);

  after(async () => await redis.set(token, str, { ex: 60 * 15 }));

  const host = (await headers()).get("host");
  sendEmail(
    data.email,
    "Confirm Sign-In",
    `
      <a href="https://${host}/${confirmPath}?t=${token}" target="_blank">
        Click here to Sign In
      </a>
      <br/>
      <p>Ignore this email if it wasn't you!</p>
    `,
  );

  redirect(successPath);
}

export async function signInEmailPass(token: string) {
  const userData = await redis.getdel<string>(token);
  if (!userData) {
    return err("Invalid or expired token");
  }

  let parsed: AuthData;
  try {
    parsed = JSON.parse(userData);
  } catch (error) {
    console.error("Failed to parse auth data from Redis:", error);
    return err("Invalid token data");
  }

  await setAuthCookie(await cookies(), parsed.userId);
  return succ(parsed);
}
