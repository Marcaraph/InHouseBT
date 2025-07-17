-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winner" TEXT,
    "messageId" TEXT,
    "channelId" TEXT,
    "createdBy" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Game" ("channelId", "createdAt", "id", "messageId", "winner") SELECT "channelId", "createdAt", "id", "messageId", "winner" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
