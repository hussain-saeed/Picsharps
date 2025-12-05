import ParagraphHasBold from "../../../../components/ParagraphHasBold";

function IconBox({ borderColor, backgroundColor, icon, title, desc, bold }) {
  return (
    <div
      style={{
        border: `2px solid ${borderColor}`,
        backgroundColor: backgroundColor,
        borderRadius: "15px",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        <div className="w-8 h-6.5 flex items-start justify-center">
          <img src={icon} alt={title} />
        </div>
        <p style={{ fontSize: "15px", fontWeight: "700" }}>{title}</p>
      </div>
      {desc && (
        <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
          <div className="w-8 h-6.5 flex items-start justify-center"></div>
          <div>
            <ParagraphHasBold bold={bold}>{desc}</ParagraphHasBold>
          </div>
        </div>
      )}
    </div>
  );
}

export default IconBox;
