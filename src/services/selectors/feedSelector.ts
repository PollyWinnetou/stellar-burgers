import { RootState } from '../store';

//Селектор состояния ленты заказов

export const selectFeedState = (state: RootState) => 
  state.feed;

export const selectFeedOrders = (state: RootState) => 
  state.feed.orders;

export const selectFeedTotal = (state: RootState) => 
  state.feed.total;

export const selectFeedTotalToday = (state: RootState) => 
  state.feed.totalToday;

// Загрузка и ошибки

export const selectFeedLoading = (state: RootState) => 
  state.feed.isLoading;

export const selectFeedError = (state: RootState) => 
  state.feed.error;