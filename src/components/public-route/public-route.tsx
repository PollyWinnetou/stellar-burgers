import { FC, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { selectIsAuthChecked, selectUserData } from '../../services/selectors/userSelector';

type PublicRouteProps = {
  children: React.ReactElement;
};

export const PublicRoute: FC<PublicRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUserData);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [isAuthChecked, dispatch]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};