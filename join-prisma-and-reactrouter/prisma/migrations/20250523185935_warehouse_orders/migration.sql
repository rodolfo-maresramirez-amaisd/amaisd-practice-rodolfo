-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "itemNo" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "CustomerID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

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
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "Order"("orderNo") ON DELETE RESTRICT ON UPDATE CASCADE;
