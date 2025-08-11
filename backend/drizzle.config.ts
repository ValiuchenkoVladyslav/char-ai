import { defineConfig } from "drizzle-kit";

if (!process.env.DB_URL) {
  throw new Error("DB_URL is missing!");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: process.env.DB_URL,
  },
});
