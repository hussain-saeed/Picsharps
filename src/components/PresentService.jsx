import { useContext, useEffect, useState } from "react";
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
  isNeedArrow,
}) => {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const [isLg, setIsLg] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsLg(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`
        flex flex-col lg:flex-row items-center justify-center gap-12
        ${isRTL ? "lg:flex-row-reverse" : "lg:flex-row"}
      `}
    >
      {isTextFirst && isLg ? (
        <>
          <div
            className={`flex flex-col lg:w-[46%] ${
              isRTL ? "lg:text-right" : "lg:text-left"
            } text-center`}
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
              className={`mx-auto ${
                isRTL ? "lg:mr-0" : "lg:ml-0"
              } lg:text-justify mb-8`}
              dir={isRTL ? "rtl" : "ltr"}
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
                borderRadius: "20px",
              }}
              to={linkTo}
            >
              {innerLinkText}
            </Link>
          </div>
          <div>
            <img src={imageSrc} alt={title} />
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "relative" }}>
            <img src={imageSrc} alt={title} />
            {isNeedArrow === true ? (
              <img
                src="/images/vector-2.png"
                alt="arrow"
                style={{
                  position: "absolute",
                  bottom: "50%",
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                }}
              />
            ) : (
              ""
            )}
          </div>

          <div
            className={`flex flex-col lg:w-[46%] ${
              isRTL ? "lg:text-right" : "lg:text-left"
            } text-center`}
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
              className={`mx-auto ${
                isRTL ? "lg:mr-0" : "lg:ml-0"
              } lg:text-justify mb-8`}
              dir={isRTL ? "rtl" : "ltr"}
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
                borderRadius: "20px",
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
