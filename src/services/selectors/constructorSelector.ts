import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IConstructorState } from '../slices/constructorSlice';

//Селектор состояния конструктора

export const constructorBurgerState = (state: RootState): IConstructorState =>
  state.constructorIngredients;

export const selectConstructorBurgerBun = createSelector(
  constructorBurgerState,
  (constructorState) => constructorState.bun
);

export const selectConstructorBurgerIngredients = createSelector(
  constructorBurgerState,
  (constructorState) => constructorState.ingredients
);

export const selectConstructorAll = createSelector(
  [selectConstructorBurgerBun, selectConstructorBurgerIngredients],
  (bun, ingredients) => {
    if (!bun) return null;

    return [bun.id, ...ingredients.map((item) => item.id), bun.id];
  }
);
