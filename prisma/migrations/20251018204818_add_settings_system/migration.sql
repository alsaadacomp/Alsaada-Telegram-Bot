-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'GLOBAL',
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "type" TEXT NOT NULL,
    "userId" INTEGER,
    "featureId" TEXT,
    "description" TEXT,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" INTEGER
);

-- CreateTable
CREATE TABLE "SettingHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settingId" INTEGER NOT NULL,
    "settingKey" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT NOT NULL,
    "changedBy" INTEGER,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SettingHistory_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "Setting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Setting_key_idx" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_scope_idx" ON "Setting"("scope");

-- CreateIndex
CREATE INDEX "Setting_category_idx" ON "Setting"("category");

-- CreateIndex
CREATE INDEX "Setting_userId_idx" ON "Setting"("userId");

-- CreateIndex
CREATE INDEX "Setting_featureId_idx" ON "Setting"("featureId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_scope_userId_featureId_key" ON "Setting"("key", "scope", "userId", "featureId");

-- CreateIndex
CREATE INDEX "SettingHistory_settingId_idx" ON "SettingHistory"("settingId");

-- CreateIndex
CREATE INDEX "SettingHistory_settingKey_idx" ON "SettingHistory"("settingKey");

-- CreateIndex
CREATE INDEX "SettingHistory_changedBy_idx" ON "SettingHistory"("changedBy");

-- CreateIndex
CREATE INDEX "SettingHistory_createdAt_idx" ON "SettingHistory"("createdAt");
