import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

function getPrisma() {
  if (!prisma) {
    try {
      prisma = new PrismaClient();
    } catch (error) {
      console.error('Failed to initialize Prisma client:', error);
      throw error;
    }
  }
  return prisma;
}

//get all items
export async function getItems() {
  try {
    return await getPrisma().item.findMany();
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

//create a new item
export async function createItem(itemData: {
  itemDescription: string;
  itemLocation: string;
  itemPrice: number;
  itemWeight: number;
}) {
  try {
    return await getPrisma().item.create({
      data: itemData,
    });
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

//get all orders
export async function getOrders() {
  try {
    return await getPrisma().order.findMany({
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

//get all customers
export async function getCustomers() {
  try {
    return await getPrisma().customer.findMany();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

//export the prisma client
export default getPrisma;