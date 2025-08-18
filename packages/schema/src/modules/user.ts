import { email, type infer as Infer, object, string, url } from "zod/v4";
import { base, fileDto } from "../utils";

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
export const userNameSchema = string("Name must be a string!")
  .min(
    userNameBase.minLen,
    `Must be at least ${userNameBase.minLen} characters!`,
  )
  .max(
    userNameBase.maxLen,
    `Must be at most ${userNameBase.maxLen} characters!`,
  );

export const tagSchema = string("Invalid tag!")
  .min(tagBase.minLen, `Must be at least ${tagBase.minLen} characters!`)
  .max(tagBase.maxLen, `Must be at most ${tagBase.maxLen} characters!`)
  .transform((val) => (val[0] === "@" ? val.slice(1) : val));

export const pfpSchema = url("Invalid url!").optional().nullable();

export const emailSchema = email("Invalid email!").max(
  emailBase.maxLen,
  `Email must be at most ${emailBase.maxLen} characters!`,
);

export const passwordSchema = string("Must be a string!")
  .min(
    passwordBase.minLen,
    `Must be at least ${passwordBase.minLen} characters!`,
  )
  .max(
    passwordBase.maxLen,
    `Must be at most ${passwordBase.maxLen} characters!`,
  );

// === dtos ===
export const signUpDto = object({
  tag: tagSchema,
  name: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
  pfp: fileDto,
});

export type SignUpDto = Infer<typeof signUpDto>;

export const confirmEmailDto = object({
  token: string("Token must be a string!"),
});

export type ConfirmEmailDto = Infer<typeof confirmEmailDto>;

export const signInDto = object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInDto = Infer<typeof signInDto>;
