import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "../utils/localStorage";
import throttle from "lodash.throttle";
import cartReducer from "../slices/cartSlice";
import menuReducer from "../slices/menuSlice";
import orderReducer from "../slices/orderSlice"

// Load the initial state from localStorage
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    menu: menuReducer,
    order: orderReducer
  },
  preloadedState, // Set the initial state of the store
});

// This function will run every time the Redux state changes.
// We use 'throttle' to ensure it doesn't run too often (max once per second).
store.subscribe(
  throttle(() => {
    saveState({
      cart: store.getState().cart,
    });
  }, 1000)
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
