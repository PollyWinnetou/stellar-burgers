import { RootState } from '../store';

export const selectUserOrders = (state: RootState) => 
  state.userOrders.orders;

export const selectUserOrdersLoading = (state: RootState) =>
  state.userOrders.isLoading;

export const selectUserOrdersError = (state: RootState) =>
  state.userOrders.error;