import { CHARACTERS_PER_PAGE } from "./shared";

async function getTopCharacters(search: string | null, page: number) {
  return Array.from({ length: CHARACTERS_PER_PAGE }, (_, i) => i);
}

export async function load({ url }) {
  const search = url.searchParams.get("q");
  // "1" handles missing sp, 1 handles NaN result (invalid sp)
  const page = Number.parseInt(url.searchParams.get("p") || "1", 10) || 1;

  return {
    topCharacters: getTopCharacters(search, page),
  };
}
