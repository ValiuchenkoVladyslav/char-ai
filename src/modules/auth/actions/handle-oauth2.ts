"use server";

import { eq } from "drizzle-orm/sql";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { type AuthData, setAuthCookie } from "~/modules/auth/server";
import { AuthMethod, getUserByEmail, userTable } from "~/modules/user/server";

import { db } from "~/shared/lib/db";
import { type ApiResponse, err, succ } from "~/shared/lib/utils";

import { type GoogleUserInfo, setGoogleDataCookie } from "../lib/google";

export async function handleOauth2(
  token: string,
): Promise<ApiResponse<AuthData, null> | ApiResponse<null, string>> {
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

  const existingUser = await getUserByEmail(userInfo.email);

  const cookieStore = await cookies();

  if (!existingUser) {
    await setGoogleDataCookie(cookieStore, userInfo);
    redirect("/google");
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
