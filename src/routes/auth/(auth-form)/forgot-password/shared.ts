import { userSchema } from "$lib/validators";

export const forgotPasswordSchema = userSchema.pick({
  email: true,
});
