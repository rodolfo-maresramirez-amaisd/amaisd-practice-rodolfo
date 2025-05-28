import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Warehouse Management System" },
    { name: "description", content: "Manage your warehouse inventory, customers, and orders" },
  ];
}

export async function loader() {
  return {};
}

export default function Home() {
  const navigationCards = [
    {
      title: "Warehouse Items",
      description: "Manage your inventory items, locations, and pricing",
      link: "/warehouseItem",
      icon: "📦",
      color: "bg-blue-600"
    },
    {
      title: "Customers",
      description: "View and manage customer information",
      link: "/customer",
      icon: "👥",
      color: "bg-green-600"
    },
    {
      title: "Orders",
      description: "Track and manage customer orders",
      link: "/order",
      icon: "📋",
      color: "bg-purple-600"
    },
    {
      title: "Order Items",
      description: "View detailed order item information",
      link: "/orderItem",
      icon: "📝",
      color: "bg-orange-600"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Warehouse Management System</h1>
        <p>Efficiently manage your warehouse operations</p>
      </div>

      <div className="nav-cards-grid">
        {navigationCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="nav-card"
          >
            <div className={`nav-card-header ${card.color}`}>
              <div className="nav-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
            </div>
            <div className="nav-card-body">
              <p>{card.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/warehouseItem/add" className="btn-primary">
            Add New Item
          </Link>
          <Link to="/customer/add" className="btn-success">
            Add New Customer
          </Link>
        </div>
      </div>
    </div>
  );
}
