-- AlterTable
ALTER TABLE "BusinessSettings" ADD COLUMN     "maxOpenReservations" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "maxQtyPerOrder" INTEGER;
