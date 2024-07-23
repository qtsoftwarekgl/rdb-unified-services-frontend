import 'react-toastify/dist/ReactToastify.css';
import AdminProfile from './pages/profiles/AdminProfile';
import 'react-toastify/dist/ReactToastify.css';
import { Routes as Router, Route } from 'react-router-dom';
import AuthenticatedRoutes from './outlets/AuthenticatedRoutes';
import Login from './pages/authentication/Login';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import DomesticBusinessRegistration from './pages/business-applications/domestic-business-registration/DomesticBusinessRegistration';
import AdminRoutes from './outlets/AdminRoutes';
import ListUsers from './pages/users-management/ListUsers';
import ListRoles from './pages/roles-management/ListRoles';
import SuperAdminRoutes from './outlets/SuperAdminRoutes';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import ListInstitutions from './pages/institutions-management/ListInstitutions';
import ResetPasswordRequest from './pages/authentication/ResetPasswordRequest';
import ResetPasswordVerify from './pages/authentication/ResetPasswordVerify';
import ResetPasswordNew from './pages/authentication/ResetPasswordNew';
import UserProfile from './pages/profiles/UserProfile';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './pages/user-registration/Signup';
import SuperAdminProfile from './pages/profiles/SuperAdminProfile';
import RegistrationVerify from './pages/user-registration/RegistrationVerify';
import RegistrationSuccess from './pages/user-registration/RegistrationSuccess';
import UserCompanyDetails from './pages/user-company-details/CompanyDetails';
import UserApplications from './pages/user-applications/UserApplications';
import CompanyDocuments from './pages/user-company-details/CompanyDocuments';
import CompanyHistory from './pages/user-company-details/CompanyHistory';
import EnterpriseRegistration from './pages/business-applications/enterprise-registration/EnterpriseRegistration';
import BusinessRegisterSuccess from './pages/BusinessRegisterSuccess';
import CessationToDormant from './pages/business-applications/cessation-dormancy/CessationToDormant';
import InstitutionRegistration from './pages/user-registration/InstitutionRegistration';
import InstitutionRegistrationSuccess from './pages/user-registration/InstitutionRegistrationSuccess';
import TransferRegistration from './pages/transfer-registration/TransferRegistration';
import Amalgamation from './pages/business-applications/amalgamation/Amalgamate';
import AmendCompanyDetails from './pages/business-applications/amend-company-details/AmendCompanyDetails';
import ForeignUsers from './pages/users-management/ForeignUsers';
import NameReservation from './pages/name-reservation/NameReservation';
import SearchCompanyAvailability from './pages/business-applications/company-availability/SearchCompanyAvailability';
import ForeignBranchRegistration from './pages/business-applications/foreign-company-registration/ForeignCompanyRegistration';
import BusinessNewBranch from './pages/new-branch/BusinessNewBranch';
import SearchCompanies from './pages/business-applications/company-availability/SearchCompanies';
import CompanyRestoration from './pages/business-applications/company-restoration/CompanyRestoration';
import CloseCompany from './pages/business-applications/company-closure/CloseCompany';
import CompanyDormancy from './pages/business-applications/company-dormancy/CompanyDormancy';
import ReviewRegistration from './pages/review-applications/ReviewRegistration';
import LandingPage from './pages/home/LandingPage';
import BackOfficeDashboard from './pages/dashboard/BackOfficeDashboard';
import CollateralList from './pages/business-applications/collateral/CollateralList';
import NewCollateral from './pages/business-applications/collateral/NewCollateral';
import CollateralListReview from './pages/collateral-review/CollateralList';
import CollateralReview from './pages/collateral-review/CollateralReview';
import ServicesList from './pages/home/ServicesList';
import NewServiceApplication from './containers/business-registration/NewServiceApplication';

const Routes = () => {
  return (
    <>
      <ToastContainer
        autoClose={2000}
        position="top-center"
        hideProgressBar
        closeButton={false}
        closeOnClick
      />
      <Router>
        {/**
         * PUBLIC ROUTES
         */}
        <Route path="/services" element={<ServicesList />} />
        <Route path="/services/:id/new" element={<NewServiceApplication />} />
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthenticatedRoutes />}>
          {/* USER PROFILE */}
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/company-details/:id" element={<UserCompanyDetails />} />
          <Route path="/user-applications" element={<UserApplications />} />
          <Route path="/company-documents/:id" element={<CompanyDocuments />} />
          <Route path="/company-history/:id" element={<CompanyHistory />} />

          {/**
           * BUSINESS REGISTRATION
           */}

          <Route
            path="/business-registration"
            element={<DomesticBusinessRegistration />}
          />
          <Route
            path="/foreign-company-registration"
            element={<ForeignBranchRegistration />}
          />
          <Route
            path="/enterprise-registration"
            element={<EnterpriseRegistration />}
          />
          <Route path="/success" element={<BusinessRegisterSuccess />} />
          <Route
            path="/cessation-to-dormant"
            element={<CessationToDormant />}
          />
          <Route
            path="/transfer-registration"
            element={<TransferRegistration />}
          />
          <Route path="/amalgamation" element={<Amalgamation />} />
          <Route
            path="/amend-company-details"
            element={<AmendCompanyDetails />}
          />
          <Route path="/name-reservation" element={<NameReservation />} />
          <Route
            path="/name-availability"
            element={<SearchCompanyAvailability />}
          />
          <Route path="/search-company" element={<SearchCompanies />} />
          <Route path="/company-restoration" element={<CompanyRestoration />} />
          <Route path="/company-dormancy" element={<CompanyDormancy />} />
          <Route path="/close-company" element={<CloseCompany />} />
          <Route path="/new-branch" element={<BusinessNewBranch />} />
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
          <Route path="/admin/staff" element={<ListUsers />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/roles" element={<ListRoles />} />
          <Route path="/admin/foreign-applicants" element={<ForeignUsers />} />
          <Route path="/admin/collaterals" element={<CollateralList />} />
          <Route path="/admin/collateral" element={<NewCollateral />} />
          <Route
            path="/back-office/dashboard"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/admin/review-collaterals"
            element={<CollateralListReview />}
          />
          <Route
            path="/admin/collateral-review"
            element={<CollateralReview />}
          />
          <Route
            path="/admin/review-applications"
            element={<ReviewRegistration />}
          />
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
