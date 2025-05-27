//this is a test to see if the warehouseOrders will populate the console.log
//make sure to run the prisma studio to see the data
//the command i used to this script is 'npx tsx ./prisma/warehouseOrders.ts'

import { PrismaClient } from "../prisma";

const prisma = new PrismaClient();

async function main() {
  try {
    // Example query: Get all items
    const items = await prisma.item.findMany();
    console.log('All items:', items);

    // Example query: Get all orders with their items
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
    });
    console.log('All orders with items:', orders);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// this is only necessary if you don't want to import the prisma client from the prisma/schema.prisma file
export default prisma;

// Call the async function
main();