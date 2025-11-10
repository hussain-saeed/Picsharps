import { useContext } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import { Link } from "react-router-dom";
import Container from "../../../components/Container";
function Ready() {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <div className="text-center bg-(--secondary-section-color) py-[87px]">
      <Container>
        <div
          style={{
            background: "var(--gradient-color)",
            paddingTop: "52px",
            paddingBottom: "52px",
            borderRadius: "30px",
          }}
          className="px-8 md:px-[52px]"
        >
          <h2
            style={{
              fontWeight: "900",
              color: "white",
              marginBottom: "20px",
              lineHeight: "1.3",
            }}
            className="text-[38px] md:text-[48px]"
          >
            Ready To Transform Your Photos?
          </h2>
          <p
            style={{
              fontSize: "20px",
              color: "rgba(255, 255, 255, 1)",
            }}
            className="lg:w-[55%] mx-auto mb-10"
          >
            Join thousands of users creating stunning visuals with AI-powered
            photo editing
          </p>
          <Link
            className={`bg-white px-10 py-1.5 flex gap-3 w-fit mx-auto ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{ borderRadius: "50px" }}
          >
            <img src="/images/sparkles.png" />
            <span style={{ color: "rgba(0, 0, 0, 1)", fontWeight: "600" }}>
              Try Now for Free
            </span>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default Ready;
