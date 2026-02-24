import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Данные пользователя
export const selectUserState = (state: RootState) => state.user;

export const selectUserEmail = createSelector(
  selectUserState,
  (selectUserState) => selectUserState.email
);

export const selectUserName = createSelector(
  selectUserState,
  (selectUserState) => selectUserState.name
);

export const selectUserData = createSelector(
  selectUserState,
  (selectUserState) => (selectUserState.email, selectUserState.name)
);

// Данные аутентификации и проверка 

export const selectIsAuthenticated = createSelector(
  selectUserState,
  (selectUserState) => selectUserState.isAuthenticated
);

export const selectIsAuthChecked = createSelector(
  selectUserState,
  (selectUserState) => selectUserState.isAuthChecked
);

// Загрузка и ошибки

export const selectIsLoadingUser = createSelector(
  selectUserState,
  (selectUserState) => selectUserState.isLoading
);

export const selectErrorUser = createSelector(
  selectUserState,
  (selectUserState) => selectUserState.error
);

// Заброс на сброс и сброс

export const selectPasswordResetRequested = createSelector(
  selectUserState,
  (selectUserState) => selectUserState.passwordResetRequested
);

export const selectPasswordResetSuccess = createSelector(
  selectUserState,
  (selectUserState) => selectUserState.passwordResetSuccess
);

// localStorage

export const selectAccessToken = () => localStorage.getItem('accessToken');

export const selectRefreshToken = () => localStorage.getItem('refreshToken');

export const selectHasToken = () => !!localStorage.getItem('accessToken');
