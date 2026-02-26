import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

//Селектор состояния конструктора

export const constructorState = (state: RootState) =>
  state.constructorIngredients;

export const selectConstructorBun = (state: RootState) =>
  state.constructorIngredients.bun;

export const selectConstructorIngredients = (state: RootState) =>
  state.constructorIngredients.ingredients;

export const selectConstructorBurger = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => {
    if (!bun) return null;

    return [bun._id, ...ingredients.map((item) => item._id), bun._id];
  }
);