import { X } from "lucide-react";
import { GiCheckMark } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
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

export default function FeatureModal({ feature, onClose }) {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  if (!feature) return null;

  return (
    <div
      className="
        fixed inset-0 
        bg-black/50 
        backdrop-blur-sm 
        flex items-center justify-center 
        z-200
      "
    >
      <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-lg relative">
        <h2 className={`text-xl font-semibold mb-4`}>{feature.feature}</h2>

        <div className="mb-5">
          {Object.keys(feature.values).map((key, index) => (
            <div
              key={key}
              className="flex justify-between"
              style={{
                borderBottom: index === 2 ? "" : "2px solid #B0B0B0",
                padding: "10px",
              }}
            >
              <span
                className={`font-medium ${
                  index === 1 ? "text-[#00BCA9]" : "text-gray-600"
                }`}
              >
                {t[key]}
              </span>
              <span
                className={`font-semibold ${
                  index === 1 ? "text-[#00BCA9]" : "text-gray-800"
                }`}
              >
                {feature.values[key] === true && (
                  <GiCheckMark className="w-5 h-5 mx-auto text-green-500" />
                )}
                {feature.values[key] === false && (
                  <RxCross1 className="w-5 h-5 mx-auto text-red-400" />
                )}
                {typeof feature.values[key] === "string" &&
                  t[feature.values[key]]}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <button
            style={{
              background: "var(--gradient-color)",
              padding: "4px 14px",
              color: "white",
              fontWeight: "600",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            className="shadow-md"
            onClick={onClose}
          >
            {t["OK"]}
          </button>
        </div>
      </div>
    </div>
  );
}
