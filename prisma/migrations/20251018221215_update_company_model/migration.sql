-- CreateTable
CREATE TABLE "Company" (
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
    "branches" TEXT,
    "workSites" TEXT,
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

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_isActive_idx" ON "Company"("isActive");
