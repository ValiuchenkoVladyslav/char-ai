import { validateFormData } from "$lib/utils";
import { userSchema } from "$lib/validators";
import type { z } from "zod/v4";

const signUpSchema = userSchema.omit({ pfp: true });

export type SignUpData = z.infer<typeof signUpSchema>;

export function validateSignUpFormData(data: FormData) {
	return validateFormData(data, signUpSchema);
}
