import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Check for client info
    const clientId = localStorage.getItem("clientId");
    const clientInfo = localStorage.getItem("clientInfo");
    const token = Cookies.get("token");
    if (!clientId || !clientInfo || token) {
      return <Navigate to="/" replace />; // Redirect to client ID page
    }
    // Otherwise, go to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
