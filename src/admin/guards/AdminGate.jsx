import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HugeLoader from "../components/HugeLoader";

export default function AdminGate() {
  const { admin, isLoading } = useSelector((s) => s.adminAuth);
  const [isDelaying, setIsDelaying] = useState(true); 

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsDelaying(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  console.log("[GUARD] AdminGate:", { admin, isLoading, isDelaying });

  if (isLoading || isDelaying) {
    return <HugeLoader />;
  }

  if (!admin) {
    console.log("[REDIRECT] /admin → /admin/login");
    return <Navigate to="/admin8yut91b9e22a/login" replace />;
  }

  console.log("[REDIRECT] /admin → /admin/main");
  return <Navigate to="/admin8yut91b9e22a/main" replace />;
}
