import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const handleAdd = useCallback(() => {
      const constructorIngredient = {
        ...ingredient,
        id: uuidv4()
      };

      dispatch(addIngredient(constructorIngredient))
    }, [dispatch, ingredient]);

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
