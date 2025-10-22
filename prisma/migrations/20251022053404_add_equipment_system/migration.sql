-- CreateTable
CREATE TABLE "Equipment_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER
);

-- CreateTable
CREATE TABLE "Equipment_Type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "defaultCapacity" TEXT,
    "defaultFuelType" TEXT,
    "requiresLicense" BOOLEAN NOT NULL DEFAULT false,
    "licenseType" TEXT,
    "maintenanceTrackingType" TEXT NOT NULL DEFAULT 'HOURS',
    "oilChangeInterval" INTEGER,
    "maintenanceIntervalDays" INTEGER,
    "maintenanceIntervalHours" INTEGER,
    "maintenanceIntervalKm" INTEGER,
    "inspectionIntervalDays" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Equipment_Type_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Equipment_Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipmentTypeId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT,
    "plateNumber" TEXT,
    "companyId" INTEGER,
    "purchaseDate" DATETIME,
    "purchasePrice" REAL,
    "currency" TEXT DEFAULT 'EGP',
    "supplier" TEXT,
    "manufacturer" TEXT,
    "model" TEXT,
    "yearOfManufacture" INTEGER,
    "serialNumber" TEXT,
    "capacity" TEXT,
    "fuelType" TEXT,
    "engineNumber" TEXT,
    "chassisNumber" TEXT,
    "color" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "condition" TEXT NOT NULL DEFAULT 'GOOD',
    "currentLocation" TEXT,
    "currentProjectId" INTEGER,
    "currentOperatorId" INTEGER,
    "lastMaintenanceDate" DATETIME,
    "nextMaintenanceDate" DATETIME,
    "maintenanceInterval" INTEGER,
    "maintenanceBy" TEXT NOT NULL DEFAULT 'MILEAGE',
    "oilChangeInterval" INTEGER,
    "lastOilChangeAt" INTEGER,
    "nextOilChangeAt" INTEGER,
    "totalWorkingHours" INTEGER DEFAULT 0,
    "currentMileage" INTEGER DEFAULT 0,
    "lastOilChangeDate" DATETIME,
    "lastOilChangeMileage" INTEGER,
    "lastOilChangeHours" INTEGER,
    "nextOilChangeDue" INTEGER,
    "oilType" TEXT,
    "oilCapacity" REAL,
    "insuranceCompany" TEXT,
    "insuranceNumber" TEXT,
    "insuranceStartDate" DATETIME,
    "insuranceEndDate" DATETIME,
    "licenseNumber" TEXT,
    "licenseExpiryDate" DATETIME,
    "dailyRentalRate" REAL,
    "hourlyRate" REAL,
    "fuelConsumptionRate" REAL,
    "photos" TEXT,
    "documents" TEXT,
    "specifications" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Equipment_equipmentTypeId_fkey" FOREIGN KEY ("equipmentTypeId") REFERENCES "Equipment_Type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipment_currentProjectId_fkey" FOREIGN KEY ("currentProjectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipment_currentOperatorId_fkey" FOREIGN KEY ("currentOperatorId") REFERENCES "HR_Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment_Maintenance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipmentId" INTEGER NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "maintenanceDate" DATETIME NOT NULL,
    "nextDueDate" DATETIME,
    "description" TEXT NOT NULL,
    "workPerformed" TEXT,
    "partsReplaced" TEXT,
    "laborCost" REAL DEFAULT 0,
    "partsCost" REAL DEFAULT 0,
    "totalCost" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "performedBy" TEXT,
    "performedById" INTEGER,
    "serviceProvider" TEXT,
    "invoiceNumber" TEXT,
    "mileageBefore" INTEGER,
    "mileageAfter" INTEGER,
    "workingHoursBefore" INTEGER,
    "workingHoursAfter" INTEGER,
    "conditionBefore" TEXT,
    "conditionAfter" TEXT,
    "photos" TEXT,
    "documents" TEXT,
    "notes" TEXT,
    "isWarranty" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Equipment_Maintenance_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipment_Maintenance_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "HR_Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment_Usage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipmentId" INTEGER NOT NULL,
    "projectId" INTEGER,
    "operatorId" INTEGER,
    "shift" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "startMileage" INTEGER,
    "endMileage" INTEGER,
    "workingHours" REAL,
    "fuelConsumed" REAL,
    "fuelCost" REAL,
    "location" TEXT,
    "purpose" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Equipment_Usage_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipment_Usage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipment_Usage_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "HR_Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment_Cost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipmentId" INTEGER NOT NULL,
    "costType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "costDate" DATETIME NOT NULL,
    "description" TEXT,
    "supplier" TEXT,
    "invoiceNumber" TEXT,
    "paymentMethod" TEXT,
    "maintenanceRecordId" INTEGER,
    "notes" TEXT,
    "documents" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Equipment_Cost_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment_Fuel_Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipmentId" INTEGER NOT NULL,
    "fuelDate" DATETIME NOT NULL,
    "fuelType" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "pricePerUnit" REAL NOT NULL,
    "totalCost" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "currentMileage" INTEGER,
    "currentHours" INTEGER,
    "operatorId" INTEGER,
    "station" TEXT,
    "location" TEXT,
    "invoiceNumber" TEXT,
    "isFull" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Equipment_Fuel_Log_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipment_Fuel_Log_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "HR_Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment_Maintenance_Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipmentId" INTEGER NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "intervalType" TEXT NOT NULL,
    "intervalValue" INTEGER NOT NULL,
    "lastPerformedDate" DATETIME,
    "lastPerformedMileage" INTEGER,
    "lastPerformedHours" INTEGER,
    "nextDueDate" DATETIME,
    "nextDueMileage" INTEGER,
    "nextDueHours" INTEGER,
    "estimatedCost" REAL,
    "estimatedDuration" REAL,
    "requiredParts" TEXT,
    "requiredOils" TEXT,
    "notifyBeforeDays" INTEGER DEFAULT 7,
    "notifyBeforeKm" INTEGER,
    "notifyBeforeHours" INTEGER,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Equipment_Maintenance_Schedule_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment_Shift_Assignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipmentId" INTEGER NOT NULL,
    "operatorId" INTEGER NOT NULL,
    "shift" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "workDays" TEXT,
    "projectId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "Equipment_Shift_Assignment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipment_Shift_Assignment_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "HR_Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipment_Shift_Assignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_Category_nameAr_key" ON "Equipment_Category"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_Category_nameEn_key" ON "Equipment_Category"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_Category_code_key" ON "Equipment_Category"("code");

-- CreateIndex
CREATE INDEX "Equipment_Category_code_idx" ON "Equipment_Category"("code");

-- CreateIndex
CREATE INDEX "Equipment_Category_isActive_idx" ON "Equipment_Category"("isActive");

-- CreateIndex
CREATE INDEX "Equipment_Category_orderIndex_idx" ON "Equipment_Category"("orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_Type_code_key" ON "Equipment_Type"("code");

-- CreateIndex
CREATE INDEX "Equipment_Type_code_idx" ON "Equipment_Type"("code");

-- CreateIndex
CREATE INDEX "Equipment_Type_categoryId_idx" ON "Equipment_Type"("categoryId");

-- CreateIndex
CREATE INDEX "Equipment_Type_isActive_idx" ON "Equipment_Type"("isActive");

-- CreateIndex
CREATE INDEX "Equipment_Type_orderIndex_idx" ON "Equipment_Type"("orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_code_key" ON "Equipment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_plateNumber_key" ON "Equipment"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "Equipment"("serialNumber");

-- CreateIndex
CREATE INDEX "Equipment_code_idx" ON "Equipment"("code");

-- CreateIndex
CREATE INDEX "Equipment_plateNumber_idx" ON "Equipment"("plateNumber");

-- CreateIndex
CREATE INDEX "Equipment_equipmentTypeId_idx" ON "Equipment"("equipmentTypeId");

-- CreateIndex
CREATE INDEX "Equipment_companyId_idx" ON "Equipment"("companyId");

-- CreateIndex
CREATE INDEX "Equipment_currentProjectId_idx" ON "Equipment"("currentProjectId");

-- CreateIndex
CREATE INDEX "Equipment_currentOperatorId_idx" ON "Equipment"("currentOperatorId");

-- CreateIndex
CREATE INDEX "Equipment_status_idx" ON "Equipment"("status");

-- CreateIndex
CREATE INDEX "Equipment_condition_idx" ON "Equipment"("condition");

-- CreateIndex
CREATE INDEX "Equipment_isActive_idx" ON "Equipment"("isActive");

-- CreateIndex
CREATE INDEX "Equipment_nextMaintenanceDate_idx" ON "Equipment"("nextMaintenanceDate");

-- CreateIndex
CREATE INDEX "Equipment_insuranceEndDate_idx" ON "Equipment"("insuranceEndDate");

-- CreateIndex
CREATE INDEX "Equipment_licenseExpiryDate_idx" ON "Equipment"("licenseExpiryDate");

-- CreateIndex
CREATE INDEX "Equipment_status_isActive_idx" ON "Equipment"("status", "isActive");

-- CreateIndex
CREATE INDEX "Equipment_companyId_status_idx" ON "Equipment"("companyId", "status");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_equipmentId_idx" ON "Equipment_Maintenance"("equipmentId");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_maintenanceType_idx" ON "Equipment_Maintenance"("maintenanceType");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_maintenanceDate_idx" ON "Equipment_Maintenance"("maintenanceDate");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_nextDueDate_idx" ON "Equipment_Maintenance"("nextDueDate");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_performedById_idx" ON "Equipment_Maintenance"("performedById");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_equipmentId_maintenanceDate_idx" ON "Equipment_Maintenance"("equipmentId", "maintenanceDate");

-- CreateIndex
CREATE INDEX "Equipment_Usage_equipmentId_idx" ON "Equipment_Usage"("equipmentId");

-- CreateIndex
CREATE INDEX "Equipment_Usage_projectId_idx" ON "Equipment_Usage"("projectId");

-- CreateIndex
CREATE INDEX "Equipment_Usage_operatorId_idx" ON "Equipment_Usage"("operatorId");

-- CreateIndex
CREATE INDEX "Equipment_Usage_startDate_idx" ON "Equipment_Usage"("startDate");

-- CreateIndex
CREATE INDEX "Equipment_Usage_endDate_idx" ON "Equipment_Usage"("endDate");

-- CreateIndex
CREATE INDEX "Equipment_Usage_equipmentId_startDate_idx" ON "Equipment_Usage"("equipmentId", "startDate");

-- CreateIndex
CREATE INDEX "Equipment_Cost_equipmentId_idx" ON "Equipment_Cost"("equipmentId");

-- CreateIndex
CREATE INDEX "Equipment_Cost_costType_idx" ON "Equipment_Cost"("costType");

-- CreateIndex
CREATE INDEX "Equipment_Cost_costDate_idx" ON "Equipment_Cost"("costDate");

-- CreateIndex
CREATE INDEX "Equipment_Cost_equipmentId_costDate_idx" ON "Equipment_Cost"("equipmentId", "costDate");

-- CreateIndex
CREATE INDEX "Equipment_Fuel_Log_equipmentId_idx" ON "Equipment_Fuel_Log"("equipmentId");

-- CreateIndex
CREATE INDEX "Equipment_Fuel_Log_fuelDate_idx" ON "Equipment_Fuel_Log"("fuelDate");

-- CreateIndex
CREATE INDEX "Equipment_Fuel_Log_operatorId_idx" ON "Equipment_Fuel_Log"("operatorId");

-- CreateIndex
CREATE INDEX "Equipment_Fuel_Log_equipmentId_fuelDate_idx" ON "Equipment_Fuel_Log"("equipmentId", "fuelDate");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_Schedule_equipmentId_idx" ON "Equipment_Maintenance_Schedule"("equipmentId");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_Schedule_maintenanceType_idx" ON "Equipment_Maintenance_Schedule"("maintenanceType");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_Schedule_nextDueDate_idx" ON "Equipment_Maintenance_Schedule"("nextDueDate");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_Schedule_status_idx" ON "Equipment_Maintenance_Schedule"("status");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_Schedule_isActive_idx" ON "Equipment_Maintenance_Schedule"("isActive");

-- CreateIndex
CREATE INDEX "Equipment_Maintenance_Schedule_equipmentId_status_idx" ON "Equipment_Maintenance_Schedule"("equipmentId", "status");

-- CreateIndex
CREATE INDEX "Equipment_Shift_Assignment_equipmentId_idx" ON "Equipment_Shift_Assignment"("equipmentId");

-- CreateIndex
CREATE INDEX "Equipment_Shift_Assignment_operatorId_idx" ON "Equipment_Shift_Assignment"("operatorId");

-- CreateIndex
CREATE INDEX "Equipment_Shift_Assignment_shift_idx" ON "Equipment_Shift_Assignment"("shift");

-- CreateIndex
CREATE INDEX "Equipment_Shift_Assignment_startDate_idx" ON "Equipment_Shift_Assignment"("startDate");

-- CreateIndex
CREATE INDEX "Equipment_Shift_Assignment_endDate_idx" ON "Equipment_Shift_Assignment"("endDate");

-- CreateIndex
CREATE INDEX "Equipment_Shift_Assignment_isActive_idx" ON "Equipment_Shift_Assignment"("isActive");

-- CreateIndex
CREATE INDEX "Equipment_Shift_Assignment_equipmentId_shift_isActive_idx" ON "Equipment_Shift_Assignment"("equipmentId", "shift", "isActive");
