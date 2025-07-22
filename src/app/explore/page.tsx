import { count, eq } from "drizzle-orm/sql";
import { Suspense } from "react";
import {
  characterTable,
  getPhonetics,
  samePhonetics,
} from "~/modules/character/server";
import { userTable } from "~/modules/user/server";
import { db } from "~/shared/lib/db";
import { CharactersList } from "./_components/characters-list";
import { Pagination } from "./_components/pagination";

const ITEMS_PER_PAGE = 28;

async function getCharacters(page: number, phonetics: string) {
  const baseQuery = db
    .select({
      name: characterTable.name,
      description: characterTable.description,
      image: characterTable.image,
      likesCount: characterTable.likesCount,
      characterId: characterTable.id,
      authorName: userTable.displayName,
      authorUsername: userTable.username,
      authorPfp: userTable.pfp,
    })
    .from(characterTable)
    .leftJoin(userTable, eq(userTable.id, characterTable.creatorId))
    .limit(ITEMS_PER_PAGE)
    .offset((page - 1) * ITEMS_PER_PAGE);

  if (phonetics.length > 0) {
    return baseQuery.where(samePhonetics(phonetics));
  }

  return baseQuery;
}

async function getCharactersCount(phonetics: string) {
  return db
    .select({ count: count() })
    .from(characterTable)
    .where(samePhonetics(phonetics))
    .then((res) => res.at(0)?.count ?? 0);
}

interface ExplorePageProps {
  searchParams: Promise<{
    // search query
    q?: string | string[];
    // page number
    page?: string | string[];
  }>;
}

export default async function ExplorePage(props: ExplorePageProps) {
  const { page, q } = await props.searchParams;

  const pageInt = Math.max(Number(page) || 1, 1);
  const search = typeof q === "string" ? q.trim() : "";
  const phonetics = getPhonetics(search);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CharactersList
        characters={getCharacters(pageInt, phonetics)}
        search={search}
      />

      <Pagination
        page={pageInt}
        itemsCount={getCharactersCount(phonetics)}
        itemsPerPage={ITEMS_PER_PAGE}
        query={q}
      />
    </Suspense>
  );
}
