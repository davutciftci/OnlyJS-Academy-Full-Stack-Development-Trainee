-- AlterTable
ALTER TABLE "product_comments" ADD COLUMN     "order_id" INTEGER,
ADD COLUMN     "order_item_id" INTEGER;

-- CreateIndex
CREATE INDEX "product_comments_order_id_idx" ON "product_comments"("order_id");

-- AddForeignKey
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
