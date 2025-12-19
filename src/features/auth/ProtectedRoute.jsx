import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userData } = useAuth();

  if (!userData) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
