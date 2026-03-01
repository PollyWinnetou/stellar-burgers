import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { resetConstructor } from './constructorSlice';

export interface IOrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderSuccess: boolean;
  error: string | null;
}

export const initialState: IOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderSuccess: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  (orderData: string[], { dispatch }) =>
    orderBurgerApi(orderData).then(({ order }) => {
      dispatch(resetConstructor());
      return order;
    })
);

const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    removeModalData: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderSuccess = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderSuccess = true;
        state.orderModalData = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderSuccess = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      });
  }
});

export const { removeModalData } = OrderSlice.actions;

export default OrderSlice.reducer;
