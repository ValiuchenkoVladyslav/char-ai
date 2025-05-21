import { RegisterMethod, db, redis, users } from "$lib/server/db";
import { sendEmail } from "$lib/server/email";
import { verifyPassword } from "$lib/server/password";
import type { Config } from "@sveltejs/adapter-vercel";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { Actions } from "./$types";
import { validateSignInFormData } from "./shared";
import SignInEmail from "./sign-in.email.svelte";

export const config: Config = {
	runtime: "nodejs20.x", // sadly argon is not supported on edge yet
};

export const actions = {
	async default({ request }) {
		const res = validateSignInFormData(await request.formData());

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
