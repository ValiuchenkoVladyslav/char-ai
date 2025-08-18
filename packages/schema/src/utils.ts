import { instanceof as z_instanceof } from "zod/v4";

export function base(minLen: number, maxLen: number) {
  return { minLen, maxLen };
}

export const fileDto = z_instanceof(File);
