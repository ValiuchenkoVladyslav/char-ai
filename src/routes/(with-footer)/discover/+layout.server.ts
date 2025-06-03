import { characters, db } from "$lib/server/db";
import { count, sql } from "drizzle-orm";
import { CHARACTERS_COUNT_LOAD_KEY } from "./shared";

async function getCharactersCount(query: string | null) {
  const res = await db
    .select({ count: count() })
    .from(characters)
    .where(sql`levenshtein(${characters.name}, ${query}) <= 3`)
    .execute()
    .then((res) => res.at(0));

  return res?.count ?? 0;
}

export function load({ depends, url }) {
  depends(CHARACTERS_COUNT_LOAD_KEY);

  return {
    charactersCount: getCharactersCount(url.searchParams.get("q")),
  };
}
