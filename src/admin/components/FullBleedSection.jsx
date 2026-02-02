// components/FullBleedSection.jsx
export function FullBleedSection({ children, bg = "", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-y-0 -z-10`}
        style={{
          left: "-2rem",
          right: "-100vw",
          background: `${bg}`,
        }}
      />
      <div className="relative w-full">{children}</div>
    </div>
  );
}
