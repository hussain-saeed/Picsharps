import { BiShowAlt } from "react-icons/bi";

export default function ComparisonTableMobile({ data, onSelectFeature }) {
  return (
    <div
      className="md:w-[70%] w-full mx-auto"
      style={{
        border: "1px solid rgba(210, 210, 210)",
        borderRadius: "30px",
        overflow: "hidden",
      }}
    >
      {data.features.map((section, idx) => (
        <div key={idx}>
          <div
            className="bg-[rgb(240 240 240)] p-6"
            style={{
              borderBottom: "1px solid rgba(210, 210, 210)",
              color: "rgba(0, 176, 255, 1)",
              fontSize: "21px",
              fontWeight: "600",
            }}
          >
            {section.section}
          </div>

          {section.rows.map((row, i) => (
            <div
              key={i}
              className="w-full text-left p-6 bg-[rgba(230, 230, 230)] flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2"
              style={{
                borderBottom: idx === 3 && i === 1 ? "" : "1px solid rgba(210, 210, 210)",
                color: "black",
                fontSize: "20px",
              }}
            >
              {row.feature}
              <button
                onClick={() => onSelectFeature(row)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  gap: "5px",
                  fontSize: "14px",
                  color: "rgb(80 80 80)",
                }}
              >
                Show Details
                <BiShowAlt />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
