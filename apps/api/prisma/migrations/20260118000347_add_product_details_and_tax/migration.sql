/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "productId" INTEGER;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "productId" INTEGER;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "price",
ADD COLUMN     "base_price" DECIMAL(10,2),
ADD COLUMN     "expiration_date" TEXT,
ADD COLUMN     "features" JSONB,
ADD COLUMN     "nutrition_info" JSONB,
ADD COLUMN     "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 20,
ADD COLUMN     "usage" JSONB;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
