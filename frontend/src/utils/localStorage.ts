import type { CartState } from "../slices/cartSlice";

// The key we'll use to save the state in localStorage.
const STATE_KEY = "cartState";

export const loadState = (): { cart: CartState } | undefined => {
  try {
    const serializedState = localStorage.getItem(STATE_KEY);
    if (serializedState === null) {
      return undefined; // no state found
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

export const saveState = (state: { cart: CartState }) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STATE_KEY, serializedState);
  } catch (error) {
    console.log("Could not save state", error);
  }
};
