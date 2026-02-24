import { orderBurgerApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";

export interface IOrderState {
  orderRequest: boolean,
  orderModalData: TOrder | null,
  error: string | null
}

export const initialState: IOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
}

export const createOrder = createAsyncThunk(
    'order/fetchOrder',
    async (ingredientsIds: string[]) => {
      const response = await orderBurgerApi(ingredientsIds);
      return response.order;
    }
)

const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderRequest = false; 
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(createOrder.pending, (state) => {
      state.orderRequest = true;
      state.orderModalData = null;
      state.error = null;
    })
    .addCase(createOrder.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
      state.error = null;
    })
    .addCase(createOrder.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.error.message || 'Ошибка при создании заказа';
    })
  }
})

export const { clearOrderModalData } = OrderSlice.actions;

export default OrderSlice.reducer;

