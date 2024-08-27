import { useSelector } from 'react-redux';
import store from 'store';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../states/store';

const AuthenticatedRoutes = () => {
  // STATE VARIABLES
  const { user, token } = useSelector((state: RootState) => state.user);

  if ((user?.roles?.length ?? 0) <= 0 || !token) {
    store.remove('user');
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default AuthenticatedRoutes;
