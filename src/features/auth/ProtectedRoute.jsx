import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom"; // لو بتستخدم react-router

// رابر لأي كومبوننت محتاج حماية
const ProtectedRoute = ({ children }) => {
  const { userData } = useAuth();

  if (!userData) return <Navigate to="/" />; // لو مش لوجين يرجع للهوم

  return children;
};

export default ProtectedRoute;
