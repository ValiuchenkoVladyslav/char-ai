import { db, users } from "$lib/server/db";
import { AUTH_LOAD_KEY } from "$lib/utils";
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

export function load({ locals, depends }) {
  // should be invalidated on auth changes
  // see /auth/success
  depends(AUTH_LOAD_KEY);

  return {
    user: getUser(locals.user),
  };
}
