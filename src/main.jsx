import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/auth/AuthProvider";
import LoginPopup from "./features/auth/LoginPopup";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);
