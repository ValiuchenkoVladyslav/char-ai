"use server";

import { cookies } from "next/headers";
import { deleteAuthCookie } from "../lib/cookies";

export async function signOut() {
  const cookieStore = await cookies();
  deleteAuthCookie(cookieStore);
}
