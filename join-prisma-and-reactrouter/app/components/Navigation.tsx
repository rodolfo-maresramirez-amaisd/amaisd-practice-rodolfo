import { Link } from "react-router";

export default function Navigation() {
  return (
    <nav>
      <div className="nav-container">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            Warehouse Management
          </Link>
          
          <div className="nav-links">
            <Link to="/warehouseItem" className="nav-link">
              Warehouse Items
            </Link>
            
            <Link to="/customer" className="nav-link">
              Customers
            </Link>
            
            <Link to="/order" className="nav-link">
              Orders
            </Link>
            
            <Link to="/orderItem" className="nav-link">
              Order Items
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 