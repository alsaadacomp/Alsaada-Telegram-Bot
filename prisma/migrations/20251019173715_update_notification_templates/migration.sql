-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NotificationTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "variables" TEXT,
    "buttons" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NotificationTemplate_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NotificationTemplate" ("buttons", "createdAt", "id", "message", "name", "priority", "type", "updatedAt", "variables") SELECT "buttons", "createdAt", "id", "message", "name", "priority", "type", "updatedAt", "variables" FROM "NotificationTemplate";
DROP TABLE "NotificationTemplate";
ALTER TABLE "new_NotificationTemplate" RENAME TO "NotificationTemplate";
CREATE UNIQUE INDEX "NotificationTemplate_name_key" ON "NotificationTemplate"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
