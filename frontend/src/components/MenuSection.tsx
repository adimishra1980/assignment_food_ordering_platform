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
    <div className="min-h-screen w-[80%] mx-auto px-4 sm:px-8 pb-8">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-10 ">
        {menu?.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
