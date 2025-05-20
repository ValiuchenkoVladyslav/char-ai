import {
	type Algorithm as ArgonAlgorithm,
	type Options as ArgonOptions,
	hash,
	verify,
} from "@node-rs/argon2";
import { env } from "$env/dynamic/private";

const passwordHashParams: Omit<ArgonOptions, "salt"> = {
	algorithm: 2 satisfies ArgonAlgorithm,
	secret: new TextEncoder().encode(env.ARGON2_SECRET satisfies string),
};

export function hashPassword(password: string) {
	const salt = new Uint8Array(16);
	crypto.getRandomValues(salt);

	return hash(new TextEncoder().encode(password), {
		...passwordHashParams,
		salt,
	});
}

export function verifyPassword(password: string, hashedPassword: string) {
	return verify(hashedPassword, password, passwordHashParams);
}
