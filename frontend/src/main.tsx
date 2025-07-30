import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import KitchenDashboardPage from "./pages/KitchenDashboardPage.tsx";
import OrderStatusPage from "./pages/OrderStatusPage.tsx";
import HomePage from "./pages/HomePage.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/kitchen",
    element: <KitchenDashboardPage />,
  },
  {
    path: "/order/:orderId",
    element: <OrderStatusPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <App>
    <RouterProvider router={router} />
  </App>
);
