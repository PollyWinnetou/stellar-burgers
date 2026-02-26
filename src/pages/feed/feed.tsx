import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedError,
  selectFeedLoading,
  selectFeedOrders
} from '../../services/selectors/feedSelector';
import { getFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>Нет заказов</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
