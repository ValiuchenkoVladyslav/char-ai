import { validateFormData } from "$lib/utils";
import { userSchema } from "$lib/validators";

const signInSchema = userSchema.pick({
	email: true,
	password: true,
});

export function validateSignInFormData(data: FormData) {
	return validateFormData(data, signInSchema);
}
