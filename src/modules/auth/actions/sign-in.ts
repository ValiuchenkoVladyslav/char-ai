"use server";

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
import { decryptJWT, encryptJWT } from "~/shared/lib/jwt";
import { err, parseFormData, succ } from "~/shared/lib/utils";

/** 15 mins (60 * 15) */
const JWT_EXP_SECS = 900 as const;
const JWT_EXP_SECS_STR: `${typeof JWT_EXP_SECS}s` = `900s`;

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

  const jwtEncoded = await encryptJWT(
    JWT_EXP_SECS_STR,
    JSON.stringify({
      email: data.email,
      userId: selectedUser.userId,
      pfp: selectedUser.pfp,
      username: selectedUser.username,
    } satisfies AuthData),
  );

  const host = (await headers()).get("host");
  sendEmail(
    data.email,
    "Confirm Sign-In",
    `
      <a href="https://${host}/${confirmPath}?t=${jwtEncoded}" target="_blank">
        Click here to Sign In
      </a>
      <br/>
      <p>Ignore this email if it wasn't you!</p>
    `,
  );

  redirect(successPath);
}

export async function signInEmailPass(token: string) {
  const isUsed = await redis.get<string>(token);
  if (isUsed) {
    return err("Sign-in token already used.");
  }

  const verified = await decryptJWT(token);
  if (!verified) {
    return err("Invalid sign-in token.");
  }

  // ban this token until expired so it can't be reused
  after(async () => await redis.set(token, "USED", { ex: JWT_EXP_SECS }));

  const data: AuthData = JSON.parse(verified);

  await setAuthCookie(await cookies(), data.userId);
  return succ({
    userId: data.userId,
    username: data.username,
    email: data.email,
    pfp: data.pfp,
  } satisfies AuthData);
}
