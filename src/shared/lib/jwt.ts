import "server-only";

import { jwtVerify } from "jose/jwt/verify";
import { importPKCS8, importSPKI } from "jose/key/import";

export const JWT_ALG = "RS256";

/** fix key after env file */
function fixKey(key: string) {
  return key.replaceAll("\\n", "\n");
}

export function encodeKey() {
  return importPKCS8(fixKey(process.env.JWT_SECRET_ENCODE), JWT_ALG);
}

export function decodeKey() {
  return importSPKI(fixKey(process.env.JWT_SECRET_DECODE), JWT_ALG);
}

export async function verifyJWT(token: string) {
  try {
    return await jwtVerify(token, await decodeKey(), {
      algorithms: [JWT_ALG],
    });
  } catch {
    return undefined;
  }
}
