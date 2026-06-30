import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireRole = ({ roles, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default RequireRole;