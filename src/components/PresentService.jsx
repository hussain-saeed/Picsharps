import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import ImageCompare from "./ImageCompare";

const PresentService = ({
  isTextFirst,
  isStatic,
  staticImgSrc,
  before,
  after,
  background,
  aspectRatio,
  fit,
  category,
  title,
  description,
  linkTo,
  innerLinkText,
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
        flex flex-col items-center lg:flex-row justify-center gap-12
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
            {category && (
              <span
                style={{
                  color: "rgba(114, 134, 255, 1)",
                  fontSize: "14px",
                  fontWeight: "600",
                  letterSpacing: "4px",
                }}
              >
                {category}
              </span>
            )}
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
              className={`mx-auto ${
                isRTL ? "lg:mr-0" : "lg:ml-0"
              } mb-8 lg:mb-0`}
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

          <div className="w-[92%] lg:w-[48.5%]">
            {isStatic === true ? (
              <div>
                <img src={staticImgSrc} />
              </div>
            ) : (
              <ImageCompare
                hasBorder={true}
                before={before}
                after={after}
                background={background}
                aspectRatio={aspectRatio}
                fit={fit}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="w-[92%] lg:w-[48.5%]">
            {isStatic === true ? (
              <div
                style={{
                  border: "5px solid white",
                  borderRadius: "25px",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  overflow: "hidden",
                }}
              >
                <img src={staticImgSrc} />
              </div>
            ) : (
              <ImageCompare
                hasBorder={true}
                before={before}
                after={after}
                background={background}
                aspectRatio={aspectRatio}
                fit={fit}
              />
            )}
          </div>

          <div
            className={`flex flex-col lg:w-[46%] ${
              isRTL ? "lg:text-right" : "lg:text-left"
            } text-center`}
          >
            {category && (
              <span
                style={{
                  color: "rgba(114, 134, 255, 1)",
                  fontSize: "14px",
                  fontWeight: "600",
                  letterSpacing: "4px",
                }}
              >
                {category}
              </span>
            )}
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
              className={`mx-auto ${
                isRTL ? "lg:mr-0" : "lg:ml-0"
              } mb-8 lg:mb-0`}
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
