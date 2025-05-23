import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import { importPKCS8, importSPKI } from "jose/key/import";

import { JWT_SECRET_DECODE, JWT_SECRET_ENCODE } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";

/** jwt secret encryption algorithm */
const JWT_ALG = "RS256";

/** 3 days (60 * 60 * 24 * 3) */
const JWT_EXPIRY_SECONDS = 259200 as const;

const AUTH_COOKIE = "Authorization";

/** fix key after env file */
function fixKey(key: string) {
	return key.replaceAll("\\n", "\n");
}

export async function setAuthCookie(cookies: Cookies, userId: number) {
	const encodeKey = await importPKCS8(fixKey(JWT_SECRET_ENCODE), JWT_ALG);

	const jwt = await new SignJWT()
		.setExpirationTime(`${JWT_EXPIRY_SECONDS}s`)
		.setProtectedHeader({ alg: JWT_ALG })
		.setSubject(String(userId))
		.sign(encodeKey);

	cookies.set(AUTH_COOKIE, `Bearer ${jwt}`, {
		path: "/",
		secure: true,
		httpOnly: true,
		sameSite: "lax",
		maxAge: JWT_EXPIRY_SECONDS,
	});
}

export function deleteAuthCookie(cookies: Cookies) {
	cookies.delete(AUTH_COOKIE, { path: "/" });
}

/** get jwt token from `Authorization` cookie */
export function getToken(cookies: Cookies) {
	return cookies.get(AUTH_COOKIE)?.split(" ")[1];
}

/** verify jwt token */
export async function verifyToken(token: string) {
	const decodeKey = await importSPKI(fixKey(JWT_SECRET_DECODE), JWT_ALG);

	try {
		const { payload } = await jwtVerify(token, decodeKey, {
			algorithms: [JWT_ALG],
		});

		if (!payload.sub) {
			return undefined;
		}

		const { sub, ...rest } = payload;

		return { sub: Number(sub), ...rest };
	} catch {
		return undefined;
	}
}
