import type { Config } from "@sveltejs/adapter-vercel";
import type { ZodIssue, ZodObject } from "zod/v4";

/** nodejs 20 runtime endpoint config */
export const nodeRuntime: Config = {
	runtime: "nodejs20.x",
};

/** parse & validate `FormData` using provided schema */
export function parseFormData<S extends ZodObject>(data: FormData, schema: S) {
	return schema.safeParse(Object.fromEntries(data));
}

/** get field issue message from set of issues */
export function getIssue(issues: ZodIssue[] | undefined, field: string) {
	return issues?.find((issue) => issue.path[0] === field)?.message;
}
