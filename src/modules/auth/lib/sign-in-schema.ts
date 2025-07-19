import { object, type infer as ZodInfer } from "zod/v4";

import { emailSchema, passwordSchema } from "~/modules/user/client";

export const signInSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInData = ZodInfer<typeof signInSchema>;
