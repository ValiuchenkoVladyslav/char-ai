"use server";

import { eq } from "drizzle-orm/sql";
import { cookies } from "next/headers";
import { userTable } from "~/modules/user/server";
import { db } from "~/shared/lib/db";
import type { AuthData } from "../lib/base";
import { getToken, verifyToken } from "../lib/cookies";

export async function getMe(): Promise<AuthData | null> {
  const cookieStore = await cookies();

  const token = getToken(cookieStore);
  if (!token) return null;

  const decoded = await verifyToken(token);
  if (!decoded) return null;

  const auth = await db
    .select({
      username: userTable.username,
      email: userTable.email,
      pfp: userTable.pfp,
    })
    .from(userTable)
    .where(eq(userTable.id, decoded.sub))
    .then((res) => res.at(0));

  if (!auth) return null;

  return {
    userId: decoded.sub,
    username: auth.username,
    email: auth.email,
    pfp: auth.pfp ?? undefined,
  };
}
