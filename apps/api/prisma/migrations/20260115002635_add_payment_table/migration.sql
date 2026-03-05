-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address_id" INTEGER;

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "payment_id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paid_price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "status" TEXT NOT NULL,
    "payment_status" TEXT,
    "fraud_status" INTEGER,
    "card_type" TEXT,
    "card_association" TEXT,
    "card_family" TEXT,
    "bin_number" TEXT,
    "last_four_digits" TEXT,
    "iyzico_response" JSONB,
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_id_key" ON "payments"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- CreateIndex
CREATE INDEX "payments_payment_id_idx" ON "payments"("payment_id");

-- CreateIndex
CREATE INDEX "payments_conversation_id_idx" ON "payments"("conversation_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "user_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
