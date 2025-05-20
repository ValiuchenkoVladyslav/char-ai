import type { ZodIssue, ZodObject } from "zod/v4";

/** validate `FormData` using provided schema */
export function validateFormData<S extends ZodObject>(
	data: FormData,
	schema: S,
) {
	return schema.safeParse(Object.fromEntries(data));
}

/** get field issue message from set of issues */
export function getIssue(issues: ZodIssue[] | undefined, field: string) {
	return issues?.find((issue) => issue.path[0] === field)?.message;
}
