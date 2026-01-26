import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAdminAuth } from "../hooks/useAdminAuth";

function AdminMainLayout() {
  const { roles } = useSelector((s) => s.adminAuth);
  const { logoutAdmin } = useAdminAuth();
  const location = useLocation();

  console.log("[LAYOUT] roles:", roles);

  const links = [
    {
      name: "OverView",
      path: "/admin/main/overview",
      allowedRoles: ["superadmin"],
    },
    {
      name: "Active Users",
      path: "/admin/main/active-users",
      allowedRoles: ["superadmin"],
    },
  ];

  // Determine the active link based on the current location and user roles
  const activeLink = links.find(
    (link) =>
      link.path === location.pathname &&
      link.allowedRoles.some((r) => roles.includes(r)),
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>{activeLink ? activeLink.name : "Admin Panel"}</h2>

      <ul style={{ display: "flex", gap: 20 }}>
        {links.map((link) => {
          const canView = link.allowedRoles.some((r) => roles.includes(r));
          if (!canView) return null;

          return (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-blue-600 underline"
                    : "text-gray-700"
                }
              >
                {link.name}
              </NavLink>
            </li>
          );
        })}
        <li>
          <button onClick={logoutAdmin}>Logout</button>
        </li>
      </ul>

      <hr />

      <Outlet />
    </div>
  );
}

export default AdminMainLayout;
