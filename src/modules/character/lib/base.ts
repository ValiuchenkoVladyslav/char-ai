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
