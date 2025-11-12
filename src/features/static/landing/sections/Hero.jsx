import { useContext } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import Container from "/src/components/Container";

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
          className={`flex justify-center lg:justify-between flex-wrap gap-6 mb-[100px] ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div
            style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
            className=" overflow-hidden rounded-[30px] w-[90%] lg:w-[48.5%]"
          >
            <img
              src="/images/hero.gif"
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            style={{
              border: "2px dashed rgba(0, 0, 0, 0.31)",
              padding: "70px",
              textAlign: "center",
              cursor: "pointer",
              borderRadius: "20px",
            }}
            className="lg:w-[48.5%] w-[90%]"
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
              <span
                style={{
                  display: "block",
                  background: "var(--gradient-color)",
                  margin: "auto",
                  marginTop: "30px",
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
        </div>
      </Container>
    </div>
  );
}

export default Hero;
