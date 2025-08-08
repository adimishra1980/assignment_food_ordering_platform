import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import KitchenDashboardPage from "./pages/KitchenDashboardPage.tsx";
import OrderStatusPage from "./pages/OrderStatusPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/order/:orderId",
    element: <OrderStatusPage />,
  },
  {
    path: "/cart",
    element: <CartPage/>
  },
  {
    path: "/checkout",
    element: <CheckoutPage/>
  },
  {
    path: "/kitchen/dashboard",
    element: <KitchenDashboardPage/>
  }
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App>
      <RouterProvider router={router} />
    </App>
  </Provider>
);
