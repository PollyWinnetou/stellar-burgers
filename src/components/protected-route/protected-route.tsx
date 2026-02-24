import { ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/selectors/userSelector';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: ReactElement; // Компонент, который нужно защитить
  onlyUnAuth?: boolean; // Флаг: true - только для неавторизованных
};

export const ProtectedRoute = ({ children, onlyUnAuth = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Действие для атворизованных пользователей 

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Действие для неавторизованных пользователей 
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
