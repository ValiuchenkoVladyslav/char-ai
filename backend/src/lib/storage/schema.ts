import {
  characterNameBase,
  descriptionBase,
  emailBase,
  promptBase,
  tagBase,
  userNameBase,
} from "@repo/schema";
import { type SQL, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const userTbl = pgTable(
  "User",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

    tag: varchar("tag", { length: tagBase.maxLen }).notNull().unique(),
    name: varchar("name", { length: userNameBase.maxLen }).notNull(),
    pfpUrl: varchar("pfpUrl"),

    email: varchar("email", { length: emailBase.maxLen }).notNull().unique(),
    passwordHash: varchar("passwordHash"),
    googleId: varchar("googleId").unique(),
    authMethod: smallint("authMethod").notNull(),
  },
  (table) => [
    uniqueIndex("userTagIdx").on(table.tag), // user lookups
  ],
);

export const sessionTbl = pgTable(
  "Session",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

    tokenHash: varchar("tokenHash").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),

    userId: integer("userId").references(() => userTbl.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    index("tokenHashIdx").on(table.userId, table.tokenHash), // session lookups
  ],
);

export const characterTbl = pgTable(
  "Character",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

    name: varchar("name", { length: characterNameBase.maxLen }).notNull(),
    phonetics: varchar("phonetics", { length: 32 })
      .generatedAlwaysAs((): SQL => sql`metaphone(${characterTbl.name}, 32)`)
      .notNull(),

    description: varchar("description", {
      length: descriptionBase.maxLen,
    }).notNull(),

    pfpUrl: varchar("pfpUrl").notNull(),
    coverImageUrl: varchar("coverImageUrl").notNull(),

    prompt: varchar("prompt", { length: promptBase.maxLen }).notNull(),

    creatorId: integer("creatorId").references(() => userTbl.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("phoneticsIdx").on(table.phonetics), // search happens by phonetics
  ],
);

export const likeTable = pgTable(
  "Like",
  {
    characterId: integer("characterId").references(() => characterTbl.id, {
      onDelete: "cascade",
    }),
    userId: integer("userId").references(() => userTbl.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.characterId, table.userId] }),

    index("characterIdIdx").on(table.characterId), // to count how many likes a character has
    index("userIdIdx").on(table.userId), // find out if character is liked by user, get all likes by user
  ],
);
