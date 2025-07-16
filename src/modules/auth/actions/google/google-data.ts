import "server-only";

import { SignJWT } from "jose/jwt/sign";
import { encodeKey, JWT_ALG, verifyJWT } from "~/shared/lib/jwt";
import type { Cookies } from "~/shared/lib/utils";

// google response example
// {
//   sub: 'string',
//   name: 'name',
//   given_name: 'name',
//   picture: '[link]',
//   email: 'email@gmail.com',
//   email_verified: bool
// }
export type GoogleUserInfo = {
  sub: string;
  name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};

/** 30 mins (60 * 30) */
const JWT_EXPIRY_SECONDS = 1800 as const;

export const GOOGLE_DATA_COOKIE = "char-ai-google-data";

export async function setGoogleDataCookie(
  cookies: Cookies,
  googleData: GoogleUserInfo,
) {
  const key = await encodeKey();

  const jwt = await new SignJWT()
    .setExpirationTime(`${JWT_EXPIRY_SECONDS}s`)
    .setProtectedHeader({ alg: JWT_ALG })
    .setSubject(JSON.stringify(googleData))
    .sign(key);

  cookies.set({
    name: GOOGLE_DATA_COOKIE,
    value: `Bearer ${jwt}`,
    path: "/google",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: JWT_EXPIRY_SECONDS,
  });
}

export function deleteGoogleDataCookie(cookies: Cookies) {
  cookies.delete({ name: GOOGLE_DATA_COOKIE, path: "/google" });
}

export function getGoogleDataToken(cookies: Cookies) {
  return cookies.get(GOOGLE_DATA_COOKIE)?.value?.split(" ")[1];
}

export async function verifyGoogleDataToken(token: string) {
  const res = await verifyJWT(token);

  if (!res || !res.payload.sub) return undefined;

  return JSON.parse(res.payload.sub) as GoogleUserInfo;
}
