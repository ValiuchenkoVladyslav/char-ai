import "server-only";

import { signJWT, verifyJWT } from "~/shared/lib/jwt";
import type { Cookies } from "~/shared/lib/utils";

/** 3 days (60 * 60 * 24 * 3) */
const JWT_EXPIRY_SECONDS = 259200 as const;

const AUTH_COOKIE = "Authorization";

export async function setAuthCookie(cookies: Cookies, userId: number) {
  const jwt = await signJWT(`${JWT_EXPIRY_SECONDS}s`, String(userId));

  cookies.set({
    name: AUTH_COOKIE,
    value: `Bearer ${jwt}`,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: JWT_EXPIRY_SECONDS,
  });
}

export function deleteAuthCookie(cookies: Cookies) {
  cookies.delete({ name: AUTH_COOKIE, path: "/" });
}

/** get jwt token from `Authorization` cookie */
export function getToken(cookies: Cookies) {
  return cookies.get(AUTH_COOKIE)?.value?.split(" ")[1];
}

/**
 * verify jwt token
 * @returns user id if valid
 */
export async function verifyToken(token: string) {
  const res = await verifyJWT(token);

  if (!res) return undefined;

  return Number(res);
}
