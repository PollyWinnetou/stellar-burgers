import { getOrderByNumberApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";

export interface ISelectedOrderState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null
}

export const initialState : ISelectedOrderState = {
  order: null,
  isLoading: false,
  error: null
}

export const getSelectOrder = createAsyncThunk(
  'selectOrder/get',
  async(number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
)

const selectOrderSlice = createSlice({
  name: 'selectOrder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getSelectOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getSelectOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
      state.error = null;
    })
    .addCase(getSelectOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка при создании заказа';
    })
  }
})

export default selectOrderSlice.reducer;