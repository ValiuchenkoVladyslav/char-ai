import { db, users } from "$lib/server/db";
import { eq } from "drizzle-orm";

async function getUser(id?: number) {
  if (id === undefined) return undefined;

  return db
    .select({
      id: users.id,
      displayName: users.displayName,
      username: users.username,
      email: users.email,
      pfp: users.pfp,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
    .then((rows) => rows.at(0))
    .catch((error) => {
      console.error("Error fetching user data:", error);

      return undefined;
    });
}

export function load(params) {
  return {
    user: getUser(params.locals.user),
  };
}
