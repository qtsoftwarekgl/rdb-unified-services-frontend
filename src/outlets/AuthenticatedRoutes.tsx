import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../states/store";

const AuthenticatedRoutes = () => {

    // STATE VARIABLES
    const { token } = useSelector((state: RootState) => state.user);

    if (!token) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
};

export default AuthenticatedRoutes;
