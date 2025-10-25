/*
  Warnings:

  - You are about to alter the column `changedBy` on the `EmployeeStatusHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- CreateTable
CREATE TABLE "EmployeePositionHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "oldPositionId" INTEGER,
    "newPositionId" INTEGER NOT NULL,
    "oldPositionName" TEXT,
    "newPositionName" TEXT NOT NULL,
    "changeDate" DATETIME NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "changedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeePositionHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeCodeHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "oldCode" TEXT,
    "newCode" TEXT NOT NULL,
    "changeDate" DATETIME NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "changedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeCodeHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeSalaryHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "oldBasicSalary" REAL,
    "newBasicSalary" REAL NOT NULL,
    "oldAllowances" REAL,
    "newAllowances" REAL,
    "oldTotalSalary" REAL,
    "newTotalSalary" REAL NOT NULL,
    "changeDate" DATETIME NOT NULL,
    "effectiveDate" DATETIME,
    "reason" TEXT,
    "increasePercent" REAL,
    "notes" TEXT,
    "changedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeSalaryHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeDepartmentHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "oldDepartmentId" INTEGER,
    "newDepartmentId" INTEGER NOT NULL,
    "oldDepartmentName" TEXT,
    "newDepartmentName" TEXT NOT NULL,
    "transferDate" DATETIME NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "changedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeDepartmentHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeFinancialTransactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "transactionDate" DATETIME NOT NULL,
    "description" TEXT,
    "referenceId" INTEGER,
    "referenceType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "notes" TEXT,
    "createdBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeFinancialTransactions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeAdvanceHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "requestDate" DATETIME NOT NULL,
    "approvalDate" DATETIME,
    "approvedBy" INTEGER,
    "approvalStatus" TEXT NOT NULL,
    "rejectionReason" TEXT,
    "deductionStartDate" DATETIME,
    "monthlyDeduction" REAL,
    "totalDeducted" REAL DEFAULT 0,
    "remainingBalance" REAL,
    "isPaidOff" BOOLEAN NOT NULL DEFAULT false,
    "paidOffDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeAdvanceHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeePayrollHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "basicSalary" REAL NOT NULL,
    "housingAllowance" REAL NOT NULL DEFAULT 0,
    "transportAllowance" REAL NOT NULL DEFAULT 0,
    "foodAllowance" REAL NOT NULL DEFAULT 0,
    "fieldAllowance" REAL NOT NULL DEFAULT 0,
    "otherAllowances" REAL NOT NULL DEFAULT 0,
    "bonuses" REAL NOT NULL DEFAULT 0,
    "grossSalary" REAL NOT NULL,
    "advanceDeductions" REAL NOT NULL DEFAULT 0,
    "penalties" REAL NOT NULL DEFAULT 0,
    "absenceDeductions" REAL NOT NULL DEFAULT 0,
    "taxDeductions" REAL NOT NULL DEFAULT 0,
    "insuranceDeductions" REAL NOT NULL DEFAULT 0,
    "otherDeductions" REAL NOT NULL DEFAULT 0,
    "totalDeductions" REAL NOT NULL,
    "netSalary" REAL NOT NULL,
    "paymentDate" DATETIME,
    "paymentMethod" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeePayrollHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeAllowanceHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "allowanceType" TEXT NOT NULL,
    "oldAmount" REAL,
    "newAmount" REAL NOT NULL,
    "changeDate" DATETIME NOT NULL,
    "effectiveDate" DATETIME,
    "reason" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "changedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeAllowanceHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeDeductionHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "deductionType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "deductionDate" DATETIME NOT NULL,
    "reason" TEXT,
    "referenceId" INTEGER,
    "referenceType" TEXT,
    "isRecovered" BOOLEAN NOT NULL DEFAULT false,
    "recoveredDate" DATETIME,
    "notes" TEXT,
    "appliedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeDeductionHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeWorkCycleHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "oldWorkDaysPerCycle" INTEGER,
    "newWorkDaysPerCycle" INTEGER NOT NULL,
    "oldLeaveDaysPerCycle" INTEGER,
    "newLeaveDaysPerCycle" INTEGER NOT NULL,
    "changeDate" DATETIME NOT NULL,
    "effectiveDate" DATETIME,
    "reason" TEXT,
    "notes" TEXT,
    "changedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeWorkCycleHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeCycleLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "cycleNumber" INTEGER NOT NULL,
    "cycleType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "plannedDays" INTEGER NOT NULL,
    "actualDays" INTEGER NOT NULL,
    "wasInterrupted" BOOLEAN NOT NULL DEFAULT false,
    "interruptionDays" INTEGER DEFAULT 0,
    "completionStatus" TEXT NOT NULL DEFAULT 'completed',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeCycleLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeLeaveHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "leaveType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "requestDate" DATETIME,
    "approvalDate" DATETIME,
    "approvedBy" INTEGER,
    "approvalStatus" TEXT NOT NULL DEFAULT 'approved',
    "rejectionReason" TEXT,
    "replacementId" INTEGER,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "returnDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeLeaveHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeLeaveBalance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "annualLeaveBalance" INTEGER NOT NULL DEFAULT 21,
    "sickLeaveBalance" INTEGER NOT NULL DEFAULT 180,
    "casualLeaveBalance" INTEGER NOT NULL DEFAULT 7,
    "usedAnnualLeave" INTEGER NOT NULL DEFAULT 0,
    "usedSickLeave" INTEGER NOT NULL DEFAULT 0,
    "usedCasualLeave" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" DATETIME NOT NULL,
    "yearStartDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeLeaveBalance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeCycleInterruptions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "cycleLogId" INTEGER,
    "interruptionType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "reason" TEXT,
    "wasApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" INTEGER,
    "approvalDate" DATETIME,
    "compensationDays" INTEGER DEFAULT 0,
    "isCompensated" BOOLEAN NOT NULL DEFAULT false,
    "compensationDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeCycleInterruptions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeContactHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT NOT NULL,
    "changeDate" DATETIME NOT NULL,
    "reason" TEXT,
    "verificationStatus" TEXT,
    "verifiedBy" INTEGER,
    "verificationDate" DATETIME,
    "notes" TEXT,
    "changedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeContactHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeDocumentHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentUrl" TEXT,
    "uploadDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "replacedBy" INTEGER,
    "notes" TEXT,
    "uploadedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeDocumentHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeDataChangeLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" INTEGER,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changeType" TEXT NOT NULL,
    "changeDate" DATETIME NOT NULL,
    "reason" TEXT,
    "changedBy" BIGINT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeDataChangeLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeePerformanceHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "evaluationDate" DATETIME NOT NULL,
    "evaluationType" TEXT NOT NULL,
    "overallRating" REAL NOT NULL,
    "maxRating" REAL NOT NULL DEFAULT 5,
    "qualityScore" REAL,
    "productivityScore" REAL,
    "attendanceScore" REAL,
    "teamworkScore" REAL,
    "leadershipScore" REAL,
    "evaluatorId" INTEGER,
    "evaluatorName" TEXT,
    "strengths" TEXT,
    "weaknesses" TEXT,
    "recommendations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "approvedBy" INTEGER,
    "approvalDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeePerformanceHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeTrainingHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "trainingTitle" TEXT NOT NULL,
    "trainingType" TEXT NOT NULL,
    "provider" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "duration" INTEGER,
    "location" TEXT,
    "cost" REAL DEFAULT 0,
    "currency" TEXT DEFAULT 'EGP',
    "status" TEXT NOT NULL DEFAULT 'completed',
    "certificateUrl" TEXT,
    "grade" TEXT,
    "skillsGained" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeTrainingHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeDisciplinaryHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "actionType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "violationType" TEXT NOT NULL,
    "incidentDate" DATETIME NOT NULL,
    "issueDate" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "penaltyAmount" REAL DEFAULT 0,
    "suspensionDays" INTEGER,
    "issuedBy" INTEGER,
    "witnessIds" TEXT,
    "appealStatus" TEXT,
    "appealDate" DATETIME,
    "appealNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiryDate" DATETIME,
    "documentUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeDisciplinaryHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeAuditLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventCategory" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "oldData" TEXT,
    "newData" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "eventDate" DATETIME NOT NULL,
    "performedBy" BIGINT,
    "affectedTables" TEXT,
    "referenceId" INTEGER,
    "referenceType" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeAuditLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmployeeStatusHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT NOT NULL,
    "statusDate" DATETIME NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "changedBy" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeStatusHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmployeeStatusHistory" ("changedBy", "createdAt", "employeeId", "id", "newStatus", "notes", "oldStatus", "reason", "statusDate") SELECT "changedBy", "createdAt", "employeeId", "id", "newStatus", "notes", "oldStatus", "reason", "statusDate" FROM "EmployeeStatusHistory";
DROP TABLE "EmployeeStatusHistory";
ALTER TABLE "new_EmployeeStatusHistory" RENAME TO "EmployeeStatusHistory";
CREATE INDEX "EmployeeStatusHistory_employeeId_idx" ON "EmployeeStatusHistory"("employeeId");
CREATE INDEX "EmployeeStatusHistory_statusDate_idx" ON "EmployeeStatusHistory"("statusDate");
CREATE INDEX "EmployeeStatusHistory_newStatus_idx" ON "EmployeeStatusHistory"("newStatus");
CREATE INDEX "EmployeeStatusHistory_changedBy_idx" ON "EmployeeStatusHistory"("changedBy");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "EmployeePositionHistory_employeeId_idx" ON "EmployeePositionHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeePositionHistory_changeDate_idx" ON "EmployeePositionHistory"("changeDate");

-- CreateIndex
CREATE INDEX "EmployeePositionHistory_oldPositionId_idx" ON "EmployeePositionHistory"("oldPositionId");

-- CreateIndex
CREATE INDEX "EmployeePositionHistory_newPositionId_idx" ON "EmployeePositionHistory"("newPositionId");

-- CreateIndex
CREATE INDEX "EmployeeCodeHistory_employeeId_idx" ON "EmployeeCodeHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeCodeHistory_changeDate_idx" ON "EmployeeCodeHistory"("changeDate");

-- CreateIndex
CREATE INDEX "EmployeeCodeHistory_oldCode_idx" ON "EmployeeCodeHistory"("oldCode");

-- CreateIndex
CREATE INDEX "EmployeeCodeHistory_newCode_idx" ON "EmployeeCodeHistory"("newCode");

-- CreateIndex
CREATE INDEX "EmployeeSalaryHistory_employeeId_idx" ON "EmployeeSalaryHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeSalaryHistory_changeDate_idx" ON "EmployeeSalaryHistory"("changeDate");

-- CreateIndex
CREATE INDEX "EmployeeSalaryHistory_effectiveDate_idx" ON "EmployeeSalaryHistory"("effectiveDate");

-- CreateIndex
CREATE INDEX "EmployeeDepartmentHistory_employeeId_idx" ON "EmployeeDepartmentHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeDepartmentHistory_transferDate_idx" ON "EmployeeDepartmentHistory"("transferDate");

-- CreateIndex
CREATE INDEX "EmployeeDepartmentHistory_oldDepartmentId_idx" ON "EmployeeDepartmentHistory"("oldDepartmentId");

-- CreateIndex
CREATE INDEX "EmployeeDepartmentHistory_newDepartmentId_idx" ON "EmployeeDepartmentHistory"("newDepartmentId");

-- CreateIndex
CREATE INDEX "EmployeeFinancialTransactions_employeeId_idx" ON "EmployeeFinancialTransactions"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeFinancialTransactions_transactionDate_idx" ON "EmployeeFinancialTransactions"("transactionDate");

-- CreateIndex
CREATE INDEX "EmployeeFinancialTransactions_transactionType_idx" ON "EmployeeFinancialTransactions"("transactionType");

-- CreateIndex
CREATE INDEX "EmployeeFinancialTransactions_status_idx" ON "EmployeeFinancialTransactions"("status");

-- CreateIndex
CREATE INDEX "EmployeeFinancialTransactions_referenceId_idx" ON "EmployeeFinancialTransactions"("referenceId");

-- CreateIndex
CREATE INDEX "EmployeeAdvanceHistory_employeeId_idx" ON "EmployeeAdvanceHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeAdvanceHistory_requestDate_idx" ON "EmployeeAdvanceHistory"("requestDate");

-- CreateIndex
CREATE INDEX "EmployeeAdvanceHistory_approvalStatus_idx" ON "EmployeeAdvanceHistory"("approvalStatus");

-- CreateIndex
CREATE INDEX "EmployeeAdvanceHistory_isPaidOff_idx" ON "EmployeeAdvanceHistory"("isPaidOff");

-- CreateIndex
CREATE INDEX "EmployeePayrollHistory_employeeId_idx" ON "EmployeePayrollHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeePayrollHistory_month_year_idx" ON "EmployeePayrollHistory"("month", "year");

-- CreateIndex
CREATE INDEX "EmployeePayrollHistory_paymentStatus_idx" ON "EmployeePayrollHistory"("paymentStatus");

-- CreateIndex
CREATE INDEX "EmployeePayrollHistory_paymentDate_idx" ON "EmployeePayrollHistory"("paymentDate");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeePayrollHistory_employeeId_month_year_key" ON "EmployeePayrollHistory"("employeeId", "month", "year");

-- CreateIndex
CREATE INDEX "EmployeeAllowanceHistory_employeeId_idx" ON "EmployeeAllowanceHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeAllowanceHistory_changeDate_idx" ON "EmployeeAllowanceHistory"("changeDate");

-- CreateIndex
CREATE INDEX "EmployeeAllowanceHistory_allowanceType_idx" ON "EmployeeAllowanceHistory"("allowanceType");

-- CreateIndex
CREATE INDEX "EmployeeAllowanceHistory_effectiveDate_idx" ON "EmployeeAllowanceHistory"("effectiveDate");

-- CreateIndex
CREATE INDEX "EmployeeDeductionHistory_employeeId_idx" ON "EmployeeDeductionHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeDeductionHistory_deductionDate_idx" ON "EmployeeDeductionHistory"("deductionDate");

-- CreateIndex
CREATE INDEX "EmployeeDeductionHistory_deductionType_idx" ON "EmployeeDeductionHistory"("deductionType");

-- CreateIndex
CREATE INDEX "EmployeeDeductionHistory_isRecovered_idx" ON "EmployeeDeductionHistory"("isRecovered");

-- CreateIndex
CREATE INDEX "EmployeeWorkCycleHistory_employeeId_idx" ON "EmployeeWorkCycleHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeWorkCycleHistory_changeDate_idx" ON "EmployeeWorkCycleHistory"("changeDate");

-- CreateIndex
CREATE INDEX "EmployeeWorkCycleHistory_effectiveDate_idx" ON "EmployeeWorkCycleHistory"("effectiveDate");

-- CreateIndex
CREATE INDEX "EmployeeCycleLog_employeeId_idx" ON "EmployeeCycleLog"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeCycleLog_cycleNumber_idx" ON "EmployeeCycleLog"("cycleNumber");

-- CreateIndex
CREATE INDEX "EmployeeCycleLog_startDate_endDate_idx" ON "EmployeeCycleLog"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "EmployeeCycleLog_cycleType_idx" ON "EmployeeCycleLog"("cycleType");

-- CreateIndex
CREATE INDEX "EmployeeCycleLog_completionStatus_idx" ON "EmployeeCycleLog"("completionStatus");

-- CreateIndex
CREATE INDEX "EmployeeLeaveHistory_employeeId_idx" ON "EmployeeLeaveHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeLeaveHistory_startDate_endDate_idx" ON "EmployeeLeaveHistory"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "EmployeeLeaveHistory_leaveType_idx" ON "EmployeeLeaveHistory"("leaveType");

-- CreateIndex
CREATE INDEX "EmployeeLeaveHistory_approvalStatus_idx" ON "EmployeeLeaveHistory"("approvalStatus");

-- CreateIndex
CREATE INDEX "EmployeeLeaveHistory_isCompleted_idx" ON "EmployeeLeaveHistory"("isCompleted");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeLeaveBalance_employeeId_key" ON "EmployeeLeaveBalance"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeLeaveBalance_employeeId_idx" ON "EmployeeLeaveBalance"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeLeaveBalance_lastUpdated_idx" ON "EmployeeLeaveBalance"("lastUpdated");

-- CreateIndex
CREATE INDEX "EmployeeCycleInterruptions_employeeId_idx" ON "EmployeeCycleInterruptions"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeCycleInterruptions_startDate_endDate_idx" ON "EmployeeCycleInterruptions"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "EmployeeCycleInterruptions_interruptionType_idx" ON "EmployeeCycleInterruptions"("interruptionType");

-- CreateIndex
CREATE INDEX "EmployeeCycleInterruptions_isCompensated_idx" ON "EmployeeCycleInterruptions"("isCompensated");

-- CreateIndex
CREATE INDEX "EmployeeContactHistory_employeeId_idx" ON "EmployeeContactHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeContactHistory_changeDate_idx" ON "EmployeeContactHistory"("changeDate");

-- CreateIndex
CREATE INDEX "EmployeeContactHistory_fieldName_idx" ON "EmployeeContactHistory"("fieldName");

-- CreateIndex
CREATE INDEX "EmployeeContactHistory_verificationStatus_idx" ON "EmployeeContactHistory"("verificationStatus");

-- CreateIndex
CREATE INDEX "EmployeeDocumentHistory_employeeId_idx" ON "EmployeeDocumentHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeDocumentHistory_documentType_idx" ON "EmployeeDocumentHistory"("documentType");

-- CreateIndex
CREATE INDEX "EmployeeDocumentHistory_uploadDate_idx" ON "EmployeeDocumentHistory"("uploadDate");

-- CreateIndex
CREATE INDEX "EmployeeDocumentHistory_status_idx" ON "EmployeeDocumentHistory"("status");

-- CreateIndex
CREATE INDEX "EmployeeDocumentHistory_expiryDate_idx" ON "EmployeeDocumentHistory"("expiryDate");

-- CreateIndex
CREATE INDEX "EmployeeDataChangeLog_employeeId_idx" ON "EmployeeDataChangeLog"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeDataChangeLog_changeDate_idx" ON "EmployeeDataChangeLog"("changeDate");

-- CreateIndex
CREATE INDEX "EmployeeDataChangeLog_tableName_idx" ON "EmployeeDataChangeLog"("tableName");

-- CreateIndex
CREATE INDEX "EmployeeDataChangeLog_fieldName_idx" ON "EmployeeDataChangeLog"("fieldName");

-- CreateIndex
CREATE INDEX "EmployeeDataChangeLog_changeType_idx" ON "EmployeeDataChangeLog"("changeType");

-- CreateIndex
CREATE INDEX "EmployeeDataChangeLog_changedBy_idx" ON "EmployeeDataChangeLog"("changedBy");

-- CreateIndex
CREATE INDEX "EmployeePerformanceHistory_employeeId_idx" ON "EmployeePerformanceHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeePerformanceHistory_evaluationDate_idx" ON "EmployeePerformanceHistory"("evaluationDate");

-- CreateIndex
CREATE INDEX "EmployeePerformanceHistory_evaluationType_idx" ON "EmployeePerformanceHistory"("evaluationType");

-- CreateIndex
CREATE INDEX "EmployeePerformanceHistory_status_idx" ON "EmployeePerformanceHistory"("status");

-- CreateIndex
CREATE INDEX "EmployeeTrainingHistory_employeeId_idx" ON "EmployeeTrainingHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeTrainingHistory_startDate_idx" ON "EmployeeTrainingHistory"("startDate");

-- CreateIndex
CREATE INDEX "EmployeeTrainingHistory_trainingType_idx" ON "EmployeeTrainingHistory"("trainingType");

-- CreateIndex
CREATE INDEX "EmployeeTrainingHistory_status_idx" ON "EmployeeTrainingHistory"("status");

-- CreateIndex
CREATE INDEX "EmployeeDisciplinaryHistory_employeeId_idx" ON "EmployeeDisciplinaryHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeDisciplinaryHistory_incidentDate_idx" ON "EmployeeDisciplinaryHistory"("incidentDate");

-- CreateIndex
CREATE INDEX "EmployeeDisciplinaryHistory_actionType_idx" ON "EmployeeDisciplinaryHistory"("actionType");

-- CreateIndex
CREATE INDEX "EmployeeDisciplinaryHistory_severity_idx" ON "EmployeeDisciplinaryHistory"("severity");

-- CreateIndex
CREATE INDEX "EmployeeDisciplinaryHistory_violationType_idx" ON "EmployeeDisciplinaryHistory"("violationType");

-- CreateIndex
CREATE INDEX "EmployeeDisciplinaryHistory_isActive_idx" ON "EmployeeDisciplinaryHistory"("isActive");

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_employeeId_idx" ON "EmployeeAuditLog"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_eventDate_idx" ON "EmployeeAuditLog"("eventDate");

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_eventType_idx" ON "EmployeeAuditLog"("eventType");

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_eventCategory_idx" ON "EmployeeAuditLog"("eventCategory");

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_severity_idx" ON "EmployeeAuditLog"("severity");

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_performedBy_idx" ON "EmployeeAuditLog"("performedBy");
