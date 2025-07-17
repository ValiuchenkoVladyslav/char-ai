"use server";

import { getUserByUsername } from "../lib/utils";

export async function isUsernameTaken(username: string) {
  const trimmed = username.trim();
  return !!(await getUserByUsername(
    trimmed.at(0) === "@" ? trimmed.slice(1) : trimmed,
  ));
}
