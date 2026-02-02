import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// protect routes based on user roles
export default function RequireRole({ allowedRoles }) {
  const { roles } = useSelector((s) => s.adminAuth);

  // if user has at least one allowed role, then grant access
  const hasAccess = roles.some((r) => allowedRoles.includes(r));

  if (!hasAccess) {
    return <Navigate to="/admin8yut91b9e22a/main" replace />;
  }

  return null;
}
