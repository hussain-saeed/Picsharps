// components/FullBleedSection.jsx
export function FullBleedSection({ children, bg = "", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {/* الخلفية تمتد لليسار لتلمس السايد بار، ولليمين لآخر الشاشة */}
      <div
        className={`absolute inset-y-0 -z-10`}
        style={{
          left: "-2rem", // يغطي الـ padding (px-8) بتاع الـ main
          right: "-100vw", // يغطي أي مساحة بيضاء جهة اليمين
          background: `${bg}`,
        }}
      />
      <div className="relative w-full">{children}</div>
    </div>
  );
}
