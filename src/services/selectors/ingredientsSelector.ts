import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IConstructorState } from '../slices/constructorSlice';

// Селектор состояния ингрединентов

export const ingredientsBurgerState = (state: RootState) => state.ingredients;

export const selectAllIngredients = createSelector(
  ingredientsBurgerState,
  (ingredientsState) => ingredientsState.ingredients
);

export const selectIngredientsLoading = createSelector(
  ingredientsBurgerState,
  (ingredientsState) => ingredientsState.isLoading
);

export const selectIngredientsError = createSelector(
  ingredientsBurgerState,
  (ingredientsState) => ingredientsState.error
);