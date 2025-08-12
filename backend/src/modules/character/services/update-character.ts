import type { updateCharacterDto } from "@repo/schema";
import { and, eq } from "drizzle-orm/sql";
import type { Context } from "hono";
import type { infer as z_infer } from "zod/v4";

import { db } from "~/lib/db";
import { characterTbl } from "~/lib/db/schema";
import { logErrWithFallback } from "~/lib/utils";

import { CharacterImage } from "../lib/character-image";

export async function updateCharacter(
  ctx: Context,
  userId: number,
  characterId: number,
  data: z_infer<typeof updateCharacterDto>,
) {
  // check if exists
  const existing = await db
    .select({
      oldPfp: characterTbl.pfpUrl,
      oldCover: characterTbl.coverImageUrl,
    })
    .from(characterTbl)
    .where(
      and(eq(characterTbl.creatorId, userId), eq(characterTbl.id, characterId)),
    )
    .then((res) => res.at(0))
    .catch(
      logErrWithFallback(
        "Failed to select character!",
        new Error("Unknown error occured!"),
      ),
    );

  if (existing instanceof Error) {
    return ctx.text(existing.message, 500);
  }

  if (existing === undefined) {
    return ctx.text("Character not found!", 404);
  }

  // upload new images
  let newPfpUrl: string | undefined;
  if (data.pfp) {
    const pfpUrl = await CharacterImage.uploadPfp(data.pfp, userId);

    if (pfpUrl instanceof Error) {
      return ctx.text("Failed to process character pfp!", 500);
    }

    newPfpUrl = pfpUrl;
  }

  let newCoverImageUrl: string | undefined;
  if (data.coverImage) {
    const coverUrl = await CharacterImage.uploadCoverImage(
      data.coverImage,
      userId,
    );
    if (coverUrl instanceof Error) {
      return ctx.text("Failed to process character cover image!", 500);
    }

    newCoverImageUrl = coverUrl;
  }

  // update in db
  const res = await db
    .update(characterTbl)
    .set({
      name: data.name,
      description: data.description,
      prompt: data.prompt,

      pfpUrl: newPfpUrl,
      coverImageUrl: newCoverImageUrl,
    })
    .where(
      and(eq(characterTbl.creatorId, userId), eq(characterTbl.id, characterId)),
    )
    .returning()
    .then((res) => res.at(0))
    .catch(logErrWithFallback("Failed to update character!", undefined));

  if (res === undefined) {
    // remove new images if insertion failed
    const toRemove: string[] = [];
    if (typeof newPfpUrl === "string") toRemove.push(newPfpUrl);
    if (typeof newCoverImageUrl === "string") toRemove.push(newCoverImageUrl);

    if (toRemove.length) {
      CharacterImage.remove(toRemove).catch((err) =>
        console.error("Failed to remove images after failed insertion", err),
      );
    }

    return ctx.text("Failed to update character!", 500);
  }

  // delete replaced images without waiting
  const toRemove: string[] = [];
  if (newPfpUrl !== undefined) toRemove.push(existing.oldPfp);
  if (newCoverImageUrl !== undefined) toRemove.push(existing.oldCover);
  if (toRemove.length)
    CharacterImage.remove(toRemove).then((res) => {
      if (res.error) {
        console.error("Failed to delete character images:", res.error);
      }
    });

  return ctx.json(res, 200);
}
