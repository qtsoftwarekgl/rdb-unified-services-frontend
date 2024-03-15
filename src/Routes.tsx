import "react-toastify/dist/ReactToastify.css";
import AdminProfile from "./pages/profiles/AdminProfile";
import "react-toastify/dist/ReactToastify.css";
import { Routes as Router, Route } from "react-router-dom";
import AuthenticatedRoutes from "./outlets/AuthenticatedRoutes";
import Home from "./pages/home/Home";
import Login from "./pages/authentication/Login";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import BusinessRegistration from "./pages/business-registration/BusinessRegistration";
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
import SuperAdminProfile from "./pages/profiles/SuperAdminProfile";
import RegistrationVerify from "./pages/user-registration/RegistrationVerify";
import RegistrationSuccess from "./pages/user-registration/RegistrationSuccess";
import UserCompanyDetails from "./pages/user-company-details/CompanyDetails";
import UserApplications from "./pages/user-applications/UserApplications";
import CompanyDocuments from "./pages/user-company-details/CompanyDocuments";
import CompanyHistory from "./pages/user-company-details/CompanyHistory";
import RegistrationSetPassword from "./pages/user-registration/RegistrationSetPassword";
import NewBusinessRegistration from "./pages/business-registration/NewBusinessRegistration";
import EnterpriseRegistration from "./pages/enterprise-registration/EnterpriseRegistration";
import NewEnterpriseRegistration from "./pages/enterprise-registration/NewEnterpriseRegistration";
import BusinessRegisterSuccess from "./pages/BusinessRegisterSuccess";
import CessationToDormant from "./pages/cessation-dormancy/CessationToDormant";
import InstitutionRegistration from "./pages/user-registration/InstitutionRegistration";
import InstitutionRegistrationSuccess from "./pages/user-registration/InstitutionRegistrationSuccess";

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
        <Route path="/" element={<Home />} />
        <Route element={<AuthenticatedRoutes />}>
          {/* BUSINESS REGISTRATION */}
          <Route
            path="/business-registration/"
            element={<BusinessRegistration />}
          />
          {/* USER PROFILE */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="company-details" element={<UserCompanyDetails />} />
          <Route path="applications" element={<UserApplications />} />
          <Route path="/company-documents" element={<CompanyDocuments />} />
          <Route path="/company-history" element={<CompanyHistory />} />

          {/**
           * BUSINESS REGISTRATION
           */}

          <Route
            path="/business-registration"
            element={<BusinessRegistration />}
          />
          <Route
            path="/enterprise-registration"
            element={<EnterpriseRegistration />}
          />

          <Route
            path="/business-registration/new"
            element={<NewBusinessRegistration />}
          />
          <Route
            path="/enterprise-registration/new"
            element={<NewEnterpriseRegistration />}
          />
          <Route path="/success" element={<BusinessRegisterSuccess />} />
          <Route
            path="/cessation-to-dormant"
            element={<CessationToDormant />}
          />
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
        <Route path="/auth/register/verify" element={<RegistrationVerify />} />
        <Route
          path="/auth/register/set-password"
          element={<RegistrationSetPassword />}
        />
        <Route
          path="/auth/register/success"
          element={<RegistrationSuccess />}
        />

        {/* INSTITUTION REGISTRATION */}
        <Route
          path="/auth/register/institution"
          element={<InstitutionRegistration />}
        />
        <Route
          path="/auth/register/institution/verify"
          element={<RegistrationVerify />}
        />
        <Route
          path="/auth/register/institution/success"
          element={<InstitutionRegistrationSuccess />}
        />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />

        {/**
         *  ADMIN ROUTES
         */}

        <Route element={<AdminRoutes />}>
          {/* INSITUTION ADMIN DASHBOARD */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ListUsers />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
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
          <Route path="/super-admin/profile" element={<SuperAdminProfile />} />
        </Route>
      </Router>
    </>
  );
};

export default Routes;
