"use server";

import { eq, or } from "drizzle-orm/sql";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthData } from "~/modules/auth/lib/base";
import { setAuthCookie } from "~/modules/auth/lib/cookies";
import { hashPassword } from "~/modules/auth/lib/password";
import {
  type SignUpData,
  signUpSchema,
} from "~/modules/auth/lib/sign-up-schema";
import { AuthMethod, userTable } from "~/modules/user/server";
import { db } from "~/shared/lib/db";
import { sendEmail } from "~/shared/lib/email";
import { signJWT, verifyJWT } from "~/shared/lib/jwt";
import { err, parseFormData, succ } from "~/shared/lib/utils";

/** 1 hour (60 * 60) */
const JWT_EXPIRY_SECS = `3600s` as const;

/**
 * Handle email and password sign-up form.
 * @param formData username, displayName, email, password
 * @param successPath path to redirect on success
 * @param magicLinkPath email link path. ?t= param provides JWT encoded user data
 * @returns error or redirects to `successPath`
 */
export async function handleSignUpForm(
  formData: FormData,
  successPath: string,
  magicLinkPath: string,
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

  const jwtEncoded = await signJWT(JWT_EXPIRY_SECS, JSON.stringify(data));

  const host = (await headers()).get("host");
  sendEmail(
    data.email,
    "Confirm Sign-Up",
    `
      <a href="https://${host}/${magicLinkPath}?t=${jwtEncoded}" target="_blank">
        Click here to Sign Up
      </a>
      <br/>
      <p>Ignore this email if it wasn't you!</p>
    `,
  );

  redirect(successPath);
}

export async function signUpEmailPass(token: string) {
  const verified = await verifyJWT(token);
  if (!verified) {
    return err("Invalid signup token.");
  }

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
    pfp: undefined,
  } satisfies AuthData);
}
