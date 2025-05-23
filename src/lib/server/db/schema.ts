import { sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export enum RegisterMethod {
	EmailAndPassword = 0,
	GoogleId = 1,
	Both = 2,
}

export const users = sqliteTable("User", {
	id: integer("id").primaryKey(),
	displayName: text("displayName", { length: 32 }).notNull(),
	username: text("username", { length: 24 }).notNull().unique(),
	pfp: text("pfp", { length: 255 }),

	email: text("email", { length: 32 }).unique(),
	passwordHash: text("passwordHash", { length: 255 }),
	googleId: text("googleId", { length: 255 }).unique(),
	registerMethod: integer("registerMethod").notNull(),

	banned: integer("banned", { mode: "boolean" }).notNull().default(false),

	createdAt: integer("createdAt", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("updatedAt", { mode: "timestamp" })
		.notNull()
		.$onUpdate(() => new Date()),
});

export const characters = sqliteTable("Character", {
	id: integer("id").primaryKey(),
	name: text("name", { length: 32 }).notNull(),
	description: text("description", { length: 256 }),
	masterPrompt: text("masterPrompt", { length: 512 }).notNull(),
	image: text("image", { length: 255 }).notNull(),
	pfp: text("pfp", { length: 255 }).notNull(),

	likesCount: integer("likesCount").notNull().default(0),

	createdAt: integer("createdAt", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("updatedAt", { mode: "timestamp" })
		.notNull()
		.$onUpdate(() => new Date()),

	creatorId: integer("creatorId").references(() => users.id, {
		onDelete: "set null",
	}),
});

export const likes = sqliteTable(
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
