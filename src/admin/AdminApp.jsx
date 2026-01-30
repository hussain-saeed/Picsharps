import AdminRoutes from "./routes/AdminRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useAdminAuth } from "./hooks/useAdminAuth";

function AdminBootstrap() {
  const { refreshAdmin } = useAdminAuth();

  useEffect(() => {
    refreshAdmin();

    const interval = setInterval(
      () => {
        refreshAdmin();
      },
      10 * 60 * 1000,
    );

    document.documentElement.style.height = "100%";
    document.documentElement.style.backgroundColor = "rgb(100, 255, 255, 0.05)";

    return () => {
      clearInterval(interval);
      document.documentElement.style.height = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  return null;
}

function AdminApp() {
  return (
    <>
      <AdminBootstrap />
      <AdminRoutes />
      <ToastContainer hideProgressBar theme="colored" newestOnTop={true} />
    </>
  );
}

export default AdminApp;
