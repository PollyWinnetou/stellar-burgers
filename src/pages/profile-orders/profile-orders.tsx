import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders } from '../../services/selectors/userOrdersSelector';
import { getUserOrders } from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(getUserOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
