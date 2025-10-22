-- CreateTable
CREATE TABLE "Location_Governorate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "region" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "commercialRegister" TEXT,
    "taxId" TEXT,
    "insuranceNumber" TEXT,
    "address" TEXT,
    "addressEn" TEXT,
    "governorateId" INTEGER,
    "city" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "phone" TEXT,
    "phone2" TEXT,
    "fax" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "email2" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "instagram" TEXT,
    "logo" TEXT,
    "description" TEXT,
    "establishedYear" INTEGER,
    "legalForm" TEXT,
    "capital" REAL,
    "currency" TEXT,
    "bankAccounts" TEXT,
    "taxOffice" TEXT,
    "taxRecord" TEXT,
    "chamberOfCommerce" TEXT,
    "ceo" TEXT,
    "ceoPhone" TEXT,
    "accountant" TEXT,
    "accountantPhone" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Company_governorateId_fkey" FOREIGN KEY ("governorateId") REFERENCES "Location_Governorate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("accountant", "accountantPhone", "address", "addressEn", "bankAccounts", "capital", "ceo", "ceoPhone", "chamberOfCommerce", "city", "commercialRegister", "country", "createdAt", "createdBy", "currency", "description", "email", "email2", "establishedYear", "facebook", "fax", "id", "instagram", "insuranceNumber", "isActive", "legalForm", "linkedin", "logo", "mobile", "name", "nameEn", "notes", "phone", "phone2", "postalCode", "taxId", "taxOffice", "taxRecord", "twitter", "updatedAt", "updatedBy", "website") SELECT "accountant", "accountantPhone", "address", "addressEn", "bankAccounts", "capital", "ceo", "ceoPhone", "chamberOfCommerce", "city", "commercialRegister", "country", "createdAt", "createdBy", "currency", "description", "email", "email2", "establishedYear", "facebook", "fax", "id", "instagram", "insuranceNumber", "isActive", "legalForm", "linkedin", "logo", "mobile", "name", "nameEn", "notes", "phone", "phone2", "postalCode", "taxId", "taxOffice", "taxRecord", "twitter", "updatedAt", "updatedBy", "website" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE INDEX "Company_isActive_idx" ON "Company"("isActive");
CREATE INDEX "Company_name_idx" ON "Company"("name");
CREATE INDEX "Company_createdBy_idx" ON "Company"("createdBy");
CREATE INDEX "Company_updatedBy_idx" ON "Company"("updatedBy");
CREATE INDEX "Company_establishedYear_idx" ON "Company"("establishedYear");
CREATE INDEX "Company_legalForm_idx" ON "Company"("legalForm");
CREATE INDEX "Company_governorateId_idx" ON "Company"("governorateId");
CREATE INDEX "Company_city_idx" ON "Company"("city");
CREATE INDEX "Company_country_idx" ON "Company"("country");
CREATE INDEX "Company_createdAt_idx" ON "Company"("createdAt");
CREATE INDEX "Company_name_isActive_idx" ON "Company"("name", "isActive");
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
    CONSTRAINT "HR_Employee_governorateId_fkey" FOREIGN KEY ("governorateId") REFERENCES "Location_Governorate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "HR_Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "HR_Position" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HR_Employee_directManagerId_fkey" FOREIGN KEY ("directManagerId") REFERENCES "HR_Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_HR_Employee" ("allowances", "annualLeaveBalance", "attendanceRequired", "bankAccountNumber", "bankName", "basicSalary", "bloodType", "casualLeaveBalance", "certifications", "city", "companyId", "confirmationDate", "contractType", "country", "createdAt", "createdBy", "currency", "currentAddress", "currentAddressEn", "cv", "dateOfBirth", "departmentId", "directManagerId", "documents", "educationLevel", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation", "employeeCode", "employmentStatus", "employmentType", "fingerprintId", "firstName", "firstNameEn", "fullName", "fullNameEn", "gender", "graduationYear", "hireDate", "iban", "id", "insuranceStartDate", "isActive", "lastName", "lastNameEn", "major", "maritalStatus", "nationalId", "nationality", "notes", "passportNumber", "paymentMethod", "permanentAddress", "personalEmail", "personalPhone", "placeOfBirth", "positionId", "postalCode", "previousExperience", "profilePhoto", "region", "religion", "resignationDate", "secondName", "secondNameEn", "sickLeaveBalance", "skills", "socialInsuranceNumber", "taxNumber", "terminationDate", "terminationReason", "thirdName", "thirdNameEn", "totalSalary", "university", "updatedAt", "updatedBy", "workEmail", "workLocation", "workPhone", "workSchedule", "yearsOfExperience") SELECT "allowances", "annualLeaveBalance", "attendanceRequired", "bankAccountNumber", "bankName", "basicSalary", "bloodType", "casualLeaveBalance", "certifications", "city", "companyId", "confirmationDate", "contractType", "country", "createdAt", "createdBy", "currency", "currentAddress", "currentAddressEn", "cv", "dateOfBirth", "departmentId", "directManagerId", "documents", "educationLevel", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation", "employeeCode", "employmentStatus", "employmentType", "fingerprintId", "firstName", "firstNameEn", "fullName", "fullNameEn", "gender", "graduationYear", "hireDate", "iban", "id", "insuranceStartDate", "isActive", "lastName", "lastNameEn", "major", "maritalStatus", "nationalId", "nationality", "notes", "passportNumber", "paymentMethod", "permanentAddress", "personalEmail", "personalPhone", "placeOfBirth", "positionId", "postalCode", "previousExperience", "profilePhoto", "region", "religion", "resignationDate", "secondName", "secondNameEn", "sickLeaveBalance", "skills", "socialInsuranceNumber", "taxNumber", "terminationDate", "terminationReason", "thirdName", "thirdNameEn", "totalSalary", "university", "updatedAt", "updatedBy", "workEmail", "workLocation", "workPhone", "workSchedule", "yearsOfExperience" FROM "HR_Employee";
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Location_Governorate_nameAr_key" ON "Location_Governorate"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "Location_Governorate_nameEn_key" ON "Location_Governorate"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "Location_Governorate_code_key" ON "Location_Governorate"("code");

-- CreateIndex
CREATE INDEX "Location_Governorate_nameAr_idx" ON "Location_Governorate"("nameAr");

-- CreateIndex
CREATE INDEX "Location_Governorate_nameEn_idx" ON "Location_Governorate"("nameEn");

-- CreateIndex
CREATE INDEX "Location_Governorate_code_idx" ON "Location_Governorate"("code");

-- CreateIndex
CREATE INDEX "Location_Governorate_isActive_idx" ON "Location_Governorate"("isActive");

-- CreateIndex
CREATE INDEX "Location_Governorate_orderIndex_idx" ON "Location_Governorate"("orderIndex");

-- CreateIndex
CREATE INDEX "Location_Governorate_region_idx" ON "Location_Governorate"("region");
