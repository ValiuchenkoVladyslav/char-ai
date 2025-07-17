import "server-only";

import { signJWT, verifyJWT } from "~/shared/lib/jwt";
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
const JWT_EXPIRY_SECS = 1800 as const;
const JWT_EXPIRY_SECS_STR = `1800s` satisfies `${typeof JWT_EXPIRY_SECS}s`;

const GOOGLE_DATA_COOKIE = "char-ai-google-data";

export async function setGoogleDataCookie(
  cookies: Cookies,
  googleData: GoogleUserInfo,
) {
  const jwt = await signJWT(JWT_EXPIRY_SECS_STR, JSON.stringify(googleData));

  cookies.set({
    name: GOOGLE_DATA_COOKIE,
    value: `Bearer ${jwt}`,
    path: "/google",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: JWT_EXPIRY_SECS,
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
