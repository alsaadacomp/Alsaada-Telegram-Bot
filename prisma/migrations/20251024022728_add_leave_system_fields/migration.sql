-- AlterTable
ALTER TABLE "HR_Employee" ADD COLUMN "currentLeaveDays" INTEGER DEFAULT 0;
ALTER TABLE "HR_Employee" ADD COLUMN "currentWorkDays" INTEGER DEFAULT 0;
ALTER TABLE "HR_Employee" ADD COLUMN "lastLeaveEndDate" DATETIME;
ALTER TABLE "HR_Employee" ADD COLUMN "lastLeaveStartDate" DATETIME;
ALTER TABLE "HR_Employee" ADD COLUMN "leaveDaysPerCycle" INTEGER;
ALTER TABLE "HR_Employee" ADD COLUMN "nextLeaveEndDate" DATETIME;
ALTER TABLE "HR_Employee" ADD COLUMN "nextLeaveStartDate" DATETIME;
ALTER TABLE "HR_Employee" ADD COLUMN "workDaysPerCycle" INTEGER;

-- AlterTable
ALTER TABLE "HR_Position" ADD COLUMN "defaultLeaveDaysPerCycle" INTEGER;
ALTER TABLE "HR_Position" ADD COLUMN "defaultWorkDaysPerCycle" INTEGER;
