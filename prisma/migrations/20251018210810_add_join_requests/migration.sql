-- CreateTable
CREATE TABLE "JoinRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegramId" BIGINT NOT NULL,
    "username" TEXT,
    "fullName" TEXT NOT NULL,
    "nickname" TEXT,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" DATETIME,
    "approvedBy" INTEGER,
    "rejectedBy" INTEGER,
    "rejectionReason" TEXT,
    "notes" TEXT,
    "userId" INTEGER,
    CONSTRAINT "JoinRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_rejectedBy_fkey" FOREIGN KEY ("rejectedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_telegramId_key" ON "JoinRequest"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_userId_key" ON "JoinRequest"("userId");

-- CreateIndex
CREATE INDEX "JoinRequest_telegramId_idx" ON "JoinRequest"("telegramId");

-- CreateIndex
CREATE INDEX "JoinRequest_status_idx" ON "JoinRequest"("status");

-- CreateIndex
CREATE INDEX "JoinRequest_requestedAt_idx" ON "JoinRequest"("requestedAt");
