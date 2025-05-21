import { redis } from "$lib/server/db";
import { setAuthCookie } from "$lib/server/jwt";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, cookies, locals }) => {
	const sub = await redis.getdel<number>(params.magic);

	if (!sub) {
		redirect(303, "/auth/sign-in");
	}

	await setAuthCookie(cookies, sub);
	locals.user = sub;

	redirect(303, "/auth/success");
};
