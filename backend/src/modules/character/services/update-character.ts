import type { updateCharacterDto } from "@repo/schema";
import { and, eq } from "drizzle-orm/sql";
import type { Context } from "hono";
import type { infer as z_infer } from "zod/v4";

import { db } from "~/lib/db";
import { characterTbl } from "~/lib/db/schema";
import { isImage } from "~/lib/image";

export async function updateCharacter(
  ctx: Context,
  userId: number,
  characterId: number,
  data: z_infer<typeof updateCharacterDto>,
) {
  if (data.pfp && (await isImage(data.pfp)) === false) {
    return ctx.text("Invalid pfp!", 400);
  }

  if (data.image && (await isImage(data.image)) === false) {
    return ctx.text("Invalid image!", 400);
  }

  // TODO compress & upload images => get urls
  const pfpUrl = "";
  const imageUrl = "";

  const res = await db
    .update(characterTbl)
    .set({
      name: data.name,
      description: data.description,
      prompt: data.prompt,

      pfp: pfpUrl,
      image: imageUrl,
    })
    .where(
      and(eq(characterTbl.creatorId, userId), eq(characterTbl.id, characterId)),
    )
    .catch((err) => {
      console.error(err);

      return new Error();
    });

  if (res instanceof Error || res === undefined) {
    return ctx.text("Failed to update character!", 500);
  }

  return ctx.json(res, 200);
}
