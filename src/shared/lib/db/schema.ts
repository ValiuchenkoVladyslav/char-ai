import "~/shared/lib/server-only";

import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { characterTable } from "~/modules/character/lib/table";
import { userTable } from "~/modules/user/lib/table";

export { userTable };
export { characterTable };

export const likeTable = pgTable(
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
