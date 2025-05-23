import { defineConfig } from "drizzle-kit";

if (!process.env.DB_URL) throw new Error("DB_URL is not set!");
if (!process.env.DB_TOKEN) throw new Error("DB_TOKEN is not set!");

export default defineConfig({
	schema: "./src/lib/server/db/schema.ts",
	dbCredentials: {
		url: process.env.DB_URL,
		authToken: process.env.DB_TOKEN,
	},
	verbose: true,
	strict: true,
	dialect: "turso",
	out: "./.drizzle",
});
