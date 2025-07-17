"use server";

import { cookies } from "next/headers";
import { AuthMethod, userTable } from "~/modules/user/server";
import { db } from "~/shared/lib/db";
import { verifyJWT } from "~/shared/lib/jwt";
import { err, succ } from "~/shared/lib/utils";
import type { AuthData } from "../lib/base";
import { setAuthCookie } from "../lib/cookies";
import { hashPassword } from "../lib/password";
import type { SignUpData } from "../lib/sign-up-schema";

export async function createUserEmailPass(token: string) {
  const verified = await verifyJWT(token);
  if (!verified || !verified.payload.sub) {
    return err("Invalid signup token.");
  }

  const data: SignUpData = JSON.parse(verified.payload.sub);

  const res = await db
    .insert(userTable)
    .values({
      displayName: data.displayName,
      username: data.username,
      email: data.email,
      passwordHash: hashPassword(data.password),
      authMethod: AuthMethod.EmailAndPassword,
    })
    .returning({ id: userTable.id })
    .then((res) => res.at(0))
    .catch(() => ({ error: "User already exists!" }));

  if (!res) {
    data.password = "[HIDDEN]";
    console.error("Failed to create user:", data);
    return err("Unknown error occurred.");
  }

  if ("error" in res) {
    return err(res.error);
  }

  await setAuthCookie(await cookies(), res.id);
  return succ({
    userId: res.id,
    username: data.username,
    email: data.email,
    pfp: undefined,
  } satisfies AuthData);
}
