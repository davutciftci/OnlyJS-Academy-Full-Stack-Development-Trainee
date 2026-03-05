-- CreateTable
CREATE TABLE "product_comments" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "product_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_comments_product_id_idx" ON "product_comments" ("product_id");

-- CreateIndex
CREATE INDEX "product_comments_user_id_idx" ON "product_comments" ("user_id");

-- CreateIndex
CREATE INDEX "product_comments_is_approved_idx" ON "product_comments" ("is_approved");

-- AddForeignKey
ALTER TABLE "product_comments"
ADD CONSTRAINT "product_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_comments"
ADD CONSTRAINT "product_comments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE;