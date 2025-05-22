import { RegisterMethod, db, users } from "$lib/server/db";
import { setAuthCookie } from "$lib/server/jwt";
import { fakerEN } from "@faker-js/faker";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";

// google response example
// {
//   sub: 'string',
//   name: 'name',
//   given_name: 'name',
//   picture: '[link]',
//   email: 'email@gmail.com',
//   email_verified: bool
// }
type GoogleUserInfoRes = {
	sub: string;
	name: string;
	picture: string;
	email: string;
};

export const GET: RequestHandler = async ({ params, cookies }) => {
	const userInfoRes = await fetch(
		"https://www.googleapis.com/oauth2/v3/userinfo?access_token=" +
			params.token,
	);

	if (!userInfoRes.ok) {
		redirect(303, "/auth/sign-in");
	}

	const userInfo: GoogleUserInfoRes = await userInfoRes.json();

	const existingUser = await db
		.select({
			id: users.id,
			email: users.email,
			banned: users.banned,
			googleId: users.googleId,
			RegisterMethod: users.registerMethod,
		})
		.from(users)
		.where(eq(users.email, userInfo.email))
		.then((res) => res.at(0));

	if (!existingUser) {
		let generatedUsername: string | undefined;
		while (true) {
			generatedUsername = fakerEN.internet.username();

			const existingUser = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.username, generatedUsername))
				.then((res) => res.at(0));

			if (!existingUser) {
				break;
			}
		}

		const newUser = await db
			.insert(users)
			.values({
				displayName: userInfo.name,
				username: generatedUsername,
				email: userInfo.email,
				googleId: userInfo.sub,
				registerMethod: RegisterMethod.GoogleId,
			})
			.returning({ id: users.id })
			.then((res) => res[0]);

		await setAuthCookie(cookies, newUser.id);
		redirect(303, "/auth/success");
	}

	if (existingUser.banned) {
		await setAuthCookie(cookies, existingUser.id);
		redirect(303, "/user-banned");
	}

	if (existingUser.RegisterMethod === RegisterMethod.EmailAndPassword) {
		await db
			.update(users)
			.set({
				registerMethod: RegisterMethod.Both,
				googleId: userInfo.sub,
			})
			.where(eq(users.id, existingUser.id))
			.returning({ id: users.id });

		await setAuthCookie(cookies, existingUser.id);
		redirect(303, "/auth/success");
	}

	await setAuthCookie(cookies, existingUser.id);
	redirect(303, "/auth/success");
};
