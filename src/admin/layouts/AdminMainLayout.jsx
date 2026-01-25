import { NavLink, Outlet } from "react-router-dom";

function AdminMainLayout() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>

      <ul style={{ display: "flex", gap: 20 }}>
        <li>
          <NavLink to="/admin/main/test1">Test 1</NavLink>
        </li>
        <li>
          <NavLink to="/admin/main/test2">Test 2</NavLink>
        </li>
      </ul>

      <hr />

      <Outlet />
    </div>
  );
}

export default AdminMainLayout;
