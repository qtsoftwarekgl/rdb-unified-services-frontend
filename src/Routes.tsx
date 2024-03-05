import { Routes as Router, Route } from "react-router-dom";
import AuthenticatedRoutes from "./outlets/AuthenticatedRoutes";
import Home from "./pages/dashboard/Home";
import Login from "./pages/authentication/Login";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import BusinessRegistration from "./pages/business-registration/index";
import SuperAdminRoutes from "./outlets/SuperAdminRoutes";
import ListUsers from "./pages/users-management/ListUsers";
import Profile from "./pages/profile";

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

        <Route element={<SuperAdminRoutes />}>
          {/* SUPER ADMIN DASHBOARD */}
          <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/admin/users" element={<ListUsers />} />
          <Route path="/admin/profile" element={<Profile />} />
        </Route>
      </Router>
    </>
  );
};

export default Routes;
