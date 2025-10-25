-- CreateTable
CREATE TABLE "EmployeeStatusHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT NOT NULL,
    "statusDate" DATETIME NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "changedBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeStatusHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "EmployeeStatusHistory_employeeId_idx" ON "EmployeeStatusHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeStatusHistory_statusDate_idx" ON "EmployeeStatusHistory"("statusDate");
