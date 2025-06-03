import { characters, db } from "$lib/server/db";
import { logErr } from "$lib/utils";
import { count, sql } from "drizzle-orm";
import { CHARACTERS_COUNT_LOAD_KEY } from "./shared";

function getCharactersCount(query: string | null) {
  return db
    .select({ count: count() })
    .from(characters)
    .where(sql`levenshtein(${characters.name}, ${query}) <= 3`)
    .execute()
    .then((res) => res.at(0)?.count ?? 0)
    .catch(logErr("Error fetching characters count:"));
}

export function load({ depends, url }) {
  depends(CHARACTERS_COUNT_LOAD_KEY);

  return {
    charactersCount: getCharactersCount(url.searchParams.get("q")),
  };
}
