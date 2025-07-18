"use server";

import { eq } from "drizzle-orm/sql";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { setAuthCookie } from "~/modules/auth/lib/cookies";

import {
  deleteGoogleDataCookie,
  type GoogleUserInfo,
  getGoogleDataToken,
  setGoogleDataCookie,
  verifyGoogleDataToken,
} from "~/modules/auth/lib/google";
import {
  AuthMethod,
  getUserByEmail,
  getUserByUsername,
  usernameSchema,
  userTable,
} from "~/modules/user/server";

import { db } from "~/shared/lib/db";
import { err, succ } from "~/shared/lib/utils";

/** handle google oauth2 token. if user does not exist, redirect to `usernameRequestPath` */
export async function handleOauth2(token: string, usernameRequestPath: string) {
  let userInfoRes: Response;
  try {
    userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    console.error("Error fetching user info from Google:", e);
    return err("Unknown error occurred");
  }

  if (!userInfoRes.ok) {
    return err("Invalid data");
  }

  let userInfo: GoogleUserInfo;
  try {
    userInfo = await userInfoRes.json();
  } catch (e) {
    console.error("Error parsing user info response:", e);
    return err("Unknown error occurred");
  }

  if (!userInfo.email_verified) {
    return err("Choose a verified email");
  }

  const [existingUser, cookieStore] = await Promise.all([
    getUserByEmail(userInfo.email),
    cookies(),
  ]);

  if (!existingUser) {
    await setGoogleDataCookie(cookieStore, userInfo);
    redirect(usernameRequestPath);
  }

  if (existingUser.authMethod === AuthMethod.EmailAndPassword) {
    after(async () => {
      await db
        .update(userTable)
        .set({ authMethod: AuthMethod.Both, googleId: userInfo.sub })
        .where(eq(userTable.id, existingUser.id))
        .returning({ id: userTable.id });
    });

    await setAuthCookie(cookieStore, existingUser.id);
    return succ({
      userId: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    });
  }

  await setAuthCookie(cookieStore, existingUser.id);
  return succ({
    userId: existingUser.id,
    email: existingUser.email,
    username: existingUser.username,
  });
}

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
