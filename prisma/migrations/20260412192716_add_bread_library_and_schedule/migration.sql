-- CreateTable
CREATE TABLE "BreadType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BreadType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySchedule" (
    "id" TEXT NOT NULL,
    "breadTypeId" TEXT NOT NULL,
    "date" DATE,
    "dayOfWeek" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailySchedule_date_key" ON "DailySchedule"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailySchedule_dayOfWeek_key" ON "DailySchedule"("dayOfWeek");

-- AddForeignKey
ALTER TABLE "DailySchedule" ADD CONSTRAINT "DailySchedule_breadTypeId_fkey" FOREIGN KEY ("breadTypeId") REFERENCES "BreadType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
