import { email, string, url } from "zod/v4";
import {
  displayNameBounds,
  emailBounds,
  passwordBounds,
  usernameBounds,
} from "./base";

export const displayNameSchema = string({ error: "Name must be a string!" })
  .min(displayNameBounds.minLen, {
    error: `Must be at least ${displayNameBounds.minLen} characters!`,
  })
  .max(displayNameBounds.maxLen, {
    error: `Must be at most ${displayNameBounds.maxLen} characters!`,
  });

export const usernameSchema = string({ error: "Invalid username!" })
  .min(usernameBounds.minLen, {
    error: `Must be at least ${usernameBounds.minLen} characters!`,
  })
  .max(usernameBounds.maxLen, {
    error: `Must be at most ${usernameBounds.maxLen} characters!`,
  })
  .transform((val) => (val[0] === "@" ? val.slice(1) : val));

export const pfpSchema = url({ error: "Invalid url!" }).optional().nullable();

export const emailSchema = email({ error: "Invalid email!" }).max(
  emailBounds.maxLen,
  {
    error: `Email must be at most ${emailBounds.maxLen} characters!`,
  },
);

export const passwordSchema = string({ error: "Must be a string!" })
  .min(passwordBounds.minLen, {
    error: `Must be at least ${passwordBounds.minLen} characters!`,
  })
  .max(passwordBounds.maxLen, {
    error: `Must be at most ${passwordBounds.maxLen} characters!`,
  });
