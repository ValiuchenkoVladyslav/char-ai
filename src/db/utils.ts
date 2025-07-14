import type { PgColumn } from "drizzle-orm/pg-core";
import { ilike, or, sql } from "drizzle-orm/sql";
import { metaphone } from "metaphone";

export function getPhonetics(str: string): string {
  return metaphone(str.trim());
}

export function samePhonetics(column: PgColumn, phonetics: string) {
  return or(
    ilike(column, `%${phonetics}%`),
    sql`levenshtein(${column}, ${phonetics}) < 4`,
  );
}
