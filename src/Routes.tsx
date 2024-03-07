import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/profiles/AdminProfile";
import "react-toastify/dist/ReactToastify.css";
import { Routes as Router, Route } from "react-router-dom";
import AuthenticatedRoutes from "./outlets/AuthenticatedRoutes";
import Home from "./pages/dashboard/Home";
import Login from "./pages/authentication/Login";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import BusinessRegistration from "./pages/business-registration/index";
import AdminRoutes from "./outlets/AdminRoutes";
import ListUsers from "./pages/users-management/ListUsers";
import ListRoles from "./pages/roles-management/ListRoles";
import SuperAdminRoutes from "./outlets/SuperAdminRoutes";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import ListInstitutions from "./pages/institutions-management/ListInstitutions";
import ResetPasswordRequest from "./pages/authentication/ResetPasswordRequest";
import ResetPasswordVerify from "./pages/authentication/ResetPasswordVerify";
import ResetPasswordNew from "./pages/authentication/ResetPasswordNew";
import UserProfile from "./pages/profiles/UserProfile";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/user-registration/Signup";

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
          {/* USER PROFILE */}
          <Route path="/profile" element={<UserProfile />} />
        </Route>
        {/* AUTHENTICATION */}
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/auth/reset-password/request"
          element={<ResetPasswordRequest />}
        />
        <Route
          path="/auth/reset-password/verify"
          element={<ResetPasswordVerify />}
        />
        <Route path="/auth/reset-password/new" element={<ResetPasswordNew />} />

        {/* USER REGISTRATIONS */}
        <Route path="/auth/register" element={<Signup />} />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />

        {/**
         *  ADMIN ROUTES
         */}

        <Route element={<AdminRoutes />}>
          {/* INSITUTION ADMIN DASHBOARD */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ListUsers />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/roles" element={<ListRoles />} />
        </Route>

        {/**
         * SUPER ADMIN ROUTES
         */}

        <Route element={<SuperAdminRoutes />}>
          {/* SUPER ADMIN DASHBOARD */}
          <Route
            path="/super-admin/dashboard"
            element={<SuperAdminDashboard />}
          />
          {/* USERS MANAGEMENT */}
          <Route path="/super-admin/users" element={<ListUsers />} />
          {/* ROLES MANAGEMENT */}
          <Route path="/super-admin/roles" element={<ListRoles />} />
          {/* INSTITUTIONS MANAGEMENT */}
          <Route
            path="/super-admin/institutions"
            element={<ListInstitutions />}
          />
          {/* PROFILE */}
        </Route>
      </Router>
    </>
  );
};

export default Routes;
