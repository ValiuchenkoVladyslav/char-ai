import { RegisterMethod, db, redis, users } from "$lib/server/db";
import { setAuthCookie } from "$lib/server/jwt";
import { hashPassword } from "$lib/server/password";
import type { Config } from "@sveltejs/adapter-vercel";
import { redirect } from "@sveltejs/kit";
import type { SignUpData } from "../shared";
import type { RequestHandler } from "./$types";

export const config: Config = {
	runtime: "nodejs20.x", // sadly argon is not supported on edge yet
};

export const GET: RequestHandler = async ({ params, cookies, locals }) => {
	const strData = await redis.getdel<string>(params.magic);

	if (!strData) {
		redirect(303, "/auth/sign-up");
	}

	const parsedData: SignUpData = JSON.parse(strData);

	const passwordHash = await hashPassword(parsedData.password);

	const res = await db
		.insert(users)
		.values({
			displayName: parsedData.displayName,
			username: parsedData.username,
			email: parsedData.email,
			passwordHash,
			registerMethod: RegisterMethod.EmailAndPassword,
		})
		.returning({ id: users.id })
		.then((res) => res.at(0));

	if (!res) {
		console.error("Failed to create user");
		redirect(303, "/auth/sign-up");
	}

	await setAuthCookie(cookies, res.id);
	locals.user = res.id;

	redirect(303, "/auth/success");
};
