import { and, eq } from "drizzle-orm";
import type { Context } from "hono";

import { db } from "~/lib/storage";
import { characterTbl } from "~/lib/storage/schema";
import { logErrWithFallback } from "~/lib/utils";

import { CharacterImage } from "../lib/character-image";

export async function deleteCharacter(
  ctx: Context,
  userId: number,
  id: number,
) {
  // delete row
  const deletionRes = await db
    .delete(characterTbl)
    .where(and(eq(characterTbl.creatorId, userId), eq(characterTbl.id, id)))
    .returning()
    .then((res) => res.at(0))
    .catch(
      logErrWithFallback(
        "Failed to delete character!",
        new Error("Failed to delete character!"),
      ),
    );

  if (deletionRes instanceof Error) {
    return ctx.text(deletionRes.message, 500);
  }

  if (deletionRes === undefined) {
    return ctx.text("Character not found!", 404);
  }

  // delete images without waiting
  CharacterImage.remove([deletionRes.pfpUrl, deletionRes.coverImageUrl]).then(
    (res) => {
      if (res.error) {
        console.error("Failed to delete character images:", res.error);
      }
    },
  );

  return ctx.json(deletionRes, 200);
}
