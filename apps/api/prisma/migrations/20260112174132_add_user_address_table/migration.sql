-- CreateTable
CREATE TABLE "user_addresses" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "postal_code" VARCHAR(10),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_addresses_user_id_idx" ON "user_addresses" ("user_id");

-- CreateIndex
CREATE INDEX "user_addresses_is_default_idx" ON "user_addresses" ("is_default");

-- AddForeignKey
ALTER TABLE "user_addresses"
ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;