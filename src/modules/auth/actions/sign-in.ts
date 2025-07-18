"use server";

import { eq } from "drizzle-orm/sql";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthData } from "~/modules/auth/lib/base";
import { verifyPassword } from "~/modules/auth/lib/password";
import { signInSchema } from "~/modules/auth/lib/sign-in-schema";

import { AuthMethod, userTable } from "~/modules/user/server";

import { db } from "~/shared/lib/db";
import { sendEmail } from "~/shared/lib/email";
import { signJWT } from "~/shared/lib/jwt";
import { err, parseFormData } from "~/shared/lib/utils";

/** 1 hour (60 * 60) */
const JWT_EXPIRY_SECS = `3600s` as const;

/**
 * Handle email and password sign-in form.
 * @param formData email, password
 * @param successPath path to redirect on success
 * @param magicLinkPath email link path. ?t= param provides JWT encoded user data
 * @returns error or redirects to `successPath`
 */
export async function handleSignInForm(
  formData: FormData,
  successPath: string,
  magicLinkPath: string,
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

  // todo make this an auth token straight up?
  const jwtEncoded = await signJWT(
    JWT_EXPIRY_SECS,
    JSON.stringify({
      email: data.email,
      userId: selectedUser.userId,
      pfp: selectedUser.pfp ?? undefined,
      username: selectedUser.username,
    } satisfies AuthData),
  );
  // TODO ban this token in redis until expired so it can't be reused

  const host = (await headers()).get("host");
  sendEmail(
    data.email,
    "Confirm Sign-In",
    `
      <a href="https://${host}/${magicLinkPath}?t=${jwtEncoded}" target="_blank">
        Click here to Sign In
      </a>
      <br/>
      <p>Ignore this email if it wasn't you!</p>
    `,
  );

  redirect(successPath);
}

export async function signInMagicLink(token: string) {
  // TODO
}
