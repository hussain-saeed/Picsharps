import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// protect admin routes that require authentication
export default function RequireAdminAuth() {
  const { admin, isLoading } = useSelector((s) => s.adminAuth);

  console.log("[GUARD] RequireAdminAuth:", { admin, isLoading });

  if (isLoading) {
    return <p>Loading admin...</p>;
  }

  if (!admin) {
    console.log("[REDIRECT] not logged → /admin/login");
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
