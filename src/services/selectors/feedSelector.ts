import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

//Селектор состояния ленты заказов

export const selectFeedState = (state: RootState) => state.feed;

export const selectFeedOrders = createSelector(
  selectFeedState,
  (selectFeedState) => selectFeedState.orders
);

export const selectFeedTotal = createSelector(
  selectFeedState,
  (selectFeedState) => selectFeedState.total
);

export const selectFeedTotalToday = createSelector(
  selectFeedState,
  (selectFeedState) => selectFeedState.totalToday
);

// Загрузка и ошибки

export const selectFeedLoading = createSelector(
  selectFeedState,
  (selectFeedState) => selectFeedState.orders
);

export const selectFeedError = createSelector(
  selectFeedState,
  (selectFeedState) => selectFeedState.error
);
