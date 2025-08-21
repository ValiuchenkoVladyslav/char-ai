import type { ZodObject } from "zod/v4";

export function parseFormData<S extends ZodObject>(data: FormData, schema: S) {
  return schema.safeParseAsync(Object.fromEntries(data));
}
