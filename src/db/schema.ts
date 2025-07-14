import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export enum RegisterMethod {
  EmailAndPassword = 0,
  GoogleId = 1,
  Both = 2,
}

export const user = pgTable("User", {
  id: integer("id").primaryKey(),
  displayName: varchar("displayName", { length: 32 }).notNull(),
  username: varchar("username", { length: 24 }).notNull().unique(),
  pfp: varchar("pfp", { length: 255 }),

  email: varchar("email", { length: 32 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  googleId: varchar("googleId", { length: 255 }).unique(),
  registerMethod: smallint("registerMethod").notNull(),

  banned: boolean("banned").notNull().default(false),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const character = pgTable("Character", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 32 }).notNull(),
  phonetics: varchar("phonetics").notNull(),
  description: varchar("description", { length: 256 }),
  masterPrompt: varchar("masterPrompt", { length: 512 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  pfp: varchar("pfp", { length: 255 }).notNull(),

  likesCount: integer("likesCount").notNull().default(0),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),

  creatorId: integer("creatorId").references(() => user.id, {
    onDelete: "set null",
  }),
});

export const like = pgTable(
  "Like",
  {
    characterId: integer("characterId")
      .notNull()
      .references(() => character.id, {
        onDelete: "cascade",
      }),
    userId: integer("userId")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.characterId, table.userId] })],
);
