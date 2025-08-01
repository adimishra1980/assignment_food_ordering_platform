import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuItem } from "../components/MenuSection";

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // this reducers helps in adding a item to the cart
    addToCart: (state, action: PayloadAction<MenuItem>) => {
      const itemToAdd = action.payload;
      const existingItem = state.items.find((item) => item.id === itemToAdd.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...itemToAdd, quantity: 1 });
      }
    },
  },
});


export const {addToCart} = cartSlice.actions
export default cartSlice.reducer