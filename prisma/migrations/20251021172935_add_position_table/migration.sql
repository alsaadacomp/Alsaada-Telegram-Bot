-- CreateTable
CREATE TABLE "HR_Position" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "departmentId" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "HR_Position_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "HR_Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HR_Position_code_key" ON "HR_Position"("code");

-- CreateIndex
CREATE INDEX "HR_Position_code_idx" ON "HR_Position"("code");

-- CreateIndex
CREATE INDEX "HR_Position_departmentId_idx" ON "HR_Position"("departmentId");

-- CreateIndex
CREATE INDEX "HR_Position_isActive_idx" ON "HR_Position"("isActive");

-- CreateIndex
CREATE INDEX "HR_Position_title_idx" ON "HR_Position"("title");

-- CreateIndex
CREATE INDEX "HR_Position_titleAr_idx" ON "HR_Position"("titleAr");

-- CreateIndex
CREATE INDEX "HR_Position_createdAt_idx" ON "HR_Position"("createdAt");
