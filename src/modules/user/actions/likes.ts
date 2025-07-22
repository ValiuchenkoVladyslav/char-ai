"use server";

import { and, eq, sql } from "drizzle-orm/sql";
import { cookies } from "next/headers";

import { verifyToken } from "~/modules/auth/lib/cookies";
import {
  characterTable,
  getPhonetics,
  samePhonetics,
} from "~/modules/character/server";
import { db } from "~/shared/lib/db";
import { likeTable } from "~/shared/lib/db/schema";
import { err, succ } from "~/shared/lib/utils";

export async function getLikes(search: string) {
  const cookieStore = await cookies();

  const userId = await verifyToken(cookieStore);
  if (!userId) return null;

  const likes = await db
    .select({ characterId: likeTable.characterId })
    .from(likeTable)
    .leftJoin(characterTable, eq(characterTable.id, likeTable.characterId))
    .where(
      and(eq(likeTable.userId, userId), samePhonetics(getPhonetics(search))),
    );

  return likes;
}

export async function likeCharacter(characterId: number) {
  const cookieStore = await cookies();

  const userId = await verifyToken(cookieStore);
  if (!userId) return null;

  try {
    await db.transaction(async (tx) => {
      await tx.insert(likeTable).values({ userId, characterId });
      await tx
        .update(characterTable)
        .set({ likesCount: sql`${characterTable.likesCount} + 1` })
        .where(eq(characterTable.id, characterId));
    });

    return succ();
  } catch {
    return err("Failed to like a character");
  }
}

export async function unlikeCharacter(characterId: number) {
  const cookieStore = await cookies();

  const userId = await verifyToken(cookieStore);
  if (!userId) return null;

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(likeTable)
        .where(
          and(
            eq(likeTable.userId, userId),
            eq(likeTable.characterId, characterId),
          ),
        );
      await tx
        .update(characterTable)
        .set({ likesCount: sql`${characterTable.likesCount} - 1` })
        .where(eq(characterTable.id, characterId));
    });

    return succ();
  } catch {
    return err("Failed to unlike a character");
  }
}
