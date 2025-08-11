import type { createCharacterDto } from "@repo/schema";
import type { Context } from "hono";
import type { infer as z_infer } from "zod/v4";

import { db } from "~/lib/db";
import { characterTbl } from "~/lib/db/schema";
import { logErrWithFallback } from "~/lib/utils";

import { CharacterImage } from "../lib/character-image";

export async function createCharacter(
  ctx: Context,
  creatorId: number,
  data: z_infer<typeof createCharacterDto>,
) {
  // upload images
  const [pfpUrl, coverImageUrl] = await Promise.all([
    CharacterImage.uploadPfp(data.pfp, creatorId),
    CharacterImage.uploadCoverImage(data.coverImage, creatorId),
  ]);

  if (pfpUrl instanceof Error) {
    return ctx.text("Failed to process character pfp!", 500);
  }

  if (coverImageUrl instanceof Error) {
    return ctx.text("Failed to process character cover image!", 500);
  }

  // insert into db
  const insertionRes = await db
    .insert(characterTbl)
    .values({
      name: data.name,
      description: data.description,
      prompt: data.prompt,

      pfpUrl,
      coverImageUrl,

      creatorId,
    })
    .returning()
    .then((res) => res.at(0))
    .catch(logErrWithFallback("Failed to create character!", undefined));

  if (insertionRes === undefined) {
    return ctx.text("Failed to create character!", 500);
  }

  return ctx.json(insertionRes, 201);
}
