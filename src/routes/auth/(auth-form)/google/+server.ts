import { RegisterMethod, db, users } from "$lib/server/db";
import { setAuthCookie } from "$lib/server/jwt";
import { fakerEN } from "@faker-js/faker";
import { error } from "@sveltejs/kit";
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
	email_verified: boolean;
};

export const GET: RequestHandler = async ({ cookies, request }) => {
	const token = request.headers.get("Authorization")?.split(" ")[1];
	if (!token) {
		error(400, { message: "Invalid data" });
	}

	let userInfoRes: Response;
	try {
		userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		console.error("Error fetching user info from Google:", e);
		error(500, { message: "Unknown error occurred" });
	}

	if (!userInfoRes.ok) {
		error(400, { message: "Invalid data" });
	}

	let userInfo: GoogleUserInfoRes;
	try {
		userInfo = await userInfoRes.json();
	} catch (e) {
		console.error("Error parsing user info response:", e);
		error(500, { message: "Unknown error occurred" });
	}

	if (!userInfo.email_verified) {
		error(400, { message: "Choose a verified email" });
	}

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
		return new Response(null, { status: 200 });
	}

	if (existingUser.banned) {
		await setAuthCookie(cookies, existingUser.id);
		error(403, { message: "User is banned" });
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
		return new Response(null, { status: 200 });
	}

	await setAuthCookie(cookies, existingUser.id);
	return new Response(null, { status: 200 });
};
