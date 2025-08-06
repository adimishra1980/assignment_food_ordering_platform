import { toast } from "react-toastify";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../slices/cartSlice";
import type { IMenuItem } from "../types/type";
import { Link } from "react-router-dom";

interface MenuItemProps {
  item: IMenuItem;
}

const MenuItem = ({ item }: MenuItemProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    try {
      dispatch(addToCart(item));
      console.log("item added to the cart")
      toast.success("Item added to cart");
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to add item to the cart");
    }
  };

  return (
    <Link to={""} className="menu-item">
      <div>
        <img
          src={item.image_url}
          alt={item.name}
          className="w-[80vh] h-[25vh] object-cover rounded-xl"
        />
      </div>
      <div className="mt-3 mx-3">
        <h3 className="text-xl font-semibold ">{item.name}</h3>
        <h3 className="text-xl font-semibold">₹ {item.price}</h3>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
      >
        Add to Cart
      </button>
    </Link>
  );
};

export default MenuItem;
