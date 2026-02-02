import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import HugeLoader from "../components/HugeLoader";

export default function RedirectIfAdmin() {
  const { admin, isLoading } = useSelector((s) => s.adminAuth);
  const [isDelaying, setIsDelaying] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsDelaying(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || isDelaying) {
    return <HugeLoader />;
  }

  if (admin) {
    return <Navigate to="/admin8yut91b9e22a/main" replace />;
  }

  return <Outlet />;
}
