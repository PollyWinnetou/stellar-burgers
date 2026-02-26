import { RootState } from '../store';

// Селектор состояния ингредиентов

export const ingredientsBurgerState = (state: RootState) => 
  state.ingredients;

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;