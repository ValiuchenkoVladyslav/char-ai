import { z } from "zod/v4";

export enum RegisterMethod {
	EmailAndPassword = 0,
	GoogleId = 1,
	Both = 2,
}

/** user schema to extract / extend from */
export const userSchema = z.object({
	displayName: z
		.string({ error: "Name must be a string!" })
		.min(3, { error: "Must be at least 3 characters!" })
		.max(32, { error: "Must be at most 32 characters!" }),

	username: z
		.string({ error: "Invalid username!" })
		.min(3, { error: "Must be at laest 3 characters!" })
		.max(16, { error: "Must be at most 16 characters!" })
		.transform((val) => (val[0] === "@" ? val.slice(1) : val)),

	pfp: z.url({ error: "Invalid url!" }).optional().nullable(),

	email: z
		.email({ error: "Invalid email!" })
		.max(32, { error: "Email must be at most 32 characters!" }),

	password: z
		.string({ error: "Must be a string!" })
		.min(8, { error: "Must be at least 8 characters!" })
		.max(32, { error: "Must be at most 32 characters!" }),
});
