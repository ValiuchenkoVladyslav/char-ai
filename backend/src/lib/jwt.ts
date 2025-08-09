import type { JWTHeaderParameters } from "jose";

import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

import { importJWK } from "jose/key/import";

const JWT_ALG = "HS512";

const JWK_SIGN = await importJWK(JSON.parse(process.env.JWK_SIGN), JWT_ALG);

const JWT_HEADER: JWTHeaderParameters = {
  alg: JWT_ALG,
};

export async function signJWT(exp: string, sub: string) {
  return new SignJWT()
    .setProtectedHeader(JWT_HEADER)
    .setExpirationTime(exp)
    .setSubject(sub)
    .sign(JWK_SIGN);
}

/** @returns sub if valid */
export async function verifyJWT(token: string) {
  return jwtVerify(token, JWK_SIGN)
    .then((res) => res.payload.sub)
    .catch(() => undefined);
}
