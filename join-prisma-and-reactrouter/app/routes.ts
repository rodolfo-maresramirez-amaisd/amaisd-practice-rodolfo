import { type RouteConfig, index, layout } from "@react-router/dev/routes";
import { route } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
        index("routes/home.tsx"),
        route("/warehouseItem", "routes/warehouseItem.tsx"),
        route("/warehouseItem/add", "routes/warehouseItem.add.tsx"),
        route("/customer", "routes/customer.tsx"),
        route("/customer/add", "routes/customer.add.tsx"),
        route("/order", "routes/order.tsx"),
        route("/order/add", "routes/order.add.tsx"),
        route("/orderItem", "routes/orderItem.tsx"),
    ])
] satisfies RouteConfig;
