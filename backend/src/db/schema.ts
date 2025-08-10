import {
  characterNameBase,
  descriptionBase,
  emailBase,
  masterPromptBase,
  tagBase,
  userNameBase,
} from "@repo/schema";
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  smallint,
  varchar,
} from "drizzle-orm/pg-core";
import { type SQL, sql } from "drizzle-orm/sql";

export const userTbl = pgTable("User", {
  id: serial("id").primaryKey(),

  tag: varchar("tag", { length: tagBase.maxLen }).notNull().unique(),
  name: varchar("name", { length: userNameBase.maxLen }).notNull(),
  pfp: varchar("pfp"),

  email: varchar("email", { length: emailBase.maxLen }).unique().notNull(),
  passwordHash: varchar("passwordHash"),
  googleId: varchar("googleId").unique(),
  authMethod: smallint("authMethod").notNull(),
});

export const characterTbl = pgTable("Character", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: characterNameBase.maxLen }).notNull(),
  phonetics: varchar("phonetics", { length: characterNameBase.maxLen })
    .generatedAlwaysAs(
      (): SQL =>
        sql`metaphone(${characterTbl.name}, ${characterNameBase.maxLen}::int)`,
    )
    .notNull(),

  description: varchar("description", {
    length: descriptionBase.maxLen,
  }).notNull(),
  masterPrompt: varchar("masterPrompt", {
    length: masterPromptBase.maxLen,
  }).notNull(),
  image: varchar("image").notNull(),
  pfp: varchar("pfp").notNull(),

  likesCount: integer("likesCount").notNull().default(0),

  creatorId: integer("creatorId").references(() => userTbl.id, {
    onDelete: "set null",
  }),
});

export const likeTable = pgTable(
  "Like",
  {
    characterId: integer("characterId")
      .notNull()
      .references(() => characterTbl.id, {
        onDelete: "cascade",
      }),
    userId: integer("userId")
      .notNull()
      .references(() => userTbl.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.characterId, table.userId] })],
);
