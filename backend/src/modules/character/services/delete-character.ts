import { and, eq } from "drizzle-orm/sql";
import type { Context } from "hono";

import { db } from "~/lib/db";
import { characterTbl } from "~/lib/db/schema";

export async function deleteCharacter(
  ctx: Context,
  userId: number,
  id: number,
) {
  const deletionRes = await db
    .delete(characterTbl)
    .where(and(eq(characterTbl.creatorId, userId), eq(characterTbl.id, id)))
    .returning()
    .then((res) => res.at(0))
    .catch((err) => {
      console.error(err);

      return new Error("Failed to delete character!");
    });

  if (deletionRes instanceof Error) {
    return ctx.text(deletionRes.message, 500);
  }

  if (deletionRes === undefined) {
    return ctx.text("Character not found!", 404);
  }

  return ctx.json(deletionRes, 200);
}
