import type { cookies } from "next/headers";
import type { ZodIssue, ZodObject } from "zod/v4";

export type Cookies = Awaited<ReturnType<typeof cookies>>;

export type ApiResponse<S extends boolean, D> = { success: S } & (S extends true
  ? { data: D }
  : { error: D });

export function succ(): ApiResponse<true, null>;
export function succ<D>(data: D): ApiResponse<true, D>;
export function succ<D>(data?: D): ApiResponse<true, D | null> {
  return { success: true, data: data ?? null };
}

export function err<E>(error: E): ApiResponse<false, E> {
  return { success: false, error };
}

/** parse & validate `FormData` using provided schema */
export function parseFormData<S extends ZodObject>(data: FormData, schema: S) {
  return schema.safeParse(Object.fromEntries(data));
}

/** get field issue message from set of issues */
export function getIssue(issues: ZodIssue[] | undefined, field: string) {
  return issues?.find((issue) => issue.path[0] === field)?.message;
}
