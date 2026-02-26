import { getOrdersApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";

export interface UserOrdersState {
  orders: TOrder[],
  isLoading: boolean,
  error: string | null
}

export const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
}

export const getUserOrders = createAsyncThunk(
    'userOrders/get',
    async () => {
      const response = await getOrdersApi();
      return response;
    }
)

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getUserOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getUserOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(getUserOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка при создании заказа';
    })
  }
})

export default userOrdersSlice.reducer;