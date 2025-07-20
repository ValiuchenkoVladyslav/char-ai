import "~/shared/lib/server-only";

import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type SQL, sql } from "drizzle-orm/sql";
import { userTable } from "~/modules/user/lib/table";
import { descriptionBounds, masterPromptBounds, nameBounds } from "./base";

export const characterTable = pgTable("Character", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: nameBounds.maxLen }).notNull(),
  phonetics: varchar("phonetics", { length: nameBounds.maxLen })
    .generatedAlwaysAs((): SQL => sql`metaphone(${characterTable.name}, 32)`) // 32 hardcoded because of errors
    .notNull(),

  description: varchar("description", {
    length: descriptionBounds.maxLen,
  }).notNull(),
  masterPrompt: varchar("masterPrompt", {
    length: masterPromptBounds.maxLen,
  }).notNull(),
  image: varchar("image").notNull(),
  pfp: varchar("pfp").notNull(),

  likesCount: integer("likesCount").notNull().default(0),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),

  creatorId: integer("creatorId").references(() => userTable.id, {
    onDelete: "set null",
  }),
});
