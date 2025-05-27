import { useNavigate } from 'react-router-dom';
import { createItem } from '../../server/scripts';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  
  const itemData = {
    itemName: formData.get('itemName') as string,
    itemDescription: formData.get('itemDescription') as string,
    itemLocation: formData.get('itemLocation') as string,
    itemPrice: parseFloat(formData.get('itemPrice') as string),
    itemWeight: parseFloat(formData.get('itemWeight') as string),
  };

  try {
    await createItem(itemData);
    return { success: "Successfully created item" };
  } catch (error) {
    return { error: 'Failed to create item' };
  }
}

export default function EditWarehouseItem() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Add New Warehouse Item</h1>
      
      <form method="post" className="space-y-4">
        <div>
          <label htmlFor="itemDescription" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="itemDescription"
            name="itemDescription"
            required
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="itemLocation" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            id="itemLocation"
            name="itemLocation"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="itemPrice" className="block text-sm font-medium mb-1">
            Price ($)
          </label>
          <input
            type="number"
            id="itemPrice"
            name="itemPrice"
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="itemWeight" className="block text-sm font-medium mb-1">
            Weight (lbs)
          </label>
          <input
            type="number"
            id="itemWeight"
            name="itemWeight"
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Item
          </button>
          <button
            type="button"
            onClick={() => navigate('/warehouseItem')}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 