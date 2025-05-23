import { db, users } from "$lib/server/db";
import { edgeRuntime } from "$lib/utils";
import { type RequestHandler, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const config = edgeRuntime;

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response(null, { status: 401 });
	}

	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, locals.user),
			columns: {
				id: true,
				displayName: true,
				username: true,
				email: true,
			},
		});

		if (!user) {
			return new Response(null, { status: 404 });
		}

		return json(user);
	} catch (error) {
		console.error("Error fetching user data:", error);

		return new Response(null, { status: 500 });
	}
};
