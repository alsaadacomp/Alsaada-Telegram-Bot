/*
  Warnings:

  - You are about to drop the column `branches` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `workSites` on the `Company` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Branch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "address" TEXT,
    "city" TEXT,
    "region" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "manager" TEXT,
    "managerPhone" TEXT,
    "type" TEXT,
    "capacity" INTEGER,
    "openingDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "clientName" TEXT,
    "clientPhone" TEXT,
    "clientEmail" TEXT,
    "location" TEXT,
    "city" TEXT,
    "region" TEXT,
    "contractValue" REAL,
    "currency" TEXT,
    "paidAmount" REAL,
    "remainingAmount" REAL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "actualEndDate" DATETIME,
    "projectManager" TEXT,
    "engineer" TEXT,
    "supervisor" TEXT,
    "status" TEXT,
    "progress" INTEGER,
    "priority" TEXT,
    "type" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "updatedBy" INTEGER
);
INSERT INTO "new_Company" ("accountant", "accountantPhone", "address", "addressEn", "bankAccounts", "capital", "ceo", "ceoPhone", "chamberOfCommerce", "city", "commercialRegister", "country", "createdAt", "createdBy", "currency", "description", "email", "email2", "establishedYear", "facebook", "fax", "id", "instagram", "insuranceNumber", "isActive", "legalForm", "linkedin", "logo", "mobile", "name", "nameEn", "notes", "phone", "phone2", "postalCode", "taxId", "taxOffice", "taxRecord", "twitter", "updatedAt", "updatedBy", "website") SELECT "accountant", "accountantPhone", "address", "addressEn", "bankAccounts", "capital", "ceo", "ceoPhone", "chamberOfCommerce", "city", "commercialRegister", "country", "createdAt", "createdBy", "currency", "description", "email", "email2", "establishedYear", "facebook", "fax", "id", "instagram", "insuranceNumber", "isActive", "legalForm", "linkedin", "logo", "mobile", "name", "nameEn", "notes", "phone", "phone2", "postalCode", "taxId", "taxOffice", "taxRecord", "twitter", "updatedAt", "updatedBy", "website" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE INDEX "Company_name_idx" ON "Company"("name");
CREATE INDEX "Company_isActive_idx" ON "Company"("isActive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Branch_companyId_idx" ON "Branch"("companyId");

-- CreateIndex
CREATE INDEX "Branch_name_idx" ON "Branch"("name");

-- CreateIndex
CREATE INDEX "Branch_isActive_idx" ON "Branch"("isActive");

-- CreateIndex
CREATE INDEX "Project_companyId_idx" ON "Project"("companyId");

-- CreateIndex
CREATE INDEX "Project_name_idx" ON "Project"("name");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_isActive_idx" ON "Project"("isActive");

-- CreateIndex
CREATE INDEX "Project_startDate_idx" ON "Project"("startDate");

-- CreateIndex
CREATE INDEX "Project_endDate_idx" ON "Project"("endDate");
