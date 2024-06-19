import { useSelector } from 'react-redux';
import store from 'store';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../states/store';

const AuthenticatedRoutes = () => {
  // STATE VARIABLES
  const { user } = useSelector((state: RootState) => state.user);

  if (!user?.roles?.includes('PUBLIC_USER')) {
    store.remove('user');
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default AuthenticatedRoutes;
