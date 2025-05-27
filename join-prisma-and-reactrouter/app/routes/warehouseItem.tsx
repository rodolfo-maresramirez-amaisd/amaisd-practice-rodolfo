import { useLoaderData, Link } from 'react-router-dom';
import { getItems } from '../../server/scripts';

// Define the Item type based on your actual Prisma schema
interface Item {
  itemId: number;
  itemName: string;
  itemDescription: string;
  itemLocation: string;
  itemWeight: number;
  itemPrice: number;
}

// Server-side loader function - runs on the server
export async function loader() {
  const items = await getItems();
  return { items };
}

// Client-side component - runs in the browser
export default function Warehouse() {
  const { items } = useLoaderData<{ items: Item[] }>();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Warehouse Items</h1>
        <Link
          to="/warehouseItem/edit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Item
        </Link>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No items found in warehouse.</p>
          <Link
            to="/warehouseItem/edit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Your First Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: Item) => (
            <div key={item.itemId} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{item.itemName}</h2>
              <p className="text-gray-600">{item.itemDescription}</p>
              <div className="mt-2">
                <p><span className="font-medium">Location:</span> {item.itemLocation}</p>
                <p><span className="font-medium">Weight:</span> {item.itemWeight} kg</p>
                <p><span className="font-medium">Price:</span> ${item.itemPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
