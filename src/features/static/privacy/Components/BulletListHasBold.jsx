import { useContext } from "react";
import { LanguageContext } from "../../../../context/LanguageContext";

function BulletListHasBold({ title, items, boldWords = [] }) {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  const renderTextWithBold = (text) => {
    const words = text.split(" ");

    return words.map((word, index) => (
      <span key={index}>
        {boldWords.includes(word) ? <strong>{word}</strong> : word}
        {index < words.length - 1 && " "}
      </span>
    ));
  };

  return (
    <div style={{ color: "rgba(102, 102, 102, 1)", lineHeight: "30px" }}>
      {title && (
        <h3 style={{ marginBottom: "3px" }}>{renderTextWithBold(title)}</h3>
      )}

      <ul
        style={{
          paddingRight: isRTL ? "30px" : "",
          paddingLeft: isRTL ? "0" : "30px",
          listStyleType: "disc",
        }}
      >
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: "3px" }}>
            {renderTextWithBold(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BulletListHasBold;
