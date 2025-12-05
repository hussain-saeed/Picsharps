import { useContext } from "react";
import { LanguageContext } from "../../../../context/LanguageContext";

const BorderedBox = ({ title, description, borderColor, bgColor }) => {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <div
      style={{
        borderRight: isRTL ? `8px solid ${borderColor}` : "",
        borderLeft: isRTL ? "" : `8px solid ${borderColor}`,
        borderRadius: "25px",
        backgroundColor: bgColor,
        padding: "30px 20px",
      }}
    >
      <h3
        style={{
          color: "rgba(102, 102, 102, 1)",
          fontWeight: "600",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          style={{
            color: "rgba(102, 102, 102, 1)",
            fontSize: "14px",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default BorderedBox;
