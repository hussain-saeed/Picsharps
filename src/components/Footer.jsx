import { useContext } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import ChangeLanguage from "./ChangeLanguage";
import { LanguageContext } from "../context/LanguageContext";

const data = [
  {
    title: "Product",
    links: [
      { to: "", text: "Features" },
      { to: "", text: "Pricing" },
      { to: "", text: "Demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", text: "About" },
      { to: "/contact-us", text: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "", text: "Privacy Policy" },
      { to: "", text: "Terms of Service" },
    ],
  },
];

function Footer({ setActiveView }) {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <div
      className="bg-(--secondary-section-color)"
      style={{ borderTop: "2px solid rgb(225, 225, 225)", paddingTop: "60px" }}
    >
      <Container>
        <div
          className={`flex flex-wrap items-start pb-[50px] mb-7 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
          style={{ borderBottom: "2px solid rgb(225, 225, 225)" }}
        >
          <div
            className={`flex lg:w-[45%] flex-col gap-2 ${
              isRTL ? "items-end" : "items-start"
            } items-end`}
          >
            <Link
              to="/"
              className={`flex items-center gap-2.5 ${
                isRTL ? "flex-row-reverse text-right" : "text-left"
              }`}
              onClick={() => {
                localStorage.setItem("activeView", "home");
                setActiveView("home");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <img src="/images/logo.png" alt="Logo" />
              <span
                className="text-[20px] font-semibold"
                style={{ color: "rgba(2, 38, 108, 1)" }}
              >
                Picsharps
              </span>
            </Link>
            <p
              style={{ fontSize: "15px" }}
              className="lg:w-[55%] mb-10 lg:mb-0 text-[rgba(0, 0, 0, 0.52)]"
              dir={direction}
            >
              AI-powered photo editing made simple and accessible for everyone
            </p>
          </div>

          <div
            className={`flex flex-wrap w-full lg:w-[55%] sm:justify-between ${
              isRTL ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            {data.map((section, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 min-w-[140px] sm:mb-0 mb-[35px]"
              >
                <h3 className="text-[16px] font-semibold pt-1.5">
                  {section.title}
                </h3>
                <div dir={direction} className="flex flex-col gap-1.5">
                  {section.links.map((link, i) => (
                    <Link
                      to={link.to}
                      key={i}
                      className="text-[15px] text-[rgba(0, 0, 0, 0.52)] hover:text-blue-600 transition-colors w-fit"
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`flex items-center justify-between pb-10 flex-wrap flex-col gap-4 ${
            isRTL ? "sm:flex-row-reverse" : "sm:flex-row"
          }`}
          style={{ color: "rgba(0, 0, 0, 0.52)", fontSize: "15px" }}
        >
          <span>© 2025 picsharps. All rights reserved</span>
          <ChangeLanguage openFrom={"top"} />
          <div
            className={`flex items-center gap-8 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <a style={{ cursor: "pointer" }}>
              <img src="/images/facebook.png" alt="facebook" />
            </a>
            <a style={{ cursor: "pointer" }}>
              <img src="/images/instagram.png" alt="instagram" />
            </a>
            <a style={{ cursor: "pointer" }}>
              <img src="/images/x.png" alt="x" />
            </a>
            <a style={{ cursor: "pointer" }}>
              <img src="/images/social-media.png" alt="social-media" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Footer;
