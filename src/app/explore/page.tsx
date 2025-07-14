import { count } from "drizzle-orm/sql";
import { character, db } from "~/db";
import { getPhonetics, samePhonetics } from "~/db/utils";
import { Pagination } from "./_components/pagination";

const ITEMS_PER_PAGE = 28;

async function getCharacters(page: number, phonetics: string) {
  "use cache";

  const baseQuery = db
    .select({
      name: character.name,
      description: character.description,
      image: character.image,
      likesCount: character.likesCount,
    })
    .from(character)
    .limit(ITEMS_PER_PAGE)
    .offset((page - 1) * ITEMS_PER_PAGE);

  if (phonetics.length > 0) {
    return await baseQuery
      .where(samePhonetics(character.phonetics, phonetics))
      .execute();
  }

  return await baseQuery.execute();
}

async function getCharactersCount(phonetics: string) {
  "use cache";

  const res = await db
    .select({ count: count() })
    .from(character)
    .where(samePhonetics(character.phonetics, phonetics))
    .execute()
    .then((res) => res.at(0)?.count ?? 0);

  return res;
}

interface ExplorePageProps {
  searchParams: Promise<{
    // search query
    q?: string | string[];
    // page number
    page?: string | string[];
  }>;
}

export default async function Page(props: ExplorePageProps) {
  const { page, q } = await props.searchParams;

  const pageInt = Math.max(Number(page) || 1, 1);
  const phonetics = typeof q === "string" ? getPhonetics(q) : "";

  const [characters, count] = await Promise.all([
    getCharacters(pageInt, phonetics),
    getCharactersCount(phonetics),
  ]);

  return (
    <div>
      {JSON.stringify(phonetics)}

      <Pagination
        page={pageInt}
        maxPage={Math.max(1, Math.ceil(count / ITEMS_PER_PAGE))}
        query={q}
      />
    </div>
  );
}
