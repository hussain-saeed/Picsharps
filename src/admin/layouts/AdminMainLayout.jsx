import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAdminAuth } from "../hooks/useAdminAuth";

function AdminMainLayout() {
  const { roles } = useSelector((s) => s.adminAuth);
  const { logoutAdmin } = useAdminAuth();

  console.log("[LAYOUT] roles:", roles);

  // define navigation links with allowed roles
  const links = [
    {
      name: "Test 1",
      path: "/admin/main/test1",
      allowedRoles: ["superadmin"],
    },
    {
      name: "Test 2",
      path: "/admin/main/test2",
      allowedRoles: ["superadmin"],
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>

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
