import { userSchema } from "$lib/validators";

export const changePasswordSchema = userSchema.pick({
	password: true,
});
