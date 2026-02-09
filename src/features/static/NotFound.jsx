import Header from "../../components/Header";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import { ViewContext } from "../../context/ViewContext";

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

function NotFound() {
  const { language, direction } = useContext(LanguageContext);
  const { goToHome } = useContext(ViewContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  return (
    <>
      <Header />
      <div
        style={{
          background:
            "linear-gradient(141deg, #F7FFFB 0%, #E9FCF4 25%, #E7F8FA 60%, #E4F4FC 100%)",
        }}
      >
        <Container className="pt-45 pb-40 flex flex-col justify-center items-center">
          <img
            src={isRTL ? "/images/not-found3.png" : "/images/not-found2.png"}
            alt="not found"
            className="mb-5"
          />
          <Link
            to="/"
            className="text-[20px] sm:text-[24px] underline"
            style={{
              fontWeight: "900",
            }}
            onClick={goToHome}
          >
            {t["Back to Home"]}
          </Link>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;
