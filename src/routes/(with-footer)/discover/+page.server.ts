import { characters, db } from "$lib/server/db";
import { logErr } from "$lib/utils";
import { sql } from "drizzle-orm";
import { CHARACTERS_PER_PAGE } from "./shared";

const getTopCharactersError = logErr("Error fetching top characters:");

function getTopCharacters(query: string | null, page: number) {
  const dbQuery = db
    .select()
    .from(characters)
    .limit(CHARACTERS_PER_PAGE)
    .offset((page - 1) * CHARACTERS_PER_PAGE);

  if (query && query.trim().length > 0) {
    return dbQuery
      .where(sql`levenshtein(${characters.name}, ${query}) <= 3`)
      .execute()
      .catch(getTopCharactersError);
  }

  return dbQuery.execute().catch(getTopCharactersError);
}

export async function load({ url }) {
  const query = url.searchParams.get("q");
  const page = Number.parseInt(url.searchParams.get("p") || "1", 10) || 1;

  return {
    topCharacters: getTopCharacters(query, page),
  };
}
