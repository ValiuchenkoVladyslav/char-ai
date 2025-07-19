import "server-only";

import { jwtDecrypt } from "jose/jwt/decrypt";
import { EncryptJWT } from "jose/jwt/encrypt";

import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

import { importJWK } from "jose/key/import";

const JWT_ALG = "HS512";

const PARSED_SIGN_JWK = JSON.parse(process.env.JWK_SIGN);
async function importSignJWK() {
  return importJWK(PARSED_SIGN_JWK, JWT_ALG);
}

export async function signJWT(exp: string, sub: string) {
  const key = await importSignJWK();

  return new SignJWT()
    .setProtectedHeader({ alg: JWT_ALG })
    .setExpirationTime(exp)
    .setSubject(sub)
    .sign(key);
}

export async function verifyJWT(token: string) {
  const key = await importSignJWK();

  return jwtVerify(token, key)
    .then((res) => res.payload.sub)
    .catch(() => undefined);
}

const EJWT_ALG = "A256GCMKW";
const EJWT_ENC = "A256GCM";

const PARSED_ENC_JWK = JSON.parse(process.env.JWK_ENCRYPT);
async function importEncryptionJWK() {
  return importJWK(PARSED_ENC_JWK, EJWT_ALG);
}

export async function encryptJWT(exp: string, sub: string) {
  const key = await importEncryptionJWK();

  return new EncryptJWT()
    .setProtectedHeader({ alg: EJWT_ALG, enc: EJWT_ENC })
    .setExpirationTime(exp)
    .setSubject(sub)
    .encrypt(key);
}

export async function decryptJWT(token: string) {
  const key = await importEncryptionJWK();

  return jwtDecrypt(token, key)
    .then((res) => res.payload.sub)
    .catch(() => undefined);
}
