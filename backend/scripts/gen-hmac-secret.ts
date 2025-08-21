import { randomBytes } from "node:crypto";

const SECRET_BYTES = 64; // 512 bits

console.log(`HMAC_SECRET:\n${randomBytes(SECRET_BYTES).toString("base64")}`);
