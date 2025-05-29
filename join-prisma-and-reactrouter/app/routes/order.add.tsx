import { Form, redirect, useLoaderData } from "react-router";
import { createOrder, getCustomers, getItems } from "../../server/scripts";

export async function loader() {
  try {
    const [customers, items] = await Promise.all([
      getCustomers(),
      getItems()
    ]);
    return { customers, items };
  } catch (error) {
    return { customers: [], items: [], error: "Failed to load data" };
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  
  try {
    const customerID = formData.get("customerID") as string;
    const itemsData = JSON.parse(formData.get("items") as string);
    
    // No need to calculate total price - server does it automatically!
    await createOrder({
      customerID,
      orderDate: new Date(),
      items: itemsData
    });

    return redirect("/order");
  } catch (error) {
    console.error("Failed to create order:", error);
    return { error: "Failed to create order" };
  }
}

export default function AddOrder() {
  const data = useLoaderData<typeof loader>();
  const { customers, items, error } = data;

  return (
    <div className="page-container">
      <div className="page-title">
        <h1>Create New Order</h1>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <Form method="post" className="form">
        <div className="form-group">
          <label htmlFor="customerSearch">Customer:</label>
          <div className="searchable-dropdown">
            <input
              type="text"
              id="customerSearch"
              placeholder="Search customers by name, email, or ID..."
              autoComplete="off"
            />
            <input type="hidden" name="customerID" id="selectedCustomerID" required />
            <div className="dropdown-list" id="customerDropdown">
              {customers.map((customer: any) => (
                <div 
                  key={customer.CustomerID} 
                  className="dropdown-item" 
                  data-customer-id={customer.CustomerID}
                  data-search-text={`${customer.customerName} ${customer.customerEmail} ${customer.CustomerID}`.toLowerCase()}
                >
                  <div className="customer-info">
                    <div className="customer-name">{customer.customerName}</div>
                    <div className="customer-details">{customer.customerEmail} • ID: {customer.CustomerID}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Order Items:</label>
          <div id="orderItems">
            <div className="order-item">
              <select name="itemId_0" required>
                <option value="">Select an item</option>
                {items.map((item: any) => (
                  <option key={item.itemId} value={item.itemId} data-price={item.itemPrice}>
                    {item.itemDescription} - ${item.itemPrice}
                  </option>
                ))}
              </select>
              <input 
                type="number" 
                name="quantity_0" 
                placeholder="Quantity" 
                min="1" 
                required 
              />
              <input 
                type="number" 
                name="price_0" 
                placeholder="Price per unit" 
                step="0.01" 
                min="0" 
                required 
              />
            </div>
          </div>
          <button type="button" id="addItem" className="btn-secondary">
            Add Another Item
          </button>
        </div>

        <input type="hidden" name="items" id="itemsData" />

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Create Order
          </button>
          <a href="/order" className="btn-secondary">
            Cancel
          </a>
        </div>
      </Form>

      <script dangerouslySetInnerHTML={{
        __html: `
          let itemCount = 1;
          let selectedCustomer = null;
          
          // Customer search functionality
          const customerSearch = document.getElementById('customerSearch');
          const customerDropdown = document.getElementById('customerDropdown');
          const selectedCustomerID = document.getElementById('selectedCustomerID');
          const dropdownItems = document.querySelectorAll('.dropdown-item');
          let filteredItems = Array.from(dropdownItems);
          let highlightedIndex = -1;
          
          // Show/hide dropdown based on input focus
          customerSearch.addEventListener('focus', function() {
            customerDropdown.style.display = 'block';
            filterCustomers();
          });
          
          // Filter customers as user types
          customerSearch.addEventListener('input', function() {
            filterCustomers();
            highlightedIndex = -1;
          });
          
          // Handle keyboard navigation
          customerSearch.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              highlightedIndex = Math.min(highlightedIndex + 1, filteredItems.length - 1);
              updateHighlight();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              highlightedIndex = Math.max(highlightedIndex - 1, -1);
              updateHighlight();
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
                selectCustomer(filteredItems[highlightedIndex]);
              }
            } else if (e.key === 'Escape') {
              customerDropdown.style.display = 'none';
              highlightedIndex = -1;
            }
          });
          
          // Click outside to close dropdown
          document.addEventListener('click', function(e) {
            if (!e.target.closest('.searchable-dropdown')) {
              customerDropdown.style.display = 'none';
              highlightedIndex = -1;
            }
          });
          
          // Filter customers based on search input
          function filterCustomers() {
            const searchText = customerSearch.value.toLowerCase();
            filteredItems = [];
            
            dropdownItems.forEach(item => {
              const itemSearchText = item.dataset.searchText;
              if (itemSearchText.includes(searchText)) {
                item.style.display = 'block';
                filteredItems.push(item);
              } else {
                item.style.display = 'none';
              }
            });
            
            // Show "No results" message if no items match
            if (filteredItems.length === 0 && searchText) {
              if (!document.getElementById('noResults')) {
                const noResults = document.createElement('div');
                noResults.id = 'noResults';
                noResults.className = 'no-results';
                noResults.textContent = 'No customers found';
                customerDropdown.appendChild(noResults);
              }
              document.getElementById('noResults').style.display = 'block';
            } else {
              const noResults = document.getElementById('noResults');
              if (noResults) noResults.style.display = 'none';
            }
          }
          
          // Update highlighted item
          function updateHighlight() {
            dropdownItems.forEach((item, index) => {
              item.classList.remove('highlighted');
            });
            
            if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
              filteredItems[highlightedIndex].classList.add('highlighted');
              filteredItems[highlightedIndex].scrollIntoView({ block: 'nearest' });
            }
          }
          
          // Select a customer
          function selectCustomer(customerElement) {
            const customerId = customerElement.dataset.customerId;
            const customerName = customerElement.querySelector('.customer-name').textContent;
            const customerEmail = customerElement.querySelector('.customer-details').textContent.split(' • ')[0];
            
            selectedCustomer = { id: customerId, name: customerName, email: customerEmail };
            customerSearch.value = \`\${customerName} (\${customerEmail})\`;
            selectedCustomerID.value = customerId;
            customerDropdown.style.display = 'none';
            highlightedIndex = -1;
            
            // Remove required validation error if present
            customerSearch.setCustomValidity('');
          }
          
          // Add click handlers to dropdown items
          dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
              selectCustomer(this);
            });
          });
          
          // Clear selection when input is manually cleared
          customerSearch.addEventListener('input', function() {
            if (!this.value) {
              selectedCustomerID.value = '';
              selectedCustomer = null;
            }
          });

          // Order items functionality (existing code)
          document.getElementById('addItem').addEventListener('click', function() {
            const container = document.getElementById('orderItems');
            const newItem = document.createElement('div');
            newItem.className = 'order-item';
            newItem.innerHTML = \`
              <select name="itemId_\${itemCount}" required>
                <option value="">Select an item</option>
                ${items.map((item: any) => 
                  `<option value="${item.itemId}" data-price="${item.itemPrice}">
                    ${item.itemDescription} - $${item.itemPrice}
                  </option>`
                ).join('')}
              </select>
              <input type="number" name="quantity_\${itemCount}" placeholder="Quantity" min="1" required />
              <input type="number" name="price_\${itemCount}" placeholder="Price per unit" step="0.01" min="0" required />
              <button type="button" onclick="this.parentElement.remove()" class="btn-danger">Remove</button>
            \`;
            container.appendChild(newItem);
            itemCount++;
          });

          // Auto-fill price when item is selected
          document.addEventListener('change', function(e) {
            if (e.target.name && e.target.name.startsWith('itemId_')) {
              const index = e.target.name.split('_')[1];
              const priceInput = document.querySelector(\`input[name="price_\${index}"]\`);
              const selectedOption = e.target.selectedOptions[0];
              if (selectedOption && selectedOption.dataset.price) {
                priceInput.value = selectedOption.dataset.price;
              }
            }
          });

          // Collect items data and validate customer selection before form submission
          document.querySelector('form').addEventListener('submit', function(e) {
            // Validate customer selection
            if (!selectedCustomerID.value) {
              e.preventDefault();
              customerSearch.setCustomValidity('Please select a customer from the dropdown');
              customerSearch.reportValidity();
              return false;
            }
            
            const items = [];
            const itemSelects = document.querySelectorAll('select[name^="itemId_"]');
            
            itemSelects.forEach((select, index) => {
              const itemId = select.value;
              const quantity = document.querySelector(\`input[name="quantity_\${index}"]\`).value;
              const price = document.querySelector(\`input[name="price_\${index}"]\`).value;
              
              if (itemId && quantity && price) {
                items.push({
                  itemId: parseInt(itemId),
                  quantity: parseInt(quantity),
                  price: parseFloat(price)
                });
              }
            });
            
            document.getElementById('itemsData').value = JSON.stringify(items);
          });
        `
      }} />
    </div>
  );
} 