import "~/shared/lib/server-only";

import { Redis } from "@upstash/redis";
import { createPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const db = drizzle({
  client: createPool({
    connectionString: process.env.DB_URL,
  }),
});

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});
