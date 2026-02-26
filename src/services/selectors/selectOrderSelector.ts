import { RootState } from '../store';

// Состояние выбранного заказа

export const selectOrderState = (state: RootState) => 
  state.selectOrder;

export const selectOrder = (state: RootState) => 
  state.selectOrder.order;

export const selectOrderLoading = (state: RootState) =>
  state.selectOrder.isLoading;

export const selectOrderError = (state: RootState) => 
  state.selectOrder.error;