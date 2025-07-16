import type { cookies } from "next/headers";
import type { ZodIssue, ZodObject } from "zod/v4";

export type Cookies = Awaited<ReturnType<typeof cookies>>;

export interface ApiResponse<D, E> {
  data: D;
  error: E;
}

export function succ(): ApiResponse<null, null>;
export function succ<D>(data: D): ApiResponse<D, null>;
export function succ<D>(data?: D): ApiResponse<D | null, null> {
  return { data: data ?? null, error: null };
}

export function err<E>(error: E): ApiResponse<null, E> {
  return { data: null, error };
}

/** parse & validate `FormData` using provided schema */
export function parseFormData<S extends ZodObject>(data: FormData, schema: S) {
  return schema.safeParse(Object.fromEntries(data));
}

/** get field issue message from set of issues */
export function getIssue(issues: ZodIssue[] | undefined, field: string) {
  return issues?.find((issue) => issue.path[0] === field)?.message;
}
