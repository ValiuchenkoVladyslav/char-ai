import { db, redis, users } from "$lib/server/db";
import { sendEmail } from "$lib/server/email";
import { parseFormData } from "$lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { Actions } from "./$types";
import PasswordResetEmail from "./forgot-password.email.svelte";
import { forgotPasswordSchema } from "./shared";

export const actions = {
	async default({ request }) {
		const res = parseFormData(await request.formData(), forgotPasswordSchema);

		if (res.error) {
			return fail(400, { issues: res.error.issues });
		}

		const parsedData = res.data;

		const user = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, parsedData.email))
			.then((res) => res.at(0));

		if (user) {
			const passwordResetToken = crypto.randomUUID() + crypto.randomUUID();
			await redis.setex(passwordResetToken, 60 * 60, user.id);

			sendEmail(parsedData.email, "Confirm Sign-In", PasswordResetEmail, {
				passwordResetToken,
			});
		}

		// no errors if email not found to prevent email enumeration
		redirect(303, "/auth/forgot-password/email-sent?to=" + parsedData.email);
	},
} satisfies Actions;
