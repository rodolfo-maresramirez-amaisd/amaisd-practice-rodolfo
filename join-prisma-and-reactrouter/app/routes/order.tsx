import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/order";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client with singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function loader() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: true
      },
      orderBy: {
        orderDate: 'desc'
      }
    });
    return { orders };
  } catch (error) {
    return { orders: [], error: "Failed to load orders" };
  }
}

export default function Order({ }: Route.ComponentProps) {
  const data = useLoaderData<typeof loader>();
  const orders = data?.orders || [];
  const error = data?.error;

  return (
    <div className="page-container">
      <div className="page-title">
        <h1>Orders</h1>
        <Link to="/order/add" className="btn-primary">
          Add New Order
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
              <th>Order ID</th>
              <th>Customer</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Items Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.orderNo}>
                  <td>{order.orderNo}</td>
                  <td>{order.customer?.customerName || 'Unknown Customer'}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>${order.totalPrice?.toFixed(2) || '0.00'}</td>
                  <td>{order.items?.length || 0}</td>
                  <td>
                    <Link to={`/order/${order.orderNo}/edit`} className="table-link">
                      Edit
                    </Link>
                    <Link to={`/order/${order.orderNo}`} className="table-link-success">
                      View
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
