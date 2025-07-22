"use server";

import { eq } from "drizzle-orm/sql";

import { cookies } from "next/headers";

import type { AuthData } from "~/modules/auth/lib/base";
import { verifyToken } from "~/modules/auth/lib/cookies";

import { userTable } from "~/modules/user/server";

import { db } from "~/shared/lib/db";

export async function getMe(): Promise<AuthData | null> {
  const cookieStore = await cookies();

  const userId = await verifyToken(cookieStore);
  if (!userId) return null;

  const auth = await db
    .select({
      username: userTable.username,
      email: userTable.email,
      pfp: userTable.pfp,
    })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .then((res) => res.at(0));

  if (!auth) return null;

  return {
    userId,
    username: auth.username,
    email: auth.email,
    pfp: auth.pfp,
  };
}
