import { eq } from "drizzle-orm/sql";
import type { Context } from "hono";

import { db } from "~/lib/db";
import { characterTbl } from "~/lib/db/schema";

export async function getCharacter(ctx: Context, id: number) {
  const res = await db
    .select()
    .from(characterTbl)
    .where(eq(characterTbl.id, id))
    .then((res) => res.at(0))
    .catch((err) => {
      console.error(err);

      return new Error("Failed to get character info!");
    });

  if (res instanceof Error) {
    return ctx.text(res.message, 400);
  }

  if (res === undefined) {
    return ctx.notFound();
  }

  return ctx.json(res, 200);
}
