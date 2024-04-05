import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../states/store';

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  if (isAuthenticated) {
    return <Navigate to="/services" />;
  }

  return <Navigate to="/auth/login" />;
};

export default LandingPage;
