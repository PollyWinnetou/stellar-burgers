import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Данные пользователя
export const selectUserState = (state: RootState) => state.user;

export const selectUserEmail = (state: RootState) => state.user.email;

export const selectUserName = (state: RootState) => state.user.name;

export const selectUserData = createSelector(
  [selectUserEmail, selectUserName],
  (email, name) => ({ email, name })
);

// Данные аутентификации и проверка

export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

// Загрузка и ошибки

export const selectIsLoadingUser = (state: RootState) => state.user.isLoading;

export const selectErrorUser = (state: RootState) => state.user.error;

// Запрос на сброс и сброс

export const selectPasswordResetRequested = (state: RootState) =>
  state.user.passwordResetRequested;

export const selectPasswordResetSuccess = (state: RootState) =>
  state.user.passwordResetSuccess;
