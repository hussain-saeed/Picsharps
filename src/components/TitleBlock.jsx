import { useContext } from "react";
import { LanguageContext } from "/src/context/LanguageContext";

function TitleBlock({ subtitle, title, description }) {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <div className="py-[62px] text-center">
      {subtitle && (
        <span
          className="font-semibold text-white mb-[25px] inline-block"
          style={{
            background: "var(--gradient-color)",
            letterSpacing: "3px",
            padding: "6px 18px",
            border: "1px solid white",
          }}
        >
          {subtitle}
        </span>
      )}
      <h1 className="font-black text-[30px] sm:text-[48px] mb-1">{title}</h1>
      <p dir={isRTL ? "rtl" : "ltr"} className="max-w-[800px] mx-auto">
        {description}
      </p>
    </div>
  );
}

export default TitleBlock;
