import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const users = pgTable("User", {
	id: serial("id").primaryKey(),
	displayName: varchar("displayName", { length: 32 }).notNull(),
	username: varchar("username", { length: 16 }).notNull().unique(),
	pfp: varchar("pfp", { length: 255 }),

	email: varchar("email", { length: 32 }).unique(),
	passwordHash: varchar("passwordHash", { length: 255 }),
	googleId: varchar("googleId", { length: 255 }).unique(),
	registerMethod: integer("registerMethod").notNull(),

	banned: boolean("banned").notNull().default(false),

	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt")
		.notNull()
		.$onUpdate(() => sql`(now() AT TIME ZONE 'utc'::text)`),
});

export const characters = pgTable("Character", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 32 }).notNull(),
	description: varchar("description", { length: 256 }),
	masterPrompt: varchar("masterPrompt", { length: 512 }).notNull(),
	image: varchar("image", { length: 255 }).notNull(),
	pfp: varchar("pfp", { length: 255 }).notNull(),

	likesCount: integer("likesCount").notNull().default(0),

	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt")
		.notNull()
		.$onUpdate(() => sql`(now() AT TIME ZONE 'utc'::text)`),

	creatorId: integer("creatorId").references(() => users.id, {
		onDelete: "set null",
	}),
});

export const likes = pgTable(
	"Like",
	{
		characterId: integer("characterId")
			.notNull()
			.references(() => characters.id, {
				onDelete: "cascade",
			}),
		userId: integer("userId")
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
			}),
	},
	(table) => [primaryKey({ columns: [table.characterId, table.userId] })],
);
