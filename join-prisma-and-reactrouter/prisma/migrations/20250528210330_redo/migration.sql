-- CreateTable
CREATE TABLE "Item" (
    "itemId" SERIAL NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "itemLocation" TEXT NOT NULL,
    "itemPrice" DOUBLE PRECISION NOT NULL,
    "itemWeight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Customer" (
    "CustomerID" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerPhoneNumber" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("CustomerID")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderNo" SERIAL NOT NULL,
    "customerID" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderNo")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "orderItemID" SERIAL NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "itemNo" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderItemID")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "Customer"("CustomerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "Order"("orderNo") ON DELETE RESTRICT ON UPDATE CASCADE;
