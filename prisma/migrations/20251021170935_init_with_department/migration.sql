-- AlterTable
ALTER TABLE "Branch" ADD COLUMN "addressEn" TEXT;
ALTER TABLE "Branch" ADD COLUMN "country" TEXT;
ALTER TABLE "Branch" ADD COLUMN "email2" TEXT;
ALTER TABLE "Branch" ADD COLUMN "fax" TEXT;
ALTER TABLE "Branch" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "Branch" ADD COLUMN "phone2" TEXT;
ALTER TABLE "Branch" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "Branch" ADD COLUMN "website" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "descriptionEn" TEXT;
ALTER TABLE "Project" ADD COLUMN "nameEn" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'GLOBAL',
    "category" TEXT NOT NULL DEFAULT 'SYSTEM',
    "type" TEXT NOT NULL,
    "userId" INTEGER DEFAULT 0,
    "featureId" TEXT DEFAULT '',
    "description" TEXT,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" INTEGER
);
INSERT INTO "new_Setting" ("category", "createdAt", "description", "featureId", "id", "isSecret", "key", "scope", "type", "updatedAt", "updatedBy", "userId", "value") SELECT "category", "createdAt", "description", "featureId", "id", "isSecret", "key", "scope", "type", "updatedAt", "updatedBy", "userId", "value" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
CREATE INDEX "Setting_featureId_idx" ON "Setting"("featureId");
CREATE INDEX "Setting_userId_idx" ON "Setting"("userId");
CREATE INDEX "Setting_category_idx" ON "Setting"("category");
CREATE INDEX "Setting_scope_idx" ON "Setting"("scope");
CREATE INDEX "Setting_key_idx" ON "Setting"("key");
CREATE INDEX "Setting_updatedBy_idx" ON "Setting"("updatedBy");
CREATE INDEX "Setting_isSecret_idx" ON "Setting"("isSecret");
CREATE INDEX "Setting_createdAt_idx" ON "Setting"("createdAt");
CREATE INDEX "Setting_updatedAt_idx" ON "Setting"("updatedAt");
CREATE INDEX "Setting_category_scope_idx" ON "Setting"("category", "scope");
CREATE INDEX "Setting_key_scope_idx" ON "Setting"("key", "scope");
CREATE UNIQUE INDEX "Setting_key_scope_userId_featureId_key" ON "Setting"("key", "scope", "userId", "featureId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Branch_createdBy_idx" ON "Branch"("createdBy");

-- CreateIndex
CREATE INDEX "Branch_updatedBy_idx" ON "Branch"("updatedBy");

-- CreateIndex
CREATE INDEX "Branch_type_idx" ON "Branch"("type");

-- CreateIndex
CREATE INDEX "Branch_capacity_idx" ON "Branch"("capacity");

-- CreateIndex
CREATE INDEX "Branch_city_idx" ON "Branch"("city");

-- CreateIndex
CREATE INDEX "Branch_country_idx" ON "Branch"("country");

-- CreateIndex
CREATE INDEX "Branch_createdAt_idx" ON "Branch"("createdAt");

-- CreateIndex
CREATE INDEX "Branch_companyId_isActive_idx" ON "Branch"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "Company_createdBy_idx" ON "Company"("createdBy");

-- CreateIndex
CREATE INDEX "Company_updatedBy_idx" ON "Company"("updatedBy");

-- CreateIndex
CREATE INDEX "Company_establishedYear_idx" ON "Company"("establishedYear");

-- CreateIndex
CREATE INDEX "Company_legalForm_idx" ON "Company"("legalForm");

-- CreateIndex
CREATE INDEX "Company_city_idx" ON "Company"("city");

-- CreateIndex
CREATE INDEX "Company_country_idx" ON "Company"("country");

-- CreateIndex
CREATE INDEX "Company_createdAt_idx" ON "Company"("createdAt");

-- CreateIndex
CREATE INDEX "Company_name_isActive_idx" ON "Company"("name", "isActive");

-- CreateIndex
CREATE INDEX "JoinRequest_approvedBy_idx" ON "JoinRequest"("approvedBy");

-- CreateIndex
CREATE INDEX "JoinRequest_rejectedBy_idx" ON "JoinRequest"("rejectedBy");

-- CreateIndex
CREATE INDEX "JoinRequest_respondedAt_idx" ON "JoinRequest"("respondedAt");

-- CreateIndex
CREATE INDEX "JoinRequest_fullName_idx" ON "JoinRequest"("fullName");

-- CreateIndex
CREATE INDEX "JoinRequest_phone_idx" ON "JoinRequest"("phone");

-- CreateIndex
CREATE INDEX "JoinRequest_nickname_idx" ON "JoinRequest"("nickname");

-- CreateIndex
CREATE INDEX "JoinRequest_status_requestedAt_idx" ON "JoinRequest"("status", "requestedAt");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_priority_idx" ON "Notification"("priority");

-- CreateIndex
CREATE INDEX "Notification_targetAudience_idx" ON "Notification"("targetAudience");

-- CreateIndex
CREATE INDEX "Notification_scheduledAt_idx" ON "Notification"("scheduledAt");

-- CreateIndex
CREATE INDEX "Notification_sentAt_idx" ON "Notification"("sentAt");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_templateId_idx" ON "Notification"("templateId");

-- CreateIndex
CREATE INDEX "Notification_status_createdAt_idx" ON "Notification"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_priority_idx" ON "Notification"("type", "priority");

-- CreateIndex
CREATE INDEX "NotificationPreferences_userId_idx" ON "NotificationPreferences"("userId");

-- CreateIndex
CREATE INDEX "NotificationPreferences_enabled_idx" ON "NotificationPreferences"("enabled");

-- CreateIndex
CREATE INDEX "NotificationPreferences_quietHoursEnabled_idx" ON "NotificationPreferences"("quietHoursEnabled");

-- CreateIndex
CREATE INDEX "NotificationPreferences_createdAt_idx" ON "NotificationPreferences"("createdAt");

-- CreateIndex
CREATE INDEX "NotificationPreferences_updatedAt_idx" ON "NotificationPreferences"("updatedAt");

-- CreateIndex
CREATE INDEX "NotificationPreferences_userId_enabled_idx" ON "NotificationPreferences"("userId", "enabled");

-- CreateIndex
CREATE INDEX "NotificationPreferences_enabled_quietHoursEnabled_idx" ON "NotificationPreferences"("enabled", "quietHoursEnabled");

-- CreateIndex
CREATE INDEX "NotificationRecipient_status_idx" ON "NotificationRecipient"("status");

-- CreateIndex
CREATE INDEX "NotificationRecipient_sentAt_idx" ON "NotificationRecipient"("sentAt");

-- CreateIndex
CREATE INDEX "NotificationRecipient_createdAt_idx" ON "NotificationRecipient"("createdAt");

-- CreateIndex
CREATE INDEX "NotificationRecipient_failureReason_idx" ON "NotificationRecipient"("failureReason");

-- CreateIndex
CREATE INDEX "NotificationRecipient_updatedAt_idx" ON "NotificationRecipient"("updatedAt");

-- CreateIndex
CREATE INDEX "NotificationRecipient_notificationId_status_idx" ON "NotificationRecipient"("notificationId", "status");

-- CreateIndex
CREATE INDEX "NotificationRecipient_userId_status_idx" ON "NotificationRecipient"("userId", "status");

-- CreateIndex
CREATE INDEX "NotificationTemplate_isActive_idx" ON "NotificationTemplate"("isActive");

-- CreateIndex
CREATE INDEX "NotificationTemplate_type_idx" ON "NotificationTemplate"("type");

-- CreateIndex
CREATE INDEX "NotificationTemplate_priority_idx" ON "NotificationTemplate"("priority");

-- CreateIndex
CREATE INDEX "NotificationTemplate_createdBy_idx" ON "NotificationTemplate"("createdBy");

-- CreateIndex
CREATE INDEX "NotificationTemplate_name_idx" ON "NotificationTemplate"("name");

-- CreateIndex
CREATE INDEX "NotificationTemplate_createdAt_idx" ON "NotificationTemplate"("createdAt");

-- CreateIndex
CREATE INDEX "NotificationTemplate_updatedAt_idx" ON "NotificationTemplate"("updatedAt");

-- CreateIndex
CREATE INDEX "NotificationTemplate_variables_idx" ON "NotificationTemplate"("variables");

-- CreateIndex
CREATE INDEX "NotificationTemplate_isActive_type_idx" ON "NotificationTemplate"("isActive", "type");

-- CreateIndex
CREATE INDEX "NotificationTemplate_type_priority_idx" ON "NotificationTemplate"("type", "priority");

-- CreateIndex
CREATE INDEX "Permission_category_idx" ON "Permission"("category");

-- CreateIndex
CREATE INDEX "Permission_isActive_idx" ON "Permission"("isActive");

-- CreateIndex
CREATE INDEX "Permission_name_idx" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "Permission_createdAt_idx" ON "Permission"("createdAt");

-- CreateIndex
CREATE INDEX "Permission_updatedAt_idx" ON "Permission"("updatedAt");

-- CreateIndex
CREATE INDEX "Permission_category_isActive_idx" ON "Permission"("category", "isActive");

-- CreateIndex
CREATE INDEX "Permission_name_isActive_idx" ON "Permission"("name", "isActive");

-- CreateIndex
CREATE INDEX "Project_createdBy_idx" ON "Project"("createdBy");

-- CreateIndex
CREATE INDEX "Project_updatedBy_idx" ON "Project"("updatedBy");

-- CreateIndex
CREATE INDEX "Project_priority_idx" ON "Project"("priority");

-- CreateIndex
CREATE INDEX "Project_type_idx" ON "Project"("type");

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "Project"("category");

-- CreateIndex
CREATE INDEX "Project_city_idx" ON "Project"("city");

-- CreateIndex
CREATE INDEX "Project_region_idx" ON "Project"("region");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "Project_companyId_isActive_idx" ON "Project"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "RoleChange_createdAt_idx" ON "RoleChange"("createdAt");

-- CreateIndex
CREATE INDEX "RoleChange_oldRole_idx" ON "RoleChange"("oldRole");

-- CreateIndex
CREATE INDEX "RoleChange_newRole_idx" ON "RoleChange"("newRole");

-- CreateIndex
CREATE INDEX "RoleChange_reason_idx" ON "RoleChange"("reason");

-- CreateIndex
CREATE INDEX "RoleChange_changedBy_createdAt_idx" ON "RoleChange"("changedBy", "createdAt");

-- CreateIndex
CREATE INDEX "RoleChange_userId_createdAt_idx" ON "RoleChange"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RoleChange_oldRole_newRole_idx" ON "RoleChange"("oldRole", "newRole");

-- CreateIndex
CREATE INDEX "SettingHistory_oldValue_idx" ON "SettingHistory"("oldValue");

-- CreateIndex
CREATE INDEX "SettingHistory_newValue_idx" ON "SettingHistory"("newValue");

-- CreateIndex
CREATE INDEX "SettingHistory_reason_idx" ON "SettingHistory"("reason");

-- CreateIndex
CREATE INDEX "SettingHistory_changedBy_createdAt_idx" ON "SettingHistory"("changedBy", "createdAt");

-- CreateIndex
CREATE INDEX "SettingHistory_settingId_createdAt_idx" ON "SettingHistory"("settingId", "createdAt");

-- CreateIndex
CREATE INDEX "SettingHistory_settingKey_createdAt_idx" ON "SettingHistory"("settingKey", "createdAt");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_telegramId_idx" ON "User"("telegramId");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_bannedBy_idx" ON "User"("bannedBy");

-- CreateIndex
CREATE INDEX "User_department_idx" ON "User"("department");

-- CreateIndex
CREATE INDEX "User_position_idx" ON "User"("position");

-- CreateIndex
CREATE INDEX "User_lastActiveAt_idx" ON "User"("lastActiveAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_role_isActive_idx" ON "User"("role", "isActive");
