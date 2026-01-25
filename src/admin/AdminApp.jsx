import AdminRoutes from "./routes/AdminRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";

function AdminApp() {
  return (
    <>
      <AdminRoutes />
      <ToastContainer hideProgressBar theme="colored" newestOnTop={true} />
    </>
  );
}

export default AdminApp;
