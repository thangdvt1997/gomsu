-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('VIETQR', 'VNPAY');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'VIETQR';
