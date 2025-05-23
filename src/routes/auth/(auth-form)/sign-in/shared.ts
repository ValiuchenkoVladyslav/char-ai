import { userSchema } from "$lib/validators";

export const signInSchema = userSchema.pick({
  email: true,
  password: true,
});
