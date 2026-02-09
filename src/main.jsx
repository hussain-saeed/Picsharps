import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { LanguageProvider, LanguageContext } from "./context/LanguageContext";
import { useContext } from "react";
import { Provider } from "react-redux";
import { adminStore } from "./admin/store/adminStore";

import AdminApp from "./admin/AdminApp";
import { ViewProvider } from "./context/ViewContext";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function AppWrapper() {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position={isRTL ? "top-left" : "top-right"}
        hideProgressBar
        rtl={isRTL}
        theme="colored"
        newestOnTop={true}
      />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <BrowserRouter>
      <Routes>
        {/* Admin Portal */}
        <Route
          path="/admin8yut91b9e22a/*"
          element={
            <Provider store={adminStore}>
              <AdminApp />
            </Provider>
          }
        />

        {/* User Portal */}
        <Route
          path="/*"
          element={
            <ViewProvider>
              <AuthProvider>
                <AppWrapper />
              </AuthProvider>
            </ViewProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </LanguageProvider>,
);
