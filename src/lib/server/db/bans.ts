import { eq } from "drizzle-orm";
import { db, redis } from "./index";
import { users } from "./schema";

const BANNED_USERS_KEY = "banned-users";

/*
 * TODO: moving this check to cuckoo filter will improve
 * happy path performance
 */
export async function isUserBanned(user: string) {
	const res = await redis.sismember(BANNED_USERS_KEY, Number(user));

	return res === 1;
}

export async function banUser(user: string) {
	const numUser = Number(user);

	await Promise.all([
		db.update(users).set({ banned: true }).where(eq(users.id, numUser)),

		redis.sadd(BANNED_USERS_KEY, numUser),
	]);
}

export async function unbanUser(user: string) {
	const numUser = Number(user);

	await Promise.all([
		db.update(users).set({ banned: false }).where(eq(users.id, numUser)),

		redis.srem(BANNED_USERS_KEY, numUser),
	]);
}
