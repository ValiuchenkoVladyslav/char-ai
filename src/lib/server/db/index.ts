import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Redis } from "@upstash/redis";
import { env } from "$env/dynamic/private";
import * as schema from "./schema";

export const db = drizzle(neon(env.DB_URL satisfies string), { schema });

export const redis = new Redis({
  url: env.REDIS_URL satisfies string,
  token: env.REDIS_TOKEN satisfies string,
});
