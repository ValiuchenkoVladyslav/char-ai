import { db, redis, users } from "$lib/server/db";
import { sendEmail } from "$lib/server/email";
import { fail, redirect } from "@sveltejs/kit";
import { eq, or } from "drizzle-orm";
import type { Actions } from "./$types";
import { type SignUpData, validateSignUpFormData } from "./shared";
import SignUpEmail from "./sign-up.email.svelte";

export const actions = {
	async default({ request }) {
		const res = validateSignUpFormData(await request.formData());

		if (res.error) {
			return fail(400, { issues: res.error.issues });
		}

		const parsedData = res.data;

		const taken = await db
			.select({ username: users.username, email: users.email })
			.from(users)
			.where(
				or(
					eq(users.email, parsedData.email),
					eq(users.username, parsedData.username),
				),
			)
			.then((res) => res.at(0));

		if (taken) {
			return fail(400, {
				error:
					parsedData.email === taken.email
						? "Email already taken"
						: "Username already taken",
			});
		}

		const signUpToken = crypto.randomUUID() + crypto.randomUUID();
		const parsedDataStr = JSON.stringify(parsedData satisfies SignUpData);

		await redis.setex(signUpToken, 60 * 60, parsedDataStr);

		sendEmail(parsedData.email, "Confirm Sign-Up", SignUpEmail, {
			signUpToken,
		});

		redirect(303, "/auth/sign-in/email-sent?to=" + parsedData.email);
	},
} satisfies Actions;
