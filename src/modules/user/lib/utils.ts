import "server-only";

import { eq } from "drizzle-orm/sql";
import { db } from "~/shared/lib/db";
import { userTable } from "./table";

export async function createUser(data: typeof userTable.$inferInsert) {
  return db
    .insert(userTable)
    .values(data)
    .returning({ id: userTable.id })
    .then((res) => res[0]);
}

export async function getUserByUsername(username: string) {
  return db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username))
    .then((res) => res.at(0));
}

export async function getUserByEmail(email: string) {
  return db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .then((res) => res.at(0));
}
