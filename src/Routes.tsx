import { Routes as Router, Route } from 'react-router-dom';
import AuthenticatedRoutes from './outlets/AuthenticatedRoutes';
import Home from './pages/dashboard/Home';
import Login from './pages/authentication/Login';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import BusinessRegistration from './pages/business-registration/index';

const Routes = () => {
  return (
    <>
    <ToastContainer autoClose={1500} position='top-center' hideProgressBar closeButton={false} closeOnClick />
      <Router>
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
        {/* AUTHENTICATION */}
        <Route path="/auth/login" element={<Login />} />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />

        {/* BUSINESS REGISTRATION */}
        <Route path="/business-registration/" element={<BusinessRegistration />} />

        {/* SUPER ADMIN */}
        <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
      </Router>
    </>
  );
};

export default Routes;
