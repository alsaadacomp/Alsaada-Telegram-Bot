-- Remove separate name fields from Employee table
-- Keep only fullName and nickname

-- First, update existing records to ensure fullName is populated
UPDATE "HR_Employee" 
SET "fullName" = COALESCE("firstName", '') || 
                 CASE WHEN "secondName" IS NOT NULL THEN ' ' || "secondName" ELSE '' END ||
                 CASE WHEN "thirdName" IS NOT NULL THEN ' ' || "thirdName" ELSE '' END ||
                 CASE WHEN "lastName" IS NOT NULL THEN ' ' || "lastName" ELSE '' END
WHERE "fullName" IS NULL OR "fullName" = '';

-- Drop the index first
DROP INDEX IF EXISTS "HR_Employee_firstName_lastName_idx";

-- Drop the separate name fields
ALTER TABLE "HR_Employee" DROP COLUMN "firstName";
ALTER TABLE "HR_Employee" DROP COLUMN "firstNameEn";
ALTER TABLE "HR_Employee" DROP COLUMN "secondName";
ALTER TABLE "HR_Employee" DROP COLUMN "secondNameEn";
ALTER TABLE "HR_Employee" DROP COLUMN "thirdName";
ALTER TABLE "HR_Employee" DROP COLUMN "thirdNameEn";
ALTER TABLE "HR_Employee" DROP COLUMN "lastName";
ALTER TABLE "HR_Employee" DROP COLUMN "lastNameEn";
