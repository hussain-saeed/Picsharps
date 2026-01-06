import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import Container from "/src/components/Container";
import ImageCompare from "../../../../components/ImageCompare";
import { Link } from "react-router-dom";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import Loader from "../../../../components/Loader";

const translations = { English, Arabic };

function Hero() {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-(--secondary-section-color) flex">
      <Container className="flex flex-col items-center">
        <h1
          className="text-[40px] sm:text-[90px]"
          style={{
            marginTop: "130px",
            marginBottom: "14px",
            background: "var(--gradient-color)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "900",
            textAlign: "center",
          }}
        >
          {t["DESIGN EASILY"]}
        </h1>
        <div
          style={{
            marginBottom: "62px",
            color: "rgba(0, 0, 0, 1)",
            fontSize: "20px",
            textAlign: "center",
          }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <p>
            {
              t[
                "Enhance, retouch, remove backgrounds, and create stunning visuals in seconds."
              ]
            }
          </p>
          <p>{t["No design skills needed."]}</p>
        </div>
        <div
          className={`flex justify-center items-center lg:justify-between flex-wrap gap-6 mb-[100px] relative ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {loading ? <Loader className={`absolute mb-56`} /> : ""}
          <div
            className={`w-[92%] lg:w-[48.5%] ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          >
            <ImageCompare
              before="/images/IMG_20251116_173437.jpg"
              after="/images/pexels-christian-heitz-285904-842711.jpg"
              background="rgb(245, 245, 245)"
              aspectRatio="12/8"
              fit="fill"
              loading={loading}
            />
          </div>
          <Link
            to={loading ? "" : "ai-image-enhancer"}
            style={{
              border: "2px dashed rgba(0, 0, 0, 0.31)",
              textAlign: "center",
              cursor: loading ? "default" : "pointer",
              borderRadius: "20px",
              opacity: loading ? "0" : "1",
            }}
            className="lg:w-[48.5%] w-[92%] lg:p-10 xl:p-20 2xl:p-31 p-12"
          >
            <div>
              <div
                style={{
                  backgroundColor: "rgba(195, 231, 249, 1)",
                  width: "fit-content",
                  padding: "20px",
                  borderRadius: "50%",
                  margin: "auto",
                  marginBottom: "14px",
                }}
              >
                <img src="/images/upload.png" />
              </div>
              <h2
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "20px",
                }}
              >
                {t["Drag & Drop or Click to Upload"]}
              </h2>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "300",
                }}
                className="space-x-1"
              >
                <span>PNG, JPG, JPEG --</span>
                <span>{t["Max size 10MB"]}</span>
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "25px",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    display: "block",
                    background: "var(--gradient-color)",
                    width: "250px",
                    textAlign: "center",
                    padding: "10px 55px",
                    color: "white",
                    borderRadius: "20px",
                  }}
                >
                  {t["Upload Image"]}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default Hero;
