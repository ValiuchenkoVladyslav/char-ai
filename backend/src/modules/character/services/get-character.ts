import { eq } from "drizzle-orm/sql";
import type { Context } from "hono";

import { db } from "~/lib/db";
import { characterTbl } from "~/lib/db/schema";
import { logErrWithFallback } from "~/lib/utils";

export async function getCharacter(ctx: Context, id: number) {
  const res = await db
    .select()
    .from(characterTbl)
    .where(eq(characterTbl.id, id))
    .then((res) => res.at(0))
    .catch(
      logErrWithFallback(
        "Failed to select character!",
        new Error("Failed to get character info!"),
      ),
    );

  if (res instanceof Error) {
    return ctx.text(res.message, 500);
  }

  if (res === undefined) {
    return ctx.text("Character not found!", 404);
  }

  return ctx.json(res, 200);
}
