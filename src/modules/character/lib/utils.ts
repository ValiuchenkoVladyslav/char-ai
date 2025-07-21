import "~/shared/lib/server-only";

import { ilike, or, sql } from "drizzle-orm/sql";
import { metaphone } from "metaphone";

import { characterTable } from "~/modules/character/lib/table";

export function getPhonetics(str: string): string {
  return metaphone(str.trim());
}

export function samePhonetics(phonetics: string) {
  return or(
    ilike(characterTable.phonetics, `%${phonetics}%`),
    sql`levenshtein(${characterTable.phonetics}, ${phonetics}) < 1`,
  );
}
