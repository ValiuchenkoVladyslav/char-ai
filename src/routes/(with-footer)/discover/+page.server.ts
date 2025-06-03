import { characters, db } from "$lib/server/db";
import { logErr } from "$lib/utils";
import { sql } from "drizzle-orm";
import { CHARACTERS_PER_PAGE } from "./shared";

function getTopCharacters(query: string | null, page: number) {
  return db
    .select()
    .from(characters)
    .where(sql`levenshtein(${characters.name}, ${query}) <= 3`)
    .limit(CHARACTERS_PER_PAGE)
    .offset((page - 1) * CHARACTERS_PER_PAGE)
    .execute()
    .catch(logErr("Error fetching top characters:"));
}

export async function load({ url }) {
  const query = url.searchParams.get("q");
  const page = Number.parseInt(url.searchParams.get("p") || "1", 10) || 1;

  return {
    topCharacters: getTopCharacters(query, page),
  };
}
