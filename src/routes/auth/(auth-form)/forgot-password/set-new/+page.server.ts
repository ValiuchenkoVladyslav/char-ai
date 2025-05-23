import { db, redis, users } from "$lib/server/db";
import { setAuthCookie } from "$lib/server/jwt";
import { hashPassword } from "$lib/server/password";
import { nodeRuntime, parseFormData } from "$lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { Actions } from "./$types";
import { changePasswordSchema } from "./shared";

// sadly argon is not supported on edge yet
export const config = nodeRuntime;

export const actions = {
	async default({ request, cookies }) {
		const res = parseFormData(await request.formData(), changePasswordSchema);

		if (res.error) {
			return fail(400, { issues: res.error.issues });
		}

		const resetToken = new URL(request.url).searchParams.get("token");
		if (!resetToken) {
			return fail(400, { error: "Invalid reset token!" });
		}

		const email = await redis.getdel<string>(resetToken);
		if (!email) {
			return fail(400, { error: "Invalid or expired reset token!" });
		}

		const passwordHash = await hashPassword(res.data.password);

		const user = await db
			.update(users)
			.set({ passwordHash })
			.where(eq(users.email, email))
			.returning({ id: users.id })
			.then((res) => res.at(0));

		if (!user) {
			console.error("Failed to update password");
			return fail(500, { error: "Failed to update password: User not found" });
		}

		await setAuthCookie(cookies, user.id);
		redirect(303, "/auth/success");
	},
} satisfies Actions;
