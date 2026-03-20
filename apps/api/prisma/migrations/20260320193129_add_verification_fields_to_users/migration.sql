-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verification_code" TEXT,
ADD COLUMN     "verification_code_expires" TIMESTAMP(6);
