import { createPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

export const db = drizzle({
  client: createPool({
    connectionString: process.env.DB_URL,
  }),
  schema,
});

export * from "./schema";
