import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { Link } from "react-router-dom";

const PresentService = ({
  isTextFirst,
  imageSrc,
  category,
  title,
  description,
  linkTo,
  innerLinkText,
}) => {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <div
      className={`
        flex flex-col lg:flex-row items-center lg:items-space-between gap-10 lg:gap-[100px]
        ${isRTL ? "lg:flex-row-reverse" : "lg:flex-row"}
      `}
    >
      {isTextFirst ? (
        <>
          <div
            className={`flex flex-col ${
              isRTL ? "lg:text-right" : "lg:text-left"
            } lg:flex-1 text-center`}
          >
            {category && <span>{category}</span>}
            <h2
              style={{
                marginBottom: "8px",
                color: "rgba(0, 0, 0, 0.933)",
                fontWeight: "900",
              }}
              className="text-[24px] sm:text-[32px]"
            >
              {title}
            </h2>
            <p
              className={`w-[90%] mx-auto ${
                isRTL ? "lg:mr-0" : "lg:ml-0"
              } mb-8`}
            >
              {description}
            </p>
            <Link
              className={`mx-auto ${isRTL ? "lg:mr-0" : "lg:ml-0"} mb-8`}
              style={{
                background: "var(--gradient-color)",
                width: "250px",
                textAlign: "center",
                padding: "10px 55px",
                color: "white",
                borderRadius: "10px",
              }}
              to={linkTo}
            >
              {innerLinkText}
            </Link>
          </div>

          <div className="lg:flex-1">
            <img src={imageSrc} alt={title} />
          </div>
        </>
      ) : (
        <>
          <div className="lg:flex-1">
            <img src={imageSrc} alt={title} />
          </div>

          <div
            className={`flex flex-col ${
              isRTL ? "lg:text-right" : "lg:text-left"
            } lg:flex-1 text-center`}
          >
            {category && <span>{category}</span>}
            <h2
              style={{
                marginBottom: "8px",
                color: "rgba(0, 0, 0, 0.933)",
                fontWeight: "900",
              }}
              className="text-[24px] sm:text-[32px]"
            >
              {title}
            </h2>
            <p
              className={`w-[90%] mx-auto ${
                isRTL ? "lg:mr-0" : "lg:ml-0"
              } mb-8`}
            >
              {description}
            </p>
            <Link
              className={`mx-auto ${isRTL ? "lg:mr-0" : "lg:ml-0"} mb-8`}
              style={{
                background: "var(--gradient-color)",
                width: "250px",
                textAlign: "center",
                padding: "10px 55px",
                color: "white",
                borderRadius: "10px",
              }}
              to={linkTo}
            >
              {innerLinkText}
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PresentService;
