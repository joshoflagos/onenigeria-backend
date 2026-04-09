-- CreateTable
CREATE TABLE "one_nigeria_users" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "avatar" TEXT,
    "fullname" TEXT,
    "username" TEXT,
    "phone1" TEXT,
    "phone2" TEXT,
    "dob" DATE,
    "ward" TEXT,
    "pollingUnit" TEXT,
    "neighborhood" TEXT,
    "nationIssueMaterials" TEXT[],
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "one_nigeria_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "founded" DATE,
    "founder" TEXT NOT NULL,
    "currentChair" TEXT NOT NULL,
    "chairContacts" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "parties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "one_nigeria_users_accountId_key" ON "one_nigeria_users"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "one_nigeria_users_username_key" ON "one_nigeria_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "parties_name_key" ON "parties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "parties_acronym_key" ON "parties"("acronym");
