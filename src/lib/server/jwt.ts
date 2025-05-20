import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import { importPKCS8, importSPKI } from "jose/key/import";

import { env } from "$env/dynamic/private";
import type { Cookies } from "@sveltejs/kit";

/** jwt secret encryption algorithm */
const JWT_ALG = "RS256";

/** 3 days (60 * 60 * 24 * 3) */
const JWT_EXPIRY_SECONDS = 259200 as const;

/** fix key after env file */
function fixKey(key: string) {
	return key.replaceAll("\\n", "\n");
}

export async function setAuthorizationCookie(cookies: Cookies, userId: number) {
	const encodeKey = await importPKCS8(
		fixKey(env.JWT_SECRET_ENCODE satisfies string),
		JWT_ALG,
	);

	const jwt = await new SignJWT()
		.setExpirationTime(`${JWT_EXPIRY_SECONDS}s`)
		.setProtectedHeader({ alg: JWT_ALG })
		.setSubject(String(userId))
		.sign(encodeKey);

	cookies.set("Authorization", `Bearer ${jwt}`, {
		path: "/",
		secure: true,
		httpOnly: true,
		sameSite: "strict",
		maxAge: JWT_EXPIRY_SECONDS,
	});
}

/** get jwt token from `Authorization` cookie */
export function getToken(cookies: Cookies) {
	return cookies.get("Authorization")?.split(" ")[1];
}

/** verify jwt token */
export async function verifyToken(token: string) {
	const decodeKey = await importSPKI(
		fixKey(env.JWT_SECRET_DECODE satisfies string),
		JWT_ALG,
	);

	try {
		const { payload } = await jwtVerify(token, decodeKey, {
			algorithms: [JWT_ALG],
		});

		if (!payload.sub) {
			return undefined;
		}

		return payload as typeof payload & { sub: string };
	} catch {
		return undefined;
	}
}
