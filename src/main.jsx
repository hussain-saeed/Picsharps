import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import AppRoutes from "./AppRoutes";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
);
