import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminMainLayout from "../layouts/AdminMainLayout";
import OverviewWholePage from "../pages/overview/OverviewWholePage";
import AdminGate from "../guards/AdminGate";
import RequireAdminAuth from "../guards/RequireAdminAuth";
import RequireRole from "../guards/RequireRole";
import AdminMainIndex from "../pages/AdminMainIndex";
import AdminNotFound from "../pages/AdminNotFound";
import RedirectIfAdmin from "../guards/RedirectIfAdmin";
import AllUsers from "../pages/all-users/AllUsers";
import SuspendedUsers from "../pages/suspended-users/SuspendedUsers";

function AdminRoutes() {
  return (
    <Routes>
      {/* /admin */}
      <Route index element={<AdminGate />} />

      {/* /admin/login */}
      <Route element={<RedirectIfAdmin />}>
        <Route path="login" element={<AdminLogin />} />
      </Route>

      {/* protected area */}
      <Route element={<RequireAdminAuth />}>
        <Route path="main" element={<AdminMainLayout />}>
          {/* /admin/main */}
          <Route index element={<AdminMainIndex />} />

          {/* can add other allowed roles here */}
          <Route
            path="overview"
            element={
              <>
                <RequireRole allowedRoles={["superadmin"]} />
                <OverviewWholePage />
              </>
            }
          />

          <Route
            path="all-users"
            element={
              <>
                <RequireRole allowedRoles={["superadmin"]} />
                <AllUsers />
              </>
            }
          />

          <Route
            path="suspended-users"
            element={
              <>
                <RequireRole allowedRoles={["superadmin"]} />
                <SuspendedUsers />
              </>
            }
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<AdminNotFound />} />
    </Routes>
  );
}

export default AdminRoutes;
