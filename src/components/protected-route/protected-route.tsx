import { ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '../../services/selectors/userSelector';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ children, onlyUnAuth = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Действие для авторизованных пользователей 

  if (onlyUnAuth) {

    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      
      return <Navigate to={from} />;
    }

    return children;
  }

  // Действие для неавторизованных пользователей 
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
