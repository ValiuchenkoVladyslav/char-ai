import { object, type infer as ZodInfer } from "zod/v4";

import {
  displayNameSchema,
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "~/modules/user/client";

export const signUpSchema = object({
  username: usernameSchema,
  displayName: displayNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpData = ZodInfer<typeof signUpSchema>;
