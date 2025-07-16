export enum AuthMethod {
  EmailAndPassword = 0,
  GoogleId = 1,
  Both = 2,
}

export const usernameBounds = {
  maxLen: 24,
  minLen: 3,
} as const;

export const displayNameBounds = {
  maxLen: 32,
  minLen: 3,
} as const;

export const emailBounds = {
  maxLen: 32,
  minLen: 5,
} as const;

export const passwordBounds = {
  maxLen: 128,
  minLen: 8,
} as const;
