import { characters, db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import { CHARACTERS_PER_PAGE } from "./shared";

async function getTopCharacters(query: string | null, page: number) {
  const topCharacters = await db
    .select()
    .from(characters)
    .where(sql`levenshtein(${characters.name}, ${query}) <= 3`)
    .limit(CHARACTERS_PER_PAGE)
    .offset(page * CHARACTERS_PER_PAGE)
    .execute();

  return topCharacters;
}

export async function load({ url }) {
  const query = url.searchParams.get("q");
  const page = Number.parseInt(url.searchParams.get("p") || "1", 10) || 1;

  return {
    topCharacters: getTopCharacters(query, page),
  };
}
