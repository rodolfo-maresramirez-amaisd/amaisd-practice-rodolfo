import React from 'react';
import { Form, redirect, useActionData, Link } from 'react-router';
import { createItem } from '../../server/scripts';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  const itemData = {
    itemDescription: formData.get("itemDescription") as string,
    itemLocation: formData.get("itemLocation") as string,
    itemPrice: parseFloat(formData.get("itemPrice") as string),
    itemWeight: parseFloat(formData.get("itemWeight") as string),
  };

  try {
    const newItem = await createItem(itemData);
    
    return redirect("/warehouseItem");
  } catch (error) {
    return { error: "Failed to create item" };
  }
}

export default function AddWarehouseItem() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="page-container">
      <div className="page-title">
        <h1>Add New Warehouse Item</h1>
      </div>
      
      {actionData?.error && (
        <div className="error">
          {actionData.error}
        </div>
      )}
      
      <div className="form-container">
        <Form method="post" className="form">
          <div className="form-group">
            <label htmlFor="itemDescription">Description *</label>
            <textarea
              id="itemDescription"
              name="itemDescription"
              required
              rows={2}
              placeholder="Enter item description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="itemLocation">Location *</label>
            <input
              type="text"
              id="itemLocation"
              name="itemLocation"
              required
              placeholder="e.g. Warehouse A, Shelf 1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="itemPrice">Price ($) *</label>
            <input
              type="number"
              id="itemPrice"
              name="itemPrice"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="itemWeight">Weight (lbs) *</label>
            <input
              type="number"
              id="itemWeight"
              name="itemWeight"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Create Item
            </button>
            <a href="/warehouseItem" className="btn-secondary">
              Cancel
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
} 