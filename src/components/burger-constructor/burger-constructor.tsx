import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectConstructorAll,
  selectConstructorBurgerBun,
  selectConstructorBurgerIngredients
} from '../../services/selectors/constructorSelector';
import { useNavigate } from 'react-router-dom';
import {
  selectOrderModalData,
  selectOrderRequest
} from '../../services/selectors/orderSelector';
import { useDispatch } from '../../services/store';
import {
  clearOrderModalData,
  createOrder
} from '../../services/slices/orderSlice';
import { selectIsAuthenticated } from '../../services/selectors/userSelector';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ingredientsIds = useSelector(selectConstructorAll);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const constructorItems = {
    bun: useSelector(selectConstructorBurgerBun),
    ingredients: useSelector(selectConstructorBurgerIngredients)
  };

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!ingredientsIds) {
      return;
    }

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
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
