import { type RouteConfig, index, layout } from "@react-router/dev/routes";
import { route } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
        index("routes/home.tsx"),
        route("/warehouseItem", "routes/warehouseItem.tsx"),
        route("/warehouseItem/add", "routes/createWarehouseItem.tsx"),
        route("/customer", "routes/customer.tsx"),
        route("/order", "routes/order.tsx"),
        route("/orderItem", "routes/orderItem.tsx"),
    ])
] satisfies RouteConfig;
