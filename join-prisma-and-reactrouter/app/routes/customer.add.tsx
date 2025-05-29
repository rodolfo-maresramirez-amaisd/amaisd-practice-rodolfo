import { Form, redirect, useActionData } from "react-router";
import { createCustomer } from "../../server/scripts";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  
  try {
    const customerData = {
      CustomerID: formData.get("CustomerID") as string,
      customerName: formData.get("customerName") as string,
      customerEmail: formData.get("customerEmail") as string,
      customerPhone: formData.get("customerPhone") as string,
      customerPhoneNumber: formData.get("customerPhoneNumber") as string,
      customerAddress: formData.get("customerAddress") as string,
    };

    // Basic validation
    if (!customerData.CustomerID || !customerData.customerName || !customerData.customerEmail) {
      return { error: "Customer ID, Name, and Email are required" };
    }

    await createCustomer(customerData);
    return redirect("/customer");
  } catch (error) {
    console.error("Failed to create customer:", error);
    return { error: "Failed to create customer. Customer ID might already exist." };
  }
}

export default function AddCustomer() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="page-container">
      <div className="page-title">
        <h1>Add New Customer</h1>
      </div>

      {actionData?.error && (
        <div className="error">
          {actionData.error}
        </div>
      )}

      <div className="form-container">
        <Form method="post" className="form">
          <div className="form-group">
            <label htmlFor="CustomerID">Customer ID *</label>
            <input
              type="text"
              id="CustomerID"
              name="CustomerID"
              required
              placeholder="Enter unique customer ID (e.g., CUST001)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerName">Customer Name *</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              required
              placeholder="Enter customer full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail">Email Address *</label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              required
              placeholder="customer@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Phone Number</label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerPhoneNumber">Alternative Phone</label>
            <input
              type="tel"
              id="customerPhoneNumber"
              name="customerPhoneNumber"
              placeholder="(555) 987-6543"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerAddress">Address</label>
            <textarea
              id="customerAddress"
              name="customerAddress"
              rows={3}
              placeholder="Enter customer's full address"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Create Customer
            </button>
            <a href="/customer" className="btn-secondary">
              Cancel
            </a>
          </div>
        </Form>

        <script dangerouslySetInnerHTML={{
          __html: `
            // Add client-side validation
            document.querySelector('form').addEventListener('submit', function(e) {
              const customerID = document.getElementById('CustomerID').value.trim();
              const customerName = document.getElementById('customerName').value.trim();
              const customerEmail = document.getElementById('customerEmail').value.trim();
              
              if (!customerID || !customerName || !customerEmail) {
                e.preventDefault();
                alert('Please fill in all required fields (Customer ID, Name, and Email)');
                return false;
              }
              
              // Validate email format
              const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
              if (!emailRegex.test(customerEmail)) {
                e.preventDefault();
                alert('Please enter a valid email address');
                return false;
              }
              
              // Validate Customer ID format (alphanumeric only)
              const idRegex = /^[A-Za-z0-9]+$/;
              if (!idRegex.test(customerID)) {
                e.preventDefault();
                alert('Customer ID should contain only letters and numbers');
                return false;
              }
            });
            
            // Auto-format phone numbers
            function formatPhoneNumber(input) {
              const value = input.value.replace(/\\D/g, '');
              const formattedValue = value.replace(/(\\d{3})(\\d{3})(\\d{4})/, '($1) $2-$3');
              if (value.length === 10) {
                input.value = formattedValue;
              }
            }
            
            document.getElementById('customerPhone').addEventListener('input', function() {
              formatPhoneNumber(this);
            });
            
            document.getElementById('customerPhoneNumber').addEventListener('input', function() {
              formatPhoneNumber(this);
            });
          `
        }} />
      </div>
    </div>
  );
} 