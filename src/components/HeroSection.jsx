import { LanguageContext } from "/src/context/LanguageContext";
import { useContext } from "react";

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

function HeroSection({ content }) {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  return (
    <div
      style={{ paddingTop: "190px", marginBottom: "70px", textAlign: "center" }}
    >
      {content.imageUrl && (
        <div className="mb-12">
          <img src={content.imageUrl} alt={content.title} className="mx-auto" />
        </div>
      )}

      <h1
        style={{
          fontSize: "48px",
          fontWeight: "900",
          letterSpacing: "2px",
          background: "var(--gradient-color-2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "12px",
        }}
      >
        {t[content.title]}
      </h1>

      <div className="space-y-3">
        {content.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            style={{
              fontSize: index === 0 ? "16px" : "14px",
              color: index === 0 ? "black" : "rgb(140, 140, 140)",
              letterSpacing: "2px",
              fontWeight: "500",
            }}
          >
            {t[paragraph]}
          </p>
        ))}
      </div>
    </div>
  );
}

export default HeroSection;
