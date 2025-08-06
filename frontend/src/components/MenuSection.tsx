import { useEffect } from "react";
import MenuItem from "./MenuItem";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { RootState } from "../app/store";
import { fetchMenu } from "../slices/menuSlice";

const MenuSection = () => {
  const dispatch = useAppDispatch();

  const menuItems = useAppSelector((state: RootState) => state.menu.items);
  const menuStatus = useAppSelector((state: RootState) => state.menu.status);
  const error = useAppSelector((state: RootState) => state.menu.error);

  useEffect(() => {
    // Only fetch the menu if it hasn't been fetched yet
    if (menuStatus === "idle") {
      dispatch(fetchMenu());
    }
  }, [menuStatus, dispatch]);

  let menuContent;
  if (menuStatus === "loading") {
    menuContent = <p className="text-center">Loading menu...</p>;
  } else if (menuStatus === "succeeded") {
    menuContent = (
      <>
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </>
    );
  } else if (menuStatus === "failed") {
    menuContent = <p className="text-red-500 text-xl text-center">{error}</p>;
  }

  return (
    <div className="min-h-screen w-[80%] mx-auto px-4 sm:px-8 pb-8">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-10 ">
        {menuContent}
      </div>
    </div>
  );
};

export default MenuSection;
