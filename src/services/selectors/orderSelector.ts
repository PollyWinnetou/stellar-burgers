import { createSelector } from '@reduxjs/toolkit';
import { IOrderState } from '../slices/orderSlice';
import { RootState } from '../store';

// Селектор состояния заказа

export const orderState = (state: RootState) => state.order;

export const selectOrderRequest = createSelector(
  orderState,
  (orderState: IOrderState) => orderState.orderRequest
);

export const selectOrderModalData = createSelector(
  orderState,
  (orderState: IOrderState) => orderState.orderModalData
);

export const selectIngredientsIds = createSelector(
  orderState,
  (orderState: IOrderState) => orderState.orderModalData?.ingredients
);
