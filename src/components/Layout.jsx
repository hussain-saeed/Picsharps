import { useContext } from "react";
import Header from "./Header";
import Container from "./Container";
import Footer from "./Footer";
import { Link, useLocation } from "react-router-dom";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { LanguageContext } from "/src/context/LanguageContext";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";

const translations = { English, Arabic };

function Layout({ children }) {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];
  const location = useLocation();

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex flex-col"
        style={{
          background:
            "linear-gradient(180deg, rgba(223, 242, 255, 0.2) 0%, rgba(255, 255, 255, 1) 100%)",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Container>
          <main className="">{children}</main>
        </Container>
      </div>

      <section
        style={{
          padding: "60px 0",
          background: "var(--gradient-color-2)",
          textAlign: "center",
          marginTop: "80px",
        }}
      >
        <Container>
          <h2
            style={{
              marginBottom: "25px",
              fontSize: "40px",
              fontWeight: "700",
              color: "white",
            }}
          >
            {location.pathname === "/privacy-policy"
              ? t["Have Questions About Your Privacy?"]
              : t["Ready to Get Started?"]}
          </h2>
          <p
            style={{
              marginBottom: "35px",
              fontSize: "24px",
              fontWeight: "500",
              color: "white",
              padding: "0 80px 0 80px",
            }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {location.pathname === "/privacy-policy"
              ? t[
                  "Our Team Is Here To Help. Reach Out With Any Concerns Or Questions About How We Protect Your Data."
                ]
              : t["Join thousands of users transforming their images."]}
          </p>
          <Link
            className={`
                flex items-center gap-2 mx-auto justify-center
                ${isRTL ? "flex-row-reverse" : "flex-row"}
              `}
            style={{
              backgroundColor: "white",
              color: "rgba(0, 176, 255, 1)",
              width: "fit-content",
              boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0)",
              padding: "10px 40px",
              borderRadius: "50px",
              fontWeight: 600,
            }}
            to="/all-tools"
          >
            <span>{t["Get Started Free"]}</span>
            {isRTL ? <FaLongArrowAltLeft /> : <FaLongArrowAltRight />}
          </Link>
        </Container>
      </section>
      <Footer />
    </>
  );
}

export default Layout;
