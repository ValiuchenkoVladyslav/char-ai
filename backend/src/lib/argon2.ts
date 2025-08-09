import { createHmac } from "node:crypto";

function hmac(password: string) {
  return createHmac("sha256", process.env.ARGON_SECRET)
    .update(password)
    .digest();
}

const hashOptions: Bun.Password.Argon2Algorithm = {
  algorithm: "argon2id",
  memoryCost: 19 * 1024,
  timeCost: 2,
};

export function hashPassword(password: string) {
  return Bun.password.hashSync(hmac(password), hashOptions);
}

export function verifyPassword(password: string, hashed: string) {
  return Bun.password.verifySync(hmac(password), hashed);
}
