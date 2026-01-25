import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// redirect logged-in admins away from login page
export default function RedirectIfAdmin() {
  const { admin, isLoading } = useSelector((s) => s.adminAuth);

  console.log("[GUARD] RedirectIfAdmin:", { admin, isLoading });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (admin) {
    console.log("[REDIRECT] already logged in → /admin/main");
    return <Navigate to="/admin/main" replace />;
  }

  return <Outlet />;
}
