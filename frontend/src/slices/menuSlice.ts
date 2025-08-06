import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { IMenuItem } from "../types/type";
import { rpcClient } from "../utils/rpcClient";

interface MenuState {
  items: IMenuItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const response = await rpcClient<IMenuItem[]>("getMenu");
  return response;
});

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch menu";
      });
  },
});

export default menuSlice.reducer