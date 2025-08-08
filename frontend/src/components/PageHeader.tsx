import type { RootState } from "../app/store";
import { useAppSelector } from "../app/hooks";
import { ShoppingCart } from 'lucide-react';

const PageHeader = () => {
  const cartItems = useAppSelector((state: RootState) => state.cart.items);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="bg-[#FFFFFF] h-20 flex items-center text-black p-4 shadow-2xl shadow-zinc-200 sticky top-0 z-[999]">
      <div className="container mx-auto flex items-center justify-around">
        <a href="/" className="text-2xl font-bold">
          JUST ORDER
        </a>
        <nav className="">
          <ul className="flex gap-10 text-lg">
            <li>
              <a href="/" className="nav-link">
                Home
              </a>
            </li>
            <li>
              <a href="/kitchen/dashboard" className="nav-link">
                Kitchen
              </a>
            </li>
            <li>
              <a href="/cart" className="nav-link flex items-center gap-2 relative">
                <span><ShoppingCart /></span>
                <span>Cart</span>

                {/* This badge will only show if there are items in the cart */}
                {totalQuantity > 0 && (
                  <span className="bg-[#ff5100] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center absolute -top-3 -right-4">
                    {totalQuantity}
                  </span>
                )}
              </a>
            </li>
            <li>
              <a href="/orders" className="nav-link">
                Orders
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default PageHeader;
