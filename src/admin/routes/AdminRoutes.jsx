import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminMainLayout from "../layouts/AdminMainLayout";
import Test1 from "../pages/Test1";
import Test2 from "../pages/Test2";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route path="main" element={<AdminMainLayout />}>
        <Route path="test1" element={<Test1 />} />
        <Route path="test2" element={<Test2 />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
