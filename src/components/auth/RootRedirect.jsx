import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import ClientId from "../../pages/auth/ClientId";
import Cookies from "js-cookie";
import Spinner from "../ui/Spinner";

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  const token = Cookies.get("token");

  if (loading) {
    return <Spinner size={48} />;
  }

  if (isAuthenticated && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ClientId />;
};

export default RootRedirect;
