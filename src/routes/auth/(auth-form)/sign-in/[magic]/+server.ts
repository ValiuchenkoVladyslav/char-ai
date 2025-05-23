import { redis } from "$lib/server/db";
import { setAuthCookie } from "$lib/server/jwt";
import { edgeRuntime } from "$lib/utils";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const config = edgeRuntime;

export const GET: RequestHandler = async ({ params, cookies }) => {
	const sub = await redis.getdel<number>(params.magic);

	if (!sub) {
		redirect(303, "/auth/sign-in");
	}

	await setAuthCookie(cookies, sub);
	redirect(303, "/auth/success");
};
