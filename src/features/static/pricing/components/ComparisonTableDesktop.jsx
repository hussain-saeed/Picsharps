import { useContext } from "react";
import { LanguageContext } from "../../../../context/LanguageContext";
import { GiCheckMark } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";

import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import French from "/src/i18n/french.json";
import Portuguese from "/src/i18n/portuguese.json";
import Spanish from "/src/i18n/spanish.json";
import Hindi from "/src/i18n/hindi.json";
import Indonesian from "/src/i18n/indonesian.json";

const translations = {
  English,
  Arabic,
  French,
  Portuguese,
  Spanish,
  Hindi,
  Indonesian,
};

export default function ComparisonTableDesktop({ data }) {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  return (
    <div
      style={{
        borderRadius: "30px",
        border: "1px solid rgba(210, 210, 210)",
        overflow: "hidden",
        letterSpacing: "2px",
      }}
      className="w-full"
    >
      <div
        style={{ borderBottom: "1px solid rgba(210, 210, 210)" }}
        className="grid grid-cols-4 text-center"
      >
        <div
          className="p-6 text-left"
          style={{
            borderRight: "1px solid rgba(210, 210, 210)",
            backgroundColor: "rgba(230, 230, 230)",
            color: "black",
            fontSize: "22px",
            fontWeight: "600",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t["Feature"]}
        </div>

        {data.columns.map((col, index) => (
          <div
            key={col}
            className="p-6 last:border-r-0"
            style={{
              backgroundColor: index === 1 ? "#DFE8F3" : "rgba(230, 230, 230)",
              color: index === 1 ? "#00BCA9" : "black",
              borderRight: index === 2 ? "" : "1px solid rgba(210, 210, 210)",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            {col}
          </div>
        ))}
      </div>

      {data.features.map((section, idx) => (
        <div key={idx}>
          <div
            style={{
              backgroundColor: "rgb(240 240 240)",
              borderBottom: "1px solid rgba(210, 210, 210)",
            }}
            className="grid grid-cols-4 font-semibold text-gray-600"
          >
            <div
              className="w-full p-6"
              style={{
                backgroundColor: "rgb(240 240 240)",
                borderRight: "1px solid rgba(210, 210, 210)",
                color: "rgba(0, 176, 255, 1)",
                fontSize: "21px",
                fontWeight: "600",
              }}
            >
              {t[section.section]}
            </div>
          </div>

          {section.rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-4"
              style={{
                borderBottom:
                  idx === 3 && i === 1 ? "" : "1px solid rgba(210, 210, 210)",
              }}
            >
              <div
                className="p-6 border-r font-medium text-gray-700"
                style={{
                  borderRight: "1px solid rgba(210, 210, 210)",
                  backgroundColor: "rgba(230, 230, 230)",
                  color: "black",
                  fontSize: "20px",
                }}
              >
                {t[row.feature]}
              </div>

              {data.columns.map((col, cIdx) => {
                const val = row.values[col];
                return (
                  <div
                    key={cIdx}
                    className="flex items-center justify-center"
                    style={{
                      backgroundColor:
                        col === "Pro" ? "#DFE8F3" : "rgba(230, 230, 230)",
                      borderRight:
                        cIdx === 2 ? "" : "1px solid rgba(210, 210, 210)",
                      color: "black",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {val === true && (
                      <GiCheckMark className="w-5 h-5 mx-auto text-green-500" />
                    )}
                    {val === false && (
                      <RxCross1 className="w-5 h-5 mx-auto text-red-400" />
                    )}
                    {typeof val === "string" && (
                      <span className="font-semibold text-gray-700">
                        {t[val]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
