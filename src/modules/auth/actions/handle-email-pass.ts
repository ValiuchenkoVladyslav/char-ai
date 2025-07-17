"use server";

import { eq, or } from "drizzle-orm/sql";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signUpSchema } from "~/modules/auth/lib/sign-up-schema";
import { userTable } from "~/modules/user/server";
import { db } from "~/shared/lib/db";
import { sendEmail } from "~/shared/lib/email";
import { signJWT } from "~/shared/lib/jwt";
import { err, parseFormData } from "~/shared/lib/utils";

/** 1 hour (60 * 60) */
const JWT_EXPIRY_SECS = `3600s` as const;

/**
 * Handle email and password sign-up.
 * @param formData username, displayName, email, password
 * @param successPath path to redirect on success
 * @param magicLinkPath email link path. ?t= param provides JWT encoded user data
 * @returns error or redirects to successPath
 */
export async function handleEmailPass(
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
