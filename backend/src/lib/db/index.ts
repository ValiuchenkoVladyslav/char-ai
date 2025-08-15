import { drizzle } from "drizzle-orm/postgres-js";
import { Redis } from "ioredis";
import postgres from "postgres";

export const db = drizzle({
  client: postgres(process.env.DB_URL),
});

export const redis = new Redis(process.env.REDIS_URL);
