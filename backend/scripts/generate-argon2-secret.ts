import { randomBytes } from "node:crypto";

const SECRET_BYTES = 64; // 512 bits

console.log(`ARGON2_SECRET:\n${randomBytes(SECRET_BYTES).toString("base64")}`);
