import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../states/store';

const SuperAdminRoutes = () => {
  // STATE VARIABLES
  const { user } = useSelector((state: RootState) => state.user);

  if (!user?.email?.includes('admin')) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default SuperAdminRoutes;
