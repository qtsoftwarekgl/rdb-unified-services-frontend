import { Routes as Router, Route } from "react-router-dom";
import AuthenticatedRoutes from './outlets/AuthenticatedRoutes';
import Home from "./pages/dashboard/Home";
import Login from "./pages/authentication/Login";

const Routes = () => {
  return (
    <Router>
      <Route element={<AuthenticatedRoutes />}>
        <Route path="/" element={<Home />} />
      </Route>
      {/* AUTHENTICATION */}
      <Route path="/login" element={<Login />} />
    </Router>
  );
};

export default Routes;
