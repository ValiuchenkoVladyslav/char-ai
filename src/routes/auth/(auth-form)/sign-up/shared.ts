import { userSchema } from "$lib/validators";
import type { z } from "zod/v4";

export const signUpSchema = userSchema.omit({ pfp: true });

export type SignUpData = z.infer<typeof signUpSchema>;
