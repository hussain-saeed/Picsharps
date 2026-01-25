import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// protect /admin route
export default function AdminGate() {
  const { admin, isLoading } = useSelector((s) => s.adminAuth);

  console.log("[GUARD] AdminGate:", { admin, isLoading });

  if (isLoading) return <p>Loading...</p>;

  if (!admin) {
    console.log("[REDIRECT] /admin → /admin/login");
    return <Navigate to="/admin/login" replace />;
  }

  console.log("[REDIRECT] /admin → /admin/main");
  return <Navigate to="/admin/main" replace />;
}
