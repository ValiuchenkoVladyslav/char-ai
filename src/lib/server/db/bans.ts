import { eq } from "drizzle-orm";
import { db, redis } from "./index";
import { users } from "./schema";

const BANNED_USERS_KEY = "banned-users";

/*
 * TODO: moving this check to cuckoo filter will improve
 * happy path performance
 */
export async function isUserBanned(user: number) {
	const res = await redis.sismember(BANNED_USERS_KEY, user);

	return res === 1;
}

export async function banUser(user: number) {
	await Promise.all([
		db.update(users).set({ banned: true }).where(eq(users.id, user)),

		redis.sadd(BANNED_USERS_KEY, user),
	]);
}

export async function unbanUser(user: number) {
	await Promise.all([
		db.update(users).set({ banned: false }).where(eq(users.id, user)),

		redis.srem(BANNED_USERS_KEY, user),
	]);
}
