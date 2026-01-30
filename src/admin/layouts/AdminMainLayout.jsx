import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  HiOutlineViewGrid,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiMenuAlt2,
  HiX,
} from "react-icons/hi";
import { LuUserRoundX, LuUsersRound } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { LiaUser } from "react-icons/lia";
import { FullBleedSection } from "../components/FullBleedSection";

function AdminMainLayout() {
  const { roles } = useSelector((s) => s.adminAuth);
  const { logoutAdmin } = useAdminAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    {
      name: "Overview",
      path: "/admin/main/overview",
      allowedRoles: ["superadmin"],
      icon: <HiOutlineViewGrid />,
      category: "DASHBOARD",
    },
    {
      name: "All Users",
      path: "/admin/main/all-users",
      allowedRoles: ["superadmin"],
      icon: <LuUsersRound />,
      category: "USER MANAGEMENT",
    },
    {
      name: "Suspended Users",
      path: "/admin/main/suspended-users",
      allowedRoles: ["superadmin"],
      icon: <LuUserRoundX />,
      category: "USER MANAGEMENT",
    },
    {
      name: "Plans",
      path: "/admin/main/plans",
      allowedRoles: ["superadmin"],
      icon: <HiOutlineCreditCard />,
      category: "BILLING",
    },
    {
      name: "Settings",
      path: "/admin/main/settings",
      allowedRoles: ["superadmin"],
      icon: <HiOutlineCog />,
      category: "SETTINGS",
    },
  ];

  const categories = ["DASHBOARD", "USER MANAGEMENT", "BILLING", "SETTINGS"];
  const activeLink = links.find((l) => l.path === location.pathname);

  const SidebarContent = ({ closeSidebar }) => (
    // أضفنا h-screen و overflow-y-auto هنا لضمان سكرول داخلي نظيف
    <div className="flex flex-col h-screen py-6 text-white overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="px-7.5 mb-8 flex flex-col shrink-0">
        <div className="text-2xl font-semibold tracking-tight flex items-center gap-2 mb-4">
          <img src="/images/logo.png" alt="logo" />
          <span>Picsharps</span>
        </div>
        <span className="text-xs text-gray-500 tracking-[0.2em] font-medium">
          Admin Dashboard
        </span>
      </div>

      <div className="pl-4 pr-7 mb-8">
        <div className="w-full h-1 border-b border-white/10"></div>
      </div>

      <nav className="flex-1 pl-4 pr-7 space-y-8">
        {categories.map((cat) => {
          const catLinks = links.filter(
            (l) =>
              l.category === cat &&
              l.allowedRoles.some((r) => roles.includes(r)),
          );
          if (catLinks.length === 0) return null;
          return (
            <div key={cat} className="space-y-2">
              <h3 className="px-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {cat}
              </h3>
              <ul className="space-y-1">
                {catLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      onClick={closeSidebar}
                      className={({ isActive }) => `
                        flex items-center gap-2 px-3.5 py-2.5 rounded-lg transition-all
                        ${isActive ? "bg-white/10 text-white border-l-4 border-[#00B0FF] cursor-default" : "text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent"}
                      `}
                    >
                      <span className="text-xl">{link.icon}</span>
                      <span className="text-sm font-medium">{link.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <button
          onClick={logoutAdmin}
          className="w-full flex items-center gap-2 px-5 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all -mt-6.5"
        >
          <FiLogOut style={{ fontSize: "20px" }} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <div className="mx-auto max-w-[1900px] flex relative">
        {/* ---------- Sidebar Desktop ---------- */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div
            className="fixed top-0 h-screen w-73 z-40 bg-[#1B2337]"
            style={{
              // تم تقليل الظل ليكون لليسار فقط ومنع أي تداخل مع المحتوى
              boxShadow: "-100vw 0 0 100vw #1B2337",
            }}
          >
            {/* أضفنا overflow-hidden هنا لمنع أي سكرول جانبي ناتج عن الظل أو المحتوى */}
            <div className="relative w-full h-full border-r border-white/5 overflow-hidden">
              <SidebarContent />
            </div>
          </div>
        </aside>

        {/* ---------- Mobile Sidebar ---------- */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-all ${isSidebarOpen ? "visible" : "invisible"}`}
        >
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsSidebarOpen(false)}
          />
          <div
            className={`absolute inset-y-0 left-0 w-72 bg-[#1B2337] transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-5 right-4 text-white/70 text-2xl"
            >
              <HiX />
            </button>
            <SidebarContent closeSidebar={() => setIsSidebarOpen(false)} />
          </div>
        </div>

        {/* ================= MAIN AREA ================= */}
        <main className="flex-1 flex flex-col min-w-0 px-8">
          <FullBleedSection
            bg="bg-white shadow-md border-b border-gray-100"
            className="sticky top-0 z-30"
          >
            <div className="h-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden text-2xl text-gray-500 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <HiMenuAlt2 />
                </button>
                <h2 className="text-xl font-bold text-gray-800">
                  {activeLink?.name || "Dashboard"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ background: "var(--griedant-color)" }}
                >
                  <LiaUser />
                </div>
                <p className="hidden sm:block text-sm font-bold text-gray-900">
                  Admin User
                </p>
              </div>
            </div>
          </FullBleedSection>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminMainLayout;
