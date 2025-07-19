"use server";

import { eq, or } from "drizzle-orm/sql";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";

import type { AuthData } from "~/modules/auth/lib/base";
import { setAuthCookie } from "~/modules/auth/lib/cookies";
import { hashPassword } from "~/modules/auth/lib/password";
import {
  type SignUpData,
  signUpSchema,
} from "~/modules/auth/lib/sign-up-schema";

import { AuthMethod, userTable } from "~/modules/user/server";

import { db, redis } from "~/shared/lib/db";
import { sendEmail } from "~/shared/lib/email";
import { decryptJWT, encryptJWT } from "~/shared/lib/jwt";
import { err, parseFormData, succ } from "~/shared/lib/utils";

/** 15 mins (60 * 15) */
const JWT_EXP_SECS = 900 as const;
const JWT_EXP_SECS_STR: `${typeof JWT_EXP_SECS}s` = `900s`;

/**
 * Handle email and password sign-up form.
 *
 * - Sends a confirmation email with a magic link.
 *
 * @param formData username, displayName, email, password
 * @param successPath path to redirect on success
 * @param confirmPath email link path. ?t= param provides JWT encoded user data
 * @returns error or redirects to `successPath`
 */
export async function handleSignUpForm(
  formData: FormData,
  successPath: string,
  confirmPath: string,
) {
  const { data, error } = parseFormData(formData, signUpSchema);

  if (error) {
    return err(error.message);
  }

  const taken = await db
    .select({ username: userTable.username, email: userTable.email })
    .from(userTable)
    .where(
      or(
        eq(userTable.email, data.email),
        eq(userTable.username, data.username),
      ),
    )
    .then((res) => res.at(0));

  if (taken) {
    return err(
      data.email === taken.email
        ? "Email already taken!"
        : "Username already taken!",
    );
  }

  const jwtEncoded = await encryptJWT(JWT_EXP_SECS_STR, JSON.stringify(data));

  const host = (await headers()).get("host");
  sendEmail(
    data.email,
    "Confirm Sign-Up",
    `
      <a href="https://${host}/${confirmPath}?t=${jwtEncoded}" target="_blank">
        Click here to Sign Up
      </a>
      <br/>
      <p>Ignore this email if it wasn't you!</p>
    `,
  );

  redirect(successPath);
}

export async function signUpEmailPass(token: string) {
  const isUsed = await redis.get<string>(token);
  if (isUsed) {
    return err("Sign-up token already used.");
  }

  const verified = await decryptJWT(token);
  if (!verified) {
    return err("Invalid sign-up token.");
  }

  // ban this token until expired so it can't be reused
  after(async () => await redis.set(token, "USED", { ex: JWT_EXP_SECS }));

  const data: SignUpData = JSON.parse(verified);

  const res = await db
    .insert(userTable)
    .values({
      displayName: data.displayName,
      username: data.username,
      email: data.email,
      passwordHash: hashPassword(data.password),
      authMethod: AuthMethod.EmailAndPassword,
    })
    .returning({ id: userTable.id })
    .then((res) => res.at(0))
    .catch(() => ({ error: "User already exists!" }));

  if (!res) {
    data.password = "[HIDDEN]";
    console.error("Failed to create user:", data);
    return err("Unknown error occurred.");
  }

  if ("error" in res) {
    return err(res.error);
  }

  await setAuthCookie(await cookies(), res.id);
  return succ({
    userId: res.id,
    username: data.username,
    email: data.email,
    pfp: null,
  } satisfies AuthData);
}
