-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'GLOBAL',
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "type" TEXT NOT NULL,
    "userId" INTEGER DEFAULT 0,
    "featureId" TEXT DEFAULT '',
    "description" TEXT,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" INTEGER
);
INSERT INTO "new_Setting" ("category", "createdAt", "description", "featureId", "id", "isSecret", "key", "scope", "type", "updatedAt", "updatedBy", "userId", "value") SELECT "category", "createdAt", "description", "featureId", "id", "isSecret", "key", "scope", "type", "updatedAt", "updatedBy", "userId", "value" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
CREATE INDEX "Setting_key_idx" ON "Setting"("key");
CREATE INDEX "Setting_scope_idx" ON "Setting"("scope");
CREATE INDEX "Setting_category_idx" ON "Setting"("category");
CREATE INDEX "Setting_userId_idx" ON "Setting"("userId");
CREATE INDEX "Setting_featureId_idx" ON "Setting"("featureId");
CREATE UNIQUE INDEX "Setting_key_scope_userId_featureId_key" ON "Setting"("key", "scope", "userId", "featureId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
