"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm/sql";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import type { AuthData } from "~/modules/auth/lib/base";

import { hashPassword } from "~/modules/auth/lib/password";
import { emailSchema, passwordSchema, userTable } from "~/modules/user/server";
import { db, redis } from "~/shared/lib/db";
import { sendEmail } from "~/shared/lib/email";
import { err, succ } from "~/shared/lib/utils";

export async function passwordResetRequest(
  formData: FormData,
  successPath: string,
  resetPath: string,
) {
  const res = emailSchema.safeParse(formData.get("email"));
  if (res.error) {
    return err(res.error.message);
  }

  const email = res.data;

  const existingUser = await db
    .update(userTable)
    .set({ passwordHash: hashPassword(res.data) })
    .where(eq(userTable.email, email))
    .returning({
      userId: userTable.id,
      email: userTable.email,
      username: userTable.username,
      pfp: userTable.pfp,
    })
    .then((res) => res.at(0));

  if (!existingUser) {
    return err("User not found");
  }

  const token = randomBytes(24).toString("base64url");
  const str = JSON.stringify(existingUser satisfies AuthData);

  after(async () => await redis.set(token, str, { ex: 60 * 15 }));

  const host = (await headers()).get("host");
  sendEmail(
    email,
    "Password Reset Request",
    `
      <a href="https://${host}/${resetPath}?t=${token}" target="_blank">
        Click here to Reset Password
      </a>
      <br/>
      <p>Ignore this email if it wasn't you!</p>
    `,
  );

  redirect(successPath);
}

export async function resetPassword(formData: FormData, token: string) {
  const userData = await redis.getdel<string>(token);
  if (!userData) {
    return err("Invalid or expired token");
  }

  const parsed: AuthData = JSON.parse(userData);

  const res = passwordSchema.safeParse(formData.get("password"));
  if (res.error) {
    return err(res.error.message);
  }

  await db
    .update(userTable)
    .set({ passwordHash: hashPassword(res.data) })
    .where(eq(userTable.id, parsed.userId))
    .returning({ userId: userTable.id });

  return succ(parsed satisfies AuthData);
}
