import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/orderItem";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client with singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function loader() {
  try {
    const orderItems = await prisma.orderItem.findMany({
      include: {
        Order: {
          include: {
            customer: true
          }
        }
      },
      orderBy: {
        orderItemID: 'desc'
      }
    });
    return { orderItems };
  } catch (error) {
    return { orderItems: [], error: "Failed to load order items" };
  }
}

export default function OrderItem({ }: Route.ComponentProps) {
  const data = useLoaderData<typeof loader>();
  const orderItems = data?.orderItems || [];
  const error = data?.error;

  return (
    <div className="page-container">
      <div className="page-title">
        <h1>Order Items</h1>
        <Link to="/orderItem/add" className="btn-primary">
          Add New Order Item
        </Link>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order Item ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  No order items found
                </td>
              </tr>
            ) : (
              orderItems.map((orderItem: any) => (
                <tr key={orderItem.orderItemID}>
                  <td>{orderItem.orderItemID}</td>
                  <td>{orderItem.orderNumber}</td>
                  <td>{orderItem.Order?.customer?.customerName || 'Unknown Customer'}</td>
                  <td>{orderItem.itemNo || 'Unknown Item'}</td>
                  <td>{orderItem.quantity}</td>
                  <td>${orderItem.price?.toFixed(2) || '0.00'}</td>
                  <td>${((orderItem.quantity || 0) * (orderItem.price || 0)).toFixed(2)}</td>
                  <td>
                    <Link to={`/orderItem/${orderItem.orderItemID}/edit`} className="table-link">
                      Edit
                    </Link>
                    <button className="table-button-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
