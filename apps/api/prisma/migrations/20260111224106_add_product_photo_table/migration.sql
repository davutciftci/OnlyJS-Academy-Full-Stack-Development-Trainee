-- CreateTable
CREATE TABLE "product_photos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "product_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_photos_product_id_idx" ON "product_photos" ("product_id");

-- CreateIndex
CREATE INDEX "product_photos_is_primary_idx" ON "product_photos" ("is_primary");

-- AddForeignKey
ALTER TABLE "product_photos"
ADD CONSTRAINT "product_photos_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE;