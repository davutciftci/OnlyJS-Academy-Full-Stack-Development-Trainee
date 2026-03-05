-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shipping_method" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "reset_token_expiry" TIMESTAMP(6);
