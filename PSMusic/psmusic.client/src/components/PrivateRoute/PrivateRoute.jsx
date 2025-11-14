import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadSpinner from "../LoadSpinner/LoadSpinner";

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (!user || typeof user === "string") {
        return <Navigate to="/auth" replace />;
    }

    return children;
}

export default PrivateRoute;