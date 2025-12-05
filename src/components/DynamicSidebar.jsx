import { useScrollSpy } from "../hooks/useScrollSpy";

function DynamicSidebar({ items }) {
  const sectionIds = items.map((item) => item.targetId);
  const { activeId, scrollToSection } = useScrollSpy(sectionIds);

  return (
    <aside
      className="hidden lg:block lg:w-105 sticky top-32 h-fit bg-white py-10 pl-10 pr-16"
      style={{
        boxShadow: "0px 0px 4px 1px rgba(0, 140, 255, 0.25)",
        borderRadius: "30px",
      }}
    >
      <span style={{ fontSize: "20px", fontWeight: "700" }}>
        Quick Navigation
      </span>
      <nav className="mt-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.targetId)}
            className={`w-full px-6 py-3`}
            style={{
              background:
                activeId === item.targetId ? "var(--gradient-color)" : "white",
              color: activeId === item.targetId ? "white" : "black",
              borderRadius: "30px",
              fontWeight: activeId === item.targetId ? "600" : "400",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (activeId !== item.targetId) {
                e.currentTarget.style.background = "rgba(194, 236, 255, 1)";
                e.currentTarget.style.color = "rgba(0, 176, 255, 1)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeId !== item.targetId) {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "black";
              }
            }}
          >
            <div className="flex items-center">{item.label}</div>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default DynamicSidebar;
