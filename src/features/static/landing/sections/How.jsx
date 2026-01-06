import React, { useContext } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import Container from "/src/components/Container";
import TitleBlock from "/src/components/TitleBlock";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";

const translations = { English, Arabic };

const How = () => {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  const data = [
    { id: 1, img: "/images/click-1.png", text: t["Choose AI tool"] },
    { id: 2, img: "/images/upload-1.png", text: t["Upload your photo"] },
    {
      id: 3,
      img: "/images/light-bolt-1.png",
      text: t["Apply changes instantly"],
    },
    { id: 4, img: "/images/download-1.png", text: t["Download or export"] },
  ];

  return (
    <div className="pb-24" style={{ backgroundColor: "rgba(238, 238, 238)" }}>
      <Container>
        <TitleBlock
          title={t["HOW IT WORKS"]}
          description={
            t[
              "Transform your photos in just 4 simple steps — no technical skills required"
            ]
          }
        />
        <div
          className={`flex flex-col lg:flex-row ${
            isRTL ? "lg:flex-row-reverse" : ""
          } justify-center gap-18 relative`}
        >
          <div
            style={{ backgroundColor: "rgba(195, 231, 249, 1)", zIndex: 0 }}
            className="absolute w-[75%] h-0.5 hidden lg:block top-15 "
          ></div>

          <div
            style={{ backgroundColor: "rgba(195, 231, 249, 1)", zIndex: 0 }}
            className="absolute w-0.5 h-[95%] block lg:hidden left-[50%]"
          ></div>

          {data.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="relative flex flex-col items-center text-center">
                <div
                  style={{
                    backgroundColor: "rgba(0, 176, 255, 1)",
                    color: "white",
                    fontWeight: "700",
                  }}
                  className="absolute -top-4 z-10 rounded-full w-[38px] h-[38px] flex items-center justify-center"
                >
                  {step.id}
                </div>

                {index < 3 ? (
                  <img
                    className="block lg:hidden"
                    src="/images/right-arrow-2.png"
                    alt="Arrow"
                    style={{
                      transform: "rotate(90deg)",
                      position: "absolute",
                      bottom: "-40px",
                      left: "43%",
                    }}
                  />
                ) : (
                  ""
                )}

                <div
                  className="w-32 h-32 flex items-center justify-center"
                  style={{
                    border: "2px solid rgba(195, 231, 249, 1)",
                    borderRadius: "20px",
                    backgroundColor: "rgba(238, 238, 238)",
                  }}
                >
                  <img
                    src={step.img}
                    alt={`Step ${step.id}`}
                    className="object-contain"
                  />
                </div>

                <span
                  style={{
                    color: "rgba(0, 0, 0, 1)",
                    fontWeight: "500",
                    fontSize: "14px",
                    backgroundColor: "rgba(238, 238, 238)",
                  }}
                  className="mt-[25px] py-1 lg:py-0"
                >
                  {step.text}
                </span>
              </div>

              {index < data.length - 1 && (
                <div className="hidden lg:block mt-16">
                  {isRTL ? (
                    <img
                      src="/images/right-arrow-2.png"
                      alt="Arrow"
                      style={{ transform: "rotate(180deg)" }}
                    />
                  ) : (
                    <img src="/images/right-arrow-2.png" alt="Arrow" />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default How;
