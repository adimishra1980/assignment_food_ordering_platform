import { useEffect, useState } from "react";
import MenuItem from "./MenuItem";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

const useMenu = () => {
  const [menu, setMenu] = useState<MenuItem[] | null>(null);

  useEffect(() => {
    fetch("/menu.json")
      .then((res) => res.json())
      .then((res) => setMenu(res))
      .catch((error) => console.log("error: ", error));
  }, []);

  return menu;
};

const MenuSection = () => {
  const menu = useMenu();

  return (
    <div className="min-h-screen w-ful px-4 sm:px-8 pb-8">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8 ">
        {menu?.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            image_url={item.image_url}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
