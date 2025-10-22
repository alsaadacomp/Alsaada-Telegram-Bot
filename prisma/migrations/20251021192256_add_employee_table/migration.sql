-- CreateTable
CREATE TABLE "HR_Employee" (
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
    "attendanceRequired" BOOLEAN NOT NULL DEFAULT true,
    "fingerprintId" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "HR_Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "HR_Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "HR_Position" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_directManagerId_fkey" FOREIGN KEY ("directManagerId") REFERENCES "HR_Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HR_Employee_employeeCode_key" ON "HR_Employee"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "HR_Employee_nationalId_key" ON "HR_Employee"("nationalId");

-- CreateIndex
CREATE INDEX "HR_Employee_employeeCode_idx" ON "HR_Employee"("employeeCode");

-- CreateIndex
CREATE INDEX "HR_Employee_nationalId_idx" ON "HR_Employee"("nationalId");

-- CreateIndex
CREATE INDEX "HR_Employee_companyId_idx" ON "HR_Employee"("companyId");

-- CreateIndex
CREATE INDEX "HR_Employee_departmentId_idx" ON "HR_Employee"("departmentId");

-- CreateIndex
CREATE INDEX "HR_Employee_positionId_idx" ON "HR_Employee"("positionId");

-- CreateIndex
CREATE INDEX "HR_Employee_directManagerId_idx" ON "HR_Employee"("directManagerId");

-- CreateIndex
CREATE INDEX "HR_Employee_employmentStatus_idx" ON "HR_Employee"("employmentStatus");

-- CreateIndex
CREATE INDEX "HR_Employee_employmentType_idx" ON "HR_Employee"("employmentType");

-- CreateIndex
CREATE INDEX "HR_Employee_isActive_idx" ON "HR_Employee"("isActive");

-- CreateIndex
CREATE INDEX "HR_Employee_hireDate_idx" ON "HR_Employee"("hireDate");

-- CreateIndex
CREATE INDEX "HR_Employee_fullName_idx" ON "HR_Employee"("fullName");

-- CreateIndex
CREATE INDEX "HR_Employee_firstName_lastName_idx" ON "HR_Employee"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "HR_Employee_gender_idx" ON "HR_Employee"("gender");

-- CreateIndex
CREATE INDEX "HR_Employee_maritalStatus_idx" ON "HR_Employee"("maritalStatus");

-- CreateIndex
CREATE INDEX "HR_Employee_city_idx" ON "HR_Employee"("city");

-- CreateIndex
CREATE INDEX "HR_Employee_country_idx" ON "HR_Employee"("country");

-- CreateIndex
CREATE INDEX "HR_Employee_createdAt_idx" ON "HR_Employee"("createdAt");

-- CreateIndex
CREATE INDEX "HR_Employee_companyId_departmentId_idx" ON "HR_Employee"("companyId", "departmentId");

-- CreateIndex
CREATE INDEX "HR_Employee_companyId_isActive_idx" ON "HR_Employee"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "HR_Employee_departmentId_isActive_idx" ON "HR_Employee"("departmentId", "isActive");

-- CreateIndex
CREATE INDEX "HR_Employee_employmentStatus_isActive_idx" ON "HR_Employee"("employmentStatus", "isActive");
