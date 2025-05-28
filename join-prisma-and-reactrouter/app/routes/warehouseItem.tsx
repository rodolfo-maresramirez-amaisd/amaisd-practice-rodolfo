import { useLoaderData, Link } from 'react-router-dom';
import { getItems } from '../../server/scripts';

// Define the Item type based on your actual Prisma schema
interface Item {
  itemId: number;
  itemDescription: string;
  itemLocation: string;
  itemWeight: number;
  itemPrice: number;
}

// Server-side loader function - runs on the server
export async function loader() {
  try {
    const items = await getItems();
    return { items };
  } catch (error) {
    return { items: [], error: "Failed to load items" };
  }
}

// Client-side component - runs in the browser
export default function Warehouse() {
  const { items, error } = useLoaderData<{ items: Item[], error: string | null }>();

  return (
    <div className="page-container">
      <div className="page-title">
        <h1>Warehouse Items</h1>
        <Link to="/warehouseItem/add" className="btn-primary">
          Add New Item
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
              <th>ID</th>
              <th>Description</th>
              <th>Location</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No items found
                </td>
              </tr>
            ) : (
              items.map((item: any) => (
                <tr key={item.itemId}>
                  <td>{item.itemId}</td>
                  <td>{item.itemDescription}</td>
                  <td>{item.itemLocation}</td>
                  <td>${item.itemPrice?.toFixed(2)}</td>
                  <td>{item.itemWeight} lbs</td>
                  <td>
                    <Link to={`/warehouseItem/${item.itemId}/edit`} className="table-link">
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
