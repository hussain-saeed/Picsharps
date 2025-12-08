import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom"; // لو بتستخدم react-router

// رابر لأي كومبوننت محتاج حماية
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />; // لو مش لوجين يرجع للهوم

  return children;
};

export default ProtectedRoute;
