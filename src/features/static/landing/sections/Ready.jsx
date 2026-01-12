import { useContext } from "react";
import { LanguageContext } from "../../../../context/LanguageContext";
import { Link } from "react-router-dom";
import Container from "../../../../components/Container";

import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import French from "/src/i18n/french.json";
import Portuguese from "/src/i18n/portuguese.json";
import Spanish from "/src/i18n/spanish.json";
import Hindi from "/src/i18n/hindi.json";
import Indonesian from "/src/i18n/indonesian.json";

const translations = {
  English,
  Arabic,
  French,
  Portuguese,
  Spanish,
  Hindi,
  Indonesian,
};

function Ready() {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

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
            {t["Ready To Transform Your Photos?"]}
          </h2>
          <p
            style={{
              fontSize: "20px",
              color: "rgba(255, 255, 255, 1)",
            }}
            className="lg:w-[50%] mx-auto mb-10"
          >
            {
              t[
                "Join thousands of users creating stunning visuals with AI-powered photo editing"
              ]
            }
          </p>
          <Link
            className={`bg-white px-10 py-1.5 flex gap-3 w-fit mx-auto ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{ borderRadius: "50px" }}
            to={"/all-tools"}
          >
            <img src="/images/sparkles.png" />
            <span style={{ color: "rgba(0, 0, 0, 1)", fontWeight: "600" }}>
              {t["Try Now for Free"]}
            </span>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default Ready;
