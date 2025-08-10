import type { createCharacterDto } from "@repo/schema";
import type { Context } from "hono";
import type { infer as z_infer } from "zod/v4";

import { db } from "~/lib/db";
import { characterTbl } from "~/lib/db/schema";
import { isImage } from "~/lib/image";

export async function createCharacter(
  ctx: Context,
  userId: number,
  data: z_infer<typeof createCharacterDto>,
) {
  if ((await isImage(data.pfp)) === false) {
    return ctx.text("Invalid pfp!", 400);
  }

  if ((await isImage(data.image)) === false) {
    return ctx.text("Invalid image!", 400);
  }

  // TODO compress & upload images => get urls
  const pfpUrl = "";
  const imageUrl = "";

  const res = await db
    .insert(characterTbl)
    .values({
      name: data.name,
      description: data.description,
      prompt: data.prompt,

      pfp: pfpUrl,
      image: imageUrl,

      creatorId: userId,
    })
    .returning()
    .then((res) => res.at(0))
    .catch((err) => {
      console.error(err);

      return new Error();
    });

  if (res instanceof Error || res === undefined) {
    return ctx.text("Failed to create character!", 500);
  }

  return ctx.json(res, 201);
}
