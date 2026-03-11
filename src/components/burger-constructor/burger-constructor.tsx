import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';

import {
  selectConstructorBurger,
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/selectors/constructorSelector';

import {
  selectOrderModalData,
  selectOrderRequest
} from '../../services/selectors/orderSelector';

import {
  selectIsAuthenticated,
  selectUserData
} from '../../services/selectors/userSelector';

import { createOrder, removeModalData } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ingredientsOrder = useSelector(selectConstructorBurger);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userData = useSelector(selectUserData);

  const constructorItems = {
    bun: useSelector(selectConstructorBun),
    ingredients: useSelector(selectConstructorIngredients)
  };

  const onOrderClick = () => {
    if (!isAuthenticated || !userData) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!ingredientsOrder) {
      return;
    }

    dispatch(createOrder(ingredientsOrder));
  };

  const closeOrderModal = () => {
    dispatch(removeModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
