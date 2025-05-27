import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Warehouse from "./warehouseItem";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  return {};
}

export function Home() {
  return <Welcome />;
}
