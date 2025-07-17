"use server";

import { cookies } from "next/headers";
import { setAuthCookie } from "~/modules/auth/server";
import {
  AuthMethod,
  getUserByUsername,
  usernameSchema,
  userTable,
} from "~/modules/user/server";
import { db } from "~/shared/lib/db";
import { err, succ } from "~/shared/lib/utils";
import {
  deleteGoogleDataCookie,
  getGoogleDataToken,
  verifyGoogleDataToken,
} from "../lib/google";

export async function createUserOAuth2(_: unknown, formData: FormData) {
  const res = usernameSchema.safeParse(formData.get("username"));
  if (res.error) {
    return err(res.error.message);
  }

  const username = res.data;

  const existingUser = await getUserByUsername(username);

  if (existingUser) {
    return err("Username already exists");
  }

  const cookieStore = await cookies();

  const token = getGoogleDataToken(cookieStore);

  if (!token) {
    return err("Unknown error occurred, please try to login with Google again");
  }

  deleteGoogleDataCookie(cookieStore);

  const userInfo = await verifyGoogleDataToken(token);

  if (!userInfo) {
    return err("Unknown error occurred, please try to login with Google again");
  }

  const newUser = await db
    .insert(userTable)
    .values({
      displayName: userInfo.name,
      authMethod: AuthMethod.GoogleId,
      username,
      email: userInfo.email,
      googleId: userInfo.sub,
    })
    .returning({ id: userTable.id })
    .then((res) => res[0]);

  await setAuthCookie(cookieStore, newUser.id);
  return succ({ userId: newUser.id, email: userInfo.email, username });
}
