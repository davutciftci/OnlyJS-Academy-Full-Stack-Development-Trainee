/*
  Warnings:

  - You are about to drop the column `tc_no` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_unique_1";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "tc_no";
