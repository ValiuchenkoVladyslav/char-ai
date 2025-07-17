import "server-only";

import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { characterTable } from "~/modules/character/server";
import { userTable } from "~/modules/user/server";

export { userTable };
export { characterTable };

export const like = pgTable(
  "Like",
  {
    characterId: integer("characterId")
      .notNull()
      .references(() => characterTable.id, {
        onDelete: "cascade",
      }),
    userId: integer("userId")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.characterId, table.userId] })],
);
