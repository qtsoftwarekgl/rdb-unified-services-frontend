import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/profile";
import "react-toastify/dist/ReactToastify.css";
import { Routes as Router, Route } from 'react-router-dom';
import AuthenticatedRoutes from './outlets/AuthenticatedRoutes';
import Home from './pages/dashboard/Home';
import Login from './pages/authentication/Login';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import BusinessRegistration from './pages/business-registration/index';
import AdminRoutes from './outlets/AdminRoutes';
import ListUsers from './pages/users-management/ListUsers';
import ListRoles from './pages/roles-management/ListRoles';

const Routes = () => {
  return (
    <>
      <ToastContainer
        autoClose={1500}
        position="top-center"
        hideProgressBar
        closeButton={false}
        closeOnClick
      />
      <Router>
        {/**
         * PUBLIC ROUTES
         */}
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/" element={<Home />} />
          {/* BUSINESS REGISTRATION */}
          <Route
            path="/business-registration/"
            element={<BusinessRegistration />}
          />
        </Route>
        {/* AUTHENTICATION */}
        <Route path="/auth/login" element={<Login />} />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />

        {/**
         * SUPER ADMIN ROUTES
         */}

        <Route element={<AdminRoutes />}>
          {/* SUPER ADMIN DASHBOARD */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ListUsers />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/roles" element={<ListRoles />} />
        </Route>
      </Router>
    </>
  );
};

export default Routes;
