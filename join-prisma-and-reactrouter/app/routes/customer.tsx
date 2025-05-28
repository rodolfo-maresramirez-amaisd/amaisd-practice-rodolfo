import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/customer";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client with singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function loader() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        customerName: 'asc'
      }
    });
    return { customers };
  } catch (error) {
    return { customers: [], error: "Failed to load customers" };
  }
}

export default function Customer({ }: Route.ComponentProps) {
  const data = useLoaderData<typeof loader>();
  const customers = data?.customers || [];
  const error = data?.error;

  return (
    <div className="page-container">
      <div className="page-title">
        <h1>Customers</h1>
        <Link to="/customer/add" className="btn-primary">
          Add New Customer
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
              <th>Customer ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer: any) => (
                <tr key={customer.CustomerID}>
                  <td>{customer.CustomerID}</td>
                  <td>{customer.customerName}</td>
                  <td>{customer.customerEmail}</td>
                  <td>{customer.customerPhone}</td>
                  <td>
                    <Link to={`/customer/${customer.CustomerID}/edit`} className="table-link">
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
