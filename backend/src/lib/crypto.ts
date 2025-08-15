import { createHmac, randomBytes } from "node:crypto";

export function hmac(password: string) {
  return createHmac("sha256", process.env.HMAC_SECRET)
    .update(password)
    .digest();
}

export function randomBytesB64(size: number) {
  return randomBytes(size).toString("base64");
}

export namespace Argon2 {
  const options: Bun.Password.Argon2Algorithm = {
    algorithm: "argon2id",
    memoryCost: 19 * 1024,
    timeCost: 2,
  };

  export function hash(str: string) {
    return Bun.password.hashSync(hmac(str), options);
  }

  export function verify(str: string, hashed: string) {
    return Bun.password.verifySync(hmac(str), hashed);
  }
}
