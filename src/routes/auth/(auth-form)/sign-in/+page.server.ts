import { RegisterMethod, db, redis, users } from "$lib/server/db";
import { sendEmail } from "$lib/server/email";
import { setAuthCookie } from "$lib/server/jwt";
import { verifyPassword } from "$lib/server/password";
import { nodeRuntime, parseFormData } from "$lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { Actions } from "./$types";
import { signInSchema } from "./shared";
import SignInEmail from "./sign-in.email.svelte";

// sadly argon is not supported on edge yet
export const config = nodeRuntime;

export const actions = {
	async default({ request, cookies }) {
		const res = parseFormData(await request.formData(), signInSchema);

		if (res.error) {
			return fail(400, { issues: res.error.issues });
		}

		const parsedData = res.data;

		const selectedUser = await db
			.select({
				id: users.id,
				passwordHash: users.passwordHash,
				registerMethod: users.registerMethod,
				banned: users.banned,
			})
			.from(users)
			.where(eq(users.email, parsedData.email))
			.then((res) => res.at(0));

		if (
			!selectedUser ||
			selectedUser.registerMethod === RegisterMethod.GoogleId
		) {
			return fail(400, { error: "Invalid email or password" });
		}

		if (selectedUser.banned) {
			await setAuthCookie(cookies, selectedUser.id);
			redirect(303, "/user-banned");
		}

		const passwordRes = await verifyPassword(
			parsedData.password,
			// biome-ignore lint/style/noNonNullAssertion: we checked registerMethod above
			selectedUser.passwordHash!,
		);

		if (!passwordRes) {
			return fail(400, { error: "Invalid email or password" });
		}

		const signInToken = crypto.randomUUID() + crypto.randomUUID();
		await redis.setex(signInToken, 60 * 60, selectedUser.id);

		sendEmail(parsedData.email, "Confirm Sign-In", SignInEmail, {
			signInToken,
		});

		redirect(303, "/auth/sign-in/email-sent?to=" + parsedData.email);
	},
} satisfies Actions;
