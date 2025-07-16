"use server";

import { getUserByUsername } from "../lib/utils";

export async function isUsernameTaken(username: string) {
  return !!(await getUserByUsername(username));
}
