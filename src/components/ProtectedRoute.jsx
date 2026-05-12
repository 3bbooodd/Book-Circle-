import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guard component that redirects unauthenticated users or users
 * without the required role to the home/login page.
 */
function ProtectedRoute({ children, roles }) {
  const { user, hasRole, loading } = useAuth();

  if (loading) {
    return <div className="page" style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Not in required role
  if (roles && !hasRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
