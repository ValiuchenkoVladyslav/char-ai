import { deleteAuthCookie } from "$lib/server/jwt";
import { edgeRuntime } from "$lib/utils";
import type { RequestHandler } from "@sveltejs/kit";

export const config = edgeRuntime;

// auth cookie is httpOnly so it has to be this way
export const GET: RequestHandler = async ({ locals, cookies }) => {
	if (!locals.user) {
		return new Response(null, { status: 401 });
	}

	deleteAuthCookie(cookies);
	return new Response(null, { status: 200 });
};
