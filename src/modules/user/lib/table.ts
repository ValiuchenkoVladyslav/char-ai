import "server-only";

import {
  pgTable,
  serial,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { displayNameBounds, emailBounds, usernameBounds } from "./base";

export const userTable = pgTable("User", {
  id: serial("id").primaryKey(),
  displayName: varchar("displayName", {
    length: displayNameBounds.maxLen,
  }).notNull(),
  username: varchar("username", { length: usernameBounds.maxLen })
    .notNull()
    .unique(),
  pfp: varchar("pfp"),

  email: varchar("email", { length: emailBounds.maxLen }).unique().notNull(),
  passwordHash: varchar("passwordHash"),
  googleId: varchar("googleId").unique(),
  authMethod: smallint("authMethod").notNull(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});
