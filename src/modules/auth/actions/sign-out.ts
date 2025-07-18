"use server";

import { cookies } from "next/headers";
import { deleteAuthCookie } from "~/modules/auth/lib/cookies";

export async function signOut() {
  const cookieStore = await cookies();
  deleteAuthCookie(cookieStore);
}
