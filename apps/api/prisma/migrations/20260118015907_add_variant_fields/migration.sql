/*
  Warnings:

  - You are about to drop the column `attributes` on the `product_variants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "attributes",
ADD COLUMN     "aroma" TEXT,
ADD COLUMN     "discount" INTEGER DEFAULT 0,
ADD COLUMN     "servings" TEXT,
ADD COLUMN     "size" TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(6);
