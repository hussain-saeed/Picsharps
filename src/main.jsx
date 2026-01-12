import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { LanguageProvider, LanguageContext } from "./context/LanguageContext";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import { useContext } from "react";

const translations = { English, Arabic };

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function AppWrapper() {
  const { language, direction } = useContext(LanguageContext);
  const t = translations[language] || translations["English"];
  const isRTL = direction === "rtl";

  return (
    <>
      <AppRoutes t={t} isRTL={isRTL} />
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
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  </LanguageProvider>
);
