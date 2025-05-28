import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma client with singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Initialize Prisma client
async function initializePrisma() {
  try {
    await prisma.$connect();
    return prisma;
  } catch (error) {
    throw new Error('Failed to initialize Prisma client');
  }
}

// Get all items from the database
export async function getItems() {
  try {
    const prismaClient = await initializePrisma();
    const items = await prismaClient.item.findMany();
    return items;
  } catch (error) {
    throw new Error('Failed to fetch items');
  }
}

// Create a new item
export async function createItem(itemData: {
  itemDescription: string;
  itemLocation: string;
  itemPrice: number;
  itemWeight: number;
}) {
  try {
    const prismaClient = await initializePrisma();
    const result = await prismaClient.item.create({
      data: itemData,
    });
    return result;
  } catch (error) {
    throw new Error('Failed to create item');
  }
}

// Get all orders
export async function getOrders() {
  try {
    const prismaClient = await initializePrisma();
    const orders = await prismaClient.order.findMany();
    return orders;
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
}

// Get all customers
export async function getCustomers() {
  try {
    const prismaClient = await initializePrisma();
    const customers = await prismaClient.customer.findMany();
    return customers;
  } catch (error) {
    throw new Error('Failed to fetch customers');
  }
}

//export the prisma client
export default prisma;