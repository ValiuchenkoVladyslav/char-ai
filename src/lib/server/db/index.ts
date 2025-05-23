import { DB_TOKEN, DB_URL, REDIS_TOKEN, REDIS_URL } from "$env/static/private";
import { Redis } from "@upstash/redis";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const db = drizzle({
  connection: {
    url: DB_URL,
    authToken: DB_TOKEN,
  },
  schema,
});

export const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});

export * from "./schema";
