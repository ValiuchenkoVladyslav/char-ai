import { DB_URL, REDIS_TOKEN, REDIS_URL } from "$env/static/private";
import { neon } from "@neondatabase/serverless";
import { Redis } from "@upstash/redis";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const db = drizzle(neon(DB_URL), { schema });

export const redis = new Redis({
	url: REDIS_URL,
	token: REDIS_TOKEN,
});

export * from "./schema";
