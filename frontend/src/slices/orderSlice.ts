import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rpcClient } from "../utils/rpcClient";

interface CustomerData {
  name: string;
  phone: string;
}

interface PlaceOrderParams {
  customer: CustomerData;
  items: { id: string; quantity: number }[];
}

interface OrderState {
  currentOrderId: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  currentOrderId: null,
  status: "idle",
  error: null,
};

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData: PlaceOrderParams) => {
    const response = await rpcClient<{ orderId: number }, PlaceOrderParams>(
      "placeOrder",
      orderData
    );
    return response.orderId;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
        state.currentOrderId = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrderId = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to place order";
      });
  },
});

export default orderSlice.reducer
