import { useContext } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import Container from "/src/components/Container";
import ImageCompare from "../../../../components/ImageCompare";
import { Link } from "react-router-dom";

function Hero() {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

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
          DESIGN EASILY
        </h1>
        <p
          className="w-[85%] lg:w-[60%]"
          style={{
            marginBottom: "62px",
            color: "rgba(0, 0, 0, 1)",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          Enhance, retouch, remove backgrounds, and create stunning visuals in
          seconds — no design skills needed.
        </p>

        <div
          className={`flex justify-center items-center lg:justify-between flex-wrap gap-6 mb-[100px] ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className=" overflow-hidden rounded-[30px] w-[92%] lg:w-[48.5%]">
            <ImageCompare
              before="/images/IMG_20251116_173437.jpg"
              after="/images/pexels-christian-heitz-285904-842711.jpg"
              aspectRatio="12/8"
              fit="fill"
            />
          </div>

          <Link
            to="ai-image-enhancer"
            style={{
              border: "2px dashed rgba(0, 0, 0, 0.31)",
              textAlign: "center",
              cursor: "pointer",
              borderRadius: "20px",
            }}
            className="lg:w-[48.5%] w-[92%] lg:p-17 p-6"
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
                Drag & Drop or Click to Upload
              </h2>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "300",
                }}
              >
                PNG, JPG, JPEG --- Max size 10MB
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
                  Upload Image
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
