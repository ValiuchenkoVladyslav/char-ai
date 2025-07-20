import "~/shared/lib/server-only";

import { randomBytes } from "node:crypto";
import {
  type Algorithm as ArgonAlgorithm,
  type Options as ArgonOptions,
  hashSync,
  verifySync,
} from "@node-rs/argon2";

const hashParams: Omit<ArgonOptions, "salt"> = {
  // typescript gives an error about isolatedModules when used directly
  algorithm: 2 satisfies ArgonAlgorithm.Argon2id,
  secret: new TextEncoder().encode(process.env.ARGON2_SECRET),
};

export function hashPassword(password: string) {
  return hashSync(new TextEncoder().encode(password), {
    ...hashParams,
    salt: randomBytes(16),
  });
}

export function verifyPassword(password: string, hashedPassword: string) {
  return verifySync(hashedPassword, password, hashParams);
}
