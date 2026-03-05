/*
  Warnings:

  - The `expiration_date` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "amino_acids" JSONB,
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "nutrition_values" JSONB,
ADD COLUMN     "serving_size" TEXT,
DROP COLUMN "expiration_date",
ADD COLUMN     "expiration_date" DATE;
