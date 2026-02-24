import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectFeedOrders } from '../../services/selectors/feedSelector';
import { getFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);

  const handleGetFeeds = () => {
    dispatch(getFeed());
  }

  useEffect(() => {
    handleGetFeeds();
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  <FeedUI orders={orders} handleGetFeeds={() => { handleGetFeeds }} />;
};
