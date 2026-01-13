import { BiShowAlt } from "react-icons/bi";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import French from "/src/i18n/french.json";
import Portuguese from "/src/i18n/portuguese.json";
import Spanish from "/src/i18n/spanish.json";
import Hindi from "/src/i18n/hindi.json";
import Indonesian from "/src/i18n/indonesian.json";
import { useContext } from "react";
import { LanguageContext } from "../../../../context/LanguageContext";

const translations = {
  English,
  Arabic,
  French,
  Portuguese,
  Spanish,
  Hindi,
  Indonesian,
};

export default function ComparisonTableMobile({ data, onSelectFeature }) {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

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
            {t[section.section]}
          </div>

          {section.rows.map((row, i) => (
            <div
              key={i}
              className="w-full text-left p-6 bg-[rgba(230, 230, 230)] flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2"
              style={{
                borderBottom:
                  idx === 3 && i === 1 ? "" : "1px solid rgba(210, 210, 210)",
                color: "black",
                fontSize: "20px",
              }}
            >
              {t[row.feature]}
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
                {t["Show Details"]}
                <BiShowAlt />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
