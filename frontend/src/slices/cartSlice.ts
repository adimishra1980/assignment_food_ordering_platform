import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IMenuItem } from "../types/type";

export interface CartItem extends IMenuItem {
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
    addToCart: (state, action: PayloadAction<IMenuItem>) => {
      const itemToAdd = action.payload;
      const existingItem = state.items.find((item) => item.id === itemToAdd.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...itemToAdd, quantity: 1 });
      }
    },
    // this reducers helps to remove the item from the cart
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      // directly change the state
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      // first find the item
      const item = state.items.find((item) => item.id === action.payload);
      // if item exits and it's quantity is greater than 1, then decrease it
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      // first find the item
      const item = state.items.find((item) => item.id === action.payload);
      // if item exits, then increase it
      if (item) {
        item.quantity++;
      }
    },
    clearCart: (state) => {
      state.items = []
    }
  },
});

export const {
  addToCart,
  removeItemFromCart,
  decreaseQuantity,
  increaseQuantity,
  clearCart
} = cartSlice.actions;
export default cartSlice.reducer;
