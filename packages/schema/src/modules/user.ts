import { email, object, string, url, type infer as z_infer } from "zod/v4";
import { base } from "../utils";

// === base ===
export enum AuthMethod {
  EmailPass,
  GoogleId,
  Both,
}

export const tagBase = base(3, 24);

export const userNameBase = base(3, 32);

export const emailBase = base(5, 32);

export const passwordBase = base(8, 128);

// === schemas ===
export const userNameSchema = string({ error: "Name must be a string!" })
  .min(userNameBase.minLen, {
    error: `Must be at least ${userNameBase.minLen} characters!`,
  })
  .max(userNameBase.maxLen, {
    error: `Must be at most ${userNameBase.maxLen} characters!`,
  });

export const tagSchema = string({ error: "Invalid tag!" })
  .min(tagBase.minLen, {
    error: `Must be at least ${tagBase.minLen} characters!`,
  })
  .max(tagBase.maxLen, {
    error: `Must be at most ${tagBase.maxLen} characters!`,
  })
  .transform((val) => (val[0] === "@" ? val.slice(1) : val));

export const pfpSchema = url({ error: "Invalid url!" }).optional().nullable();

export const emailSchema = email({ error: "Invalid email!" }).max(
  emailBase.maxLen,
  {
    error: `Email must be at most ${emailBase.maxLen} characters!`,
  },
);

export const passwordSchema = string({ error: "Must be a string!" })
  .min(passwordBase.minLen, {
    error: `Must be at least ${passwordBase.minLen} characters!`,
  })
  .max(passwordBase.maxLen, {
    error: `Must be at most ${passwordBase.maxLen} characters!`,
  });

// === dtos ===
export const signUpDto = object({
  tag: tagSchema,
  name: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpDto = z_infer<typeof signUpDto>;
