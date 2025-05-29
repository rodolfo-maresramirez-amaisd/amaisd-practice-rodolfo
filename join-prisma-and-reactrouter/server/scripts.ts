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

// Delete an item
export async function deleteItem(itemId: number) {
  try {
    const prismaClient = await initializePrisma();
    const result = await prismaClient.item.delete({
      where: {
        itemId: itemId,
      },
    });
    return result;
  } catch (error) {
    throw new Error('Failed to delete item');
  }
}

// Helper function to calculate total from orderItems JSON
export function calculateOrderTotal(orderItems: any[]): number {
  return orderItems.reduce((sum, item) => {
    return sum + (item.totalAmount || (item.quantity * item.price));
  }, 0);
}

// Get order with calculated total (in case totalPrice needs updating)
export async function getOrderWithCalculatedTotal(orderId: number) {
  try {
    const prismaClient = await initializePrisma();
    const order = await prismaClient.order.findUnique({
      where: { orderId },
      include: { customer: true }
    });
    
    if (order && order.orderItems) {
      const calculatedTotal = calculateOrderTotal(order.orderItems as any[]);
      return {
        ...order,
        calculatedTotal,
        totalMismatch: Math.abs(order.totalPrice - calculatedTotal) > 0.01
      };
    }
    
    return order;
  } catch (error) {
    throw new Error('Failed to fetch order');
  }
}

// Create a new customer
export async function createCustomer(customerData: {
  CustomerID: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerPhoneNumber: string;
  customerAddress: string;
}) {
  try {
    const prismaClient = await initializePrisma();
    const result = await prismaClient.customer.create({
      data: customerData,
    });
    return result;
  } catch (error) {
    console.error('Failed to create customer:', error);
    throw new Error('Failed to create customer');
  }
}

// Create a new order with JSON-based order items
export async function createOrder(orderData: {
  customerID: string;
  orderDate: Date;
  items: Array<{
    itemId: number;
    quantity: number;
    price: number;
  }>;
}) {
  try {
    const prismaClient = await initializePrisma();
    
    // Calculate order items with totalAmount
    const orderItems = orderData.items.map(item => ({
      itemId: item.itemId,
      quantity: item.quantity,
      price: item.price,
      totalAmount: item.quantity * item.price // Calculated field!
    }));

    // Automatically calculate total price from all order items
    const totalPrice = orderItems.reduce((sum, item) => sum + item.totalAmount, 0);

    // Create the order with JSON order items
    const result = await prismaClient.order.create({
      data: {
        customerID: orderData.customerID,
        orderDate: orderData.orderDate,
        totalPrice: totalPrice, // Automatically calculated!
        orderItems: orderItems, // Store as JSON
      },
      include: {
        customer: true
      }
    });

    return result;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Failed to create order');
  }
}

//export the prisma client
export default prisma;