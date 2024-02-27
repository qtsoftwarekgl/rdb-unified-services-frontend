import { Routes as Router, Route } from 'react-router-dom';
import AuthenticatedRoutes from './outlets/AuthenticatedRoutes';
import Home from './pages/dashboard/Home';
import Login from './pages/authentication/Login';
import NotFound from './pages/NotFound';

const Routes = () => {
  return (
    <>
      <Router>
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
        {/* AUTHENTICATION */}
        <Route path="/auth/login" element={<Login />} />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Router>
    </>
  );
};

export default Routes;
