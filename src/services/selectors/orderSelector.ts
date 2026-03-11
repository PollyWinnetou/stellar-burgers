import { RootState } from '../store';

// Селектор состояния заказа

export const orderState = (state: RootState) => state.order;

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;

export const selectIngredientsIds = (state: RootState) =>
  state.order.orderModalData?.ingredients;

export const selectOrderSuccess = (state: RootState) =>
  state.order.orderSuccess;
