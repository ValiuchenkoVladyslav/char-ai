export const nameBounds = {
  maxLen: 32,
  minLen: 3,
} as const;

export const descriptionBounds = {
  maxLen: 256,
} as const;

export const masterPromptBounds = {
  maxLen: 512,
  minLen: 12,
} as const;

export function characterSlug(id: number, name: string) {
  return `${id}-${encodeURIComponent(name.toLowerCase())}`;
}

export function decodeCharacterSlug(slug: string) {
  const [id, ...nameParts] = slug.split("-");
  const numericId = Number(id);

  if (isNaN(numericId)) {
    throw new Error(`Invalid character slug format: ${slug}`);
  }

  const name = decodeURIComponent(nameParts.join("-"));

  return { id: numericId, name };
}
