import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authStore";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
