-- CreateTable
CREATE TABLE "HR_WorkRotation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "rotationType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "location" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HR_WorkRotation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HR_EmployeeLeave" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "leaveType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "replacementId" INTEGER,
    "approvedBy" INTEGER,
    "approvedAt" DATETIME,
    "rejectionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HR_EmployeeLeave_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HR_EmployeeLeave_replacementId_fkey" FOREIGN KEY ("replacementId") REFERENCES "HR_Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HR_EmployeeAdvance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "reason" TEXT,
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending',
    "approvedBy" INTEGER,
    "approvedAt" DATETIME,
    "deductionStartDate" DATETIME,
    "monthlyDeduction" REAL,
    "remainingBalance" REAL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HR_EmployeeAdvance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HR_MonthlyPayroll" (
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
    "advances" REAL NOT NULL DEFAULT 0,
    "penalties" REAL NOT NULL DEFAULT 0,
    "absences" REAL NOT NULL DEFAULT 0,
    "otherDeductions" REAL NOT NULL DEFAULT 0,
    "grossSalary" REAL NOT NULL,
    "totalDeductions" REAL NOT NULL,
    "netSalary" REAL NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentDate" DATETIME,
    "paymentMethod" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HR_MonthlyPayroll_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HR_AttendanceException" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "exceptionType" TEXT NOT NULL,
    "hours" REAL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approvedBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HR_AttendanceException_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HR_Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "firstNameEn" TEXT,
    "secondName" TEXT,
    "secondNameEn" TEXT,
    "thirdName" TEXT,
    "thirdNameEn" TEXT,
    "lastName" TEXT NOT NULL,
    "lastNameEn" TEXT,
    "fullName" TEXT NOT NULL,
    "fullNameEn" TEXT,
    "nationalId" TEXT NOT NULL,
    "passportNumber" TEXT,
    "gender" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "placeOfBirth" TEXT,
    "nationality" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "religion" TEXT,
    "bloodType" TEXT,
    "personalEmail" TEXT,
    "workEmail" TEXT,
    "personalPhone" TEXT NOT NULL,
    "workPhone" TEXT,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "emergencyContactRelation" TEXT,
    "currentAddress" TEXT NOT NULL,
    "currentAddressEn" TEXT,
    "permanentAddress" TEXT,
    "governorateId" INTEGER,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Egypt',
    "postalCode" TEXT,
    "companyId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "positionId" INTEGER NOT NULL,
    "employmentType" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "hireDate" DATETIME NOT NULL,
    "confirmationDate" DATETIME,
    "resignationDate" DATETIME,
    "terminationDate" DATETIME,
    "terminationReason" TEXT,
    "basicSalary" REAL NOT NULL,
    "allowances" REAL DEFAULT 0,
    "totalSalary" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "paymentMethod" TEXT NOT NULL DEFAULT 'BANK_TRANSFER',
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "iban" TEXT,
    "socialInsuranceNumber" TEXT,
    "taxNumber" TEXT,
    "insuranceStartDate" DATETIME,
    "directManagerId" INTEGER,
    "workSchedule" TEXT,
    "workLocation" TEXT,
    "isFieldWorker" BOOLEAN NOT NULL DEFAULT true,
    "rotationSchedule" TEXT,
    "fieldAllowanceRate" REAL DEFAULT 0,
    "housingAllowance" REAL DEFAULT 0,
    "transportAllowance" REAL DEFAULT 0,
    "foodAllowance" REAL DEFAULT 0,
    "currentRotationId" INTEGER,
    "lastRotationEndDate" DATETIME,
    "nextRotationStartDate" DATETIME,
    "educationLevel" TEXT,
    "major" TEXT,
    "university" TEXT,
    "graduationYear" INTEGER,
    "certifications" TEXT,
    "skills" TEXT,
    "previousExperience" TEXT,
    "yearsOfExperience" INTEGER DEFAULT 0,
    "profilePhoto" TEXT,
    "cv" TEXT,
    "documents" TEXT,
    "annualLeaveBalance" INTEGER NOT NULL DEFAULT 21,
    "sickLeaveBalance" INTEGER NOT NULL DEFAULT 180,
    "casualLeaveBalance" INTEGER NOT NULL DEFAULT 7,
    "attendanceRequired" BOOLEAN NOT NULL DEFAULT false,
    "fingerprintId" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "HR_Employee_governorateId_fkey" FOREIGN KEY ("governorateId") REFERENCES "Location_Governorate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "HR_Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "HR_Position" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_directManagerId_fkey" FOREIGN KEY ("directManagerId") REFERENCES "HR_Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_HR_Employee" ("allowances", "annualLeaveBalance", "attendanceRequired", "bankAccountNumber", "bankName", "basicSalary", "bloodType", "casualLeaveBalance", "certifications", "city", "companyId", "confirmationDate", "contractType", "country", "createdAt", "createdBy", "currency", "currentAddress", "currentAddressEn", "cv", "dateOfBirth", "departmentId", "directManagerId", "documents", "educationLevel", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation", "employeeCode", "employmentStatus", "employmentType", "fingerprintId", "firstName", "firstNameEn", "fullName", "fullNameEn", "gender", "governorateId", "graduationYear", "hireDate", "iban", "id", "insuranceStartDate", "isActive", "lastName", "lastNameEn", "major", "maritalStatus", "nationalId", "nationality", "notes", "passportNumber", "paymentMethod", "permanentAddress", "personalEmail", "personalPhone", "placeOfBirth", "positionId", "postalCode", "previousExperience", "profilePhoto", "region", "religion", "resignationDate", "secondName", "secondNameEn", "sickLeaveBalance", "skills", "socialInsuranceNumber", "taxNumber", "terminationDate", "terminationReason", "thirdName", "thirdNameEn", "totalSalary", "university", "updatedAt", "updatedBy", "workEmail", "workLocation", "workPhone", "workSchedule", "yearsOfExperience") SELECT "allowances", "annualLeaveBalance", "attendanceRequired", "bankAccountNumber", "bankName", "basicSalary", "bloodType", "casualLeaveBalance", "certifications", "city", "companyId", "confirmationDate", "contractType", "country", "createdAt", "createdBy", "currency", "currentAddress", "currentAddressEn", "cv", "dateOfBirth", "departmentId", "directManagerId", "documents", "educationLevel", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation", "employeeCode", "employmentStatus", "employmentType", "fingerprintId", "firstName", "firstNameEn", "fullName", "fullNameEn", "gender", "governorateId", "graduationYear", "hireDate", "iban", "id", "insuranceStartDate", "isActive", "lastName", "lastNameEn", "major", "maritalStatus", "nationalId", "nationality", "notes", "passportNumber", "paymentMethod", "permanentAddress", "personalEmail", "personalPhone", "placeOfBirth", "positionId", "postalCode", "previousExperience", "profilePhoto", "region", "religion", "resignationDate", "secondName", "secondNameEn", "sickLeaveBalance", "skills", "socialInsuranceNumber", "taxNumber", "terminationDate", "terminationReason", "thirdName", "thirdNameEn", "totalSalary", "university", "updatedAt", "updatedBy", "workEmail", "workLocation", "workPhone", "workSchedule", "yearsOfExperience" FROM "HR_Employee";
DROP TABLE "HR_Employee";
ALTER TABLE "new_HR_Employee" RENAME TO "HR_Employee";
CREATE UNIQUE INDEX "HR_Employee_employeeCode_key" ON "HR_Employee"("employeeCode");
CREATE UNIQUE INDEX "HR_Employee_nationalId_key" ON "HR_Employee"("nationalId");
CREATE INDEX "HR_Employee_employeeCode_idx" ON "HR_Employee"("employeeCode");
CREATE INDEX "HR_Employee_nationalId_idx" ON "HR_Employee"("nationalId");
CREATE INDEX "HR_Employee_companyId_idx" ON "HR_Employee"("companyId");
CREATE INDEX "HR_Employee_departmentId_idx" ON "HR_Employee"("departmentId");
CREATE INDEX "HR_Employee_positionId_idx" ON "HR_Employee"("positionId");
CREATE INDEX "HR_Employee_directManagerId_idx" ON "HR_Employee"("directManagerId");
CREATE INDEX "HR_Employee_employmentStatus_idx" ON "HR_Employee"("employmentStatus");
CREATE INDEX "HR_Employee_employmentType_idx" ON "HR_Employee"("employmentType");
CREATE INDEX "HR_Employee_isActive_idx" ON "HR_Employee"("isActive");
CREATE INDEX "HR_Employee_hireDate_idx" ON "HR_Employee"("hireDate");
CREATE INDEX "HR_Employee_fullName_idx" ON "HR_Employee"("fullName");
CREATE INDEX "HR_Employee_firstName_lastName_idx" ON "HR_Employee"("firstName", "lastName");
CREATE INDEX "HR_Employee_gender_idx" ON "HR_Employee"("gender");
CREATE INDEX "HR_Employee_maritalStatus_idx" ON "HR_Employee"("maritalStatus");
CREATE INDEX "HR_Employee_governorateId_idx" ON "HR_Employee"("governorateId");
CREATE INDEX "HR_Employee_city_idx" ON "HR_Employee"("city");
CREATE INDEX "HR_Employee_country_idx" ON "HR_Employee"("country");
CREATE INDEX "HR_Employee_createdAt_idx" ON "HR_Employee"("createdAt");
CREATE INDEX "HR_Employee_companyId_departmentId_idx" ON "HR_Employee"("companyId", "departmentId");
CREATE INDEX "HR_Employee_companyId_isActive_idx" ON "HR_Employee"("companyId", "isActive");
CREATE INDEX "HR_Employee_departmentId_isActive_idx" ON "HR_Employee"("departmentId", "isActive");
CREATE INDEX "HR_Employee_employmentStatus_isActive_idx" ON "HR_Employee"("employmentStatus", "isActive");
CREATE INDEX "HR_Employee_isFieldWorker_idx" ON "HR_Employee"("isFieldWorker");
CREATE INDEX "HR_Employee_currentRotationId_idx" ON "HR_Employee"("currentRotationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "HR_WorkRotation_employeeId_idx" ON "HR_WorkRotation"("employeeId");

-- CreateIndex
CREATE INDEX "HR_WorkRotation_status_idx" ON "HR_WorkRotation"("status");

-- CreateIndex
CREATE INDEX "HR_WorkRotation_startDate_endDate_idx" ON "HR_WorkRotation"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "HR_EmployeeLeave_employeeId_idx" ON "HR_EmployeeLeave"("employeeId");

-- CreateIndex
CREATE INDEX "HR_EmployeeLeave_status_idx" ON "HR_EmployeeLeave"("status");

-- CreateIndex
CREATE INDEX "HR_EmployeeLeave_startDate_endDate_idx" ON "HR_EmployeeLeave"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "HR_EmployeeAdvance_employeeId_idx" ON "HR_EmployeeAdvance"("employeeId");

-- CreateIndex
CREATE INDEX "HR_EmployeeAdvance_approvalStatus_idx" ON "HR_EmployeeAdvance"("approvalStatus");

-- CreateIndex
CREATE INDEX "HR_EmployeeAdvance_isPaid_idx" ON "HR_EmployeeAdvance"("isPaid");

-- CreateIndex
CREATE INDEX "HR_MonthlyPayroll_employeeId_idx" ON "HR_MonthlyPayroll"("employeeId");

-- CreateIndex
CREATE INDEX "HR_MonthlyPayroll_month_year_idx" ON "HR_MonthlyPayroll"("month", "year");

-- CreateIndex
CREATE INDEX "HR_MonthlyPayroll_paymentStatus_idx" ON "HR_MonthlyPayroll"("paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "HR_MonthlyPayroll_employeeId_month_year_key" ON "HR_MonthlyPayroll"("employeeId", "month", "year");

-- CreateIndex
CREATE INDEX "HR_AttendanceException_employeeId_idx" ON "HR_AttendanceException"("employeeId");

-- CreateIndex
CREATE INDEX "HR_AttendanceException_date_idx" ON "HR_AttendanceException"("date");

-- CreateIndex
CREATE INDEX "HR_AttendanceException_status_idx" ON "HR_AttendanceException"("status");
