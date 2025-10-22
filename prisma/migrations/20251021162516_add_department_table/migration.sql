-- CreateTable
CREATE TABLE "HR_Department" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "managerId" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "HR_Department_code_key" ON "HR_Department"("code");

-- CreateIndex
CREATE INDEX "HR_Department_code_idx" ON "HR_Department"("code");

-- CreateIndex
CREATE INDEX "HR_Department_isActive_idx" ON "HR_Department"("isActive");

-- CreateIndex
CREATE INDEX "HR_Department_orderIndex_idx" ON "HR_Department"("orderIndex");

-- CreateIndex
CREATE INDEX "HR_Department_name_idx" ON "HR_Department"("name");

-- CreateIndex
CREATE INDEX "HR_Department_createdAt_idx" ON "HR_Department"("createdAt");
