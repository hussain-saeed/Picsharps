import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import Container from "./Container";
import ChangeLanguage from "./ChangeLanguage";
import ToolsMenu from "./ToolsMenu";
import { LanguageContext } from "../context/LanguageContext";
import { useOverlay } from "../context/OverlayContext";
import { useAuth } from "../features/auth/AuthProvider";
import { RxAvatar } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import Spinner from "./Spinner";
import { ViewContext } from "../context/ViewContext";

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

export default function Header() {
  const { language, direction } = useContext(LanguageContext);
  const { isVisible, setIsVisible } = useOverlay();
  const location = useLocation();
  const { userData, isLoadingUserData, openLoginPopup } = useAuth();
  const { setActiveView, goToHome } = useContext(ViewContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [activeNavOrder, setActiveNavOrder] = useState(0);

  const t = translations[language] || translations["English"];
  const isRTL = direction === "rtl";

  const handleHeaderClick = () => {
    if (toolsMenuOpen) {
      setToolsMenuOpen(false);
      setIsVisible(false);
    }
    if (menuOpen) {
      setMenuOpen(false);
      setIsVisible(false);
    }
  };

  const handleNavClick = (label) => {
    if (label === t.Tools) {
      setToolsMenuOpen(!toolsMenuOpen);
      setIsVisible(!isVisible);
    }
  };

  const handleChangeView = (label) => {
    let targetView = "Home";
    if (label === t.Tools) targetView = "Tools";
    setActiveView(targetView);
    setMenuOpen(false);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible === false) {
      setToolsMenuOpen(false);
      setMenuOpen(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (location.pathname === "/" && !toolsMenuOpen) {
      setActiveNavOrder(1);
    } else if (location.pathname === "/all-tools" || toolsMenuOpen) {
      setActiveNavOrder(2);
    } else if (location.pathname === "/pricing") {
      setActiveNavOrder(3);
    } else {
      setActiveNavOrder(0);
    }
  }, [location.pathname, toolsMenuOpen]);

  return (
    <header
      onClick={handleHeaderClick}
      className="shadow-md py-[22px] fixed w-full bg-white z-200"
    >
      <Container
        className={`flex items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <Link
          to="/"
          onClick={goToHome}
          className={`flex items-center gap-2.5 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <img src="/images/logo.png" alt="Logo" />
          <span
            className="text-[20px] font-semibold hidden 2xs:block"
            style={{ color: "rgba(2, 38, 108, 1)" }}
          >
            Picsharps
          </span>
        </Link>

        <nav
          className={`hidden xl:flex gap-16 font-medium text-black ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {[
            { img: "home", label: t.Home, to: "/" },
            { img: "extra-features", label: t.Tools, icon: <FiChevronDown /> },
            { img: "tags", label: t.Pricing, to: "/pricing" },
          ].map(({ img, label, icon, to }, index) => (
            <Link
              to={to}
              key={label}
              className={`flex items-center gap-1.5 relative ${
                isRTL ? "flex-row-reverse" : ""
              } cursor-pointer`}
              onClick={() => {
                handleNavClick(label);
                if (label === t.Home) setActiveView("Home");
              }}
            >
              <img src={`/images/${img}.png`} alt={label} />
              <span>{label}</span>
              {icon}
              <span
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  width: "105%",
                  height: "5px",
                  borderTopLeftRadius: "5px",
                  borderTopRightRadius: "5px",
                  background: "var(--gradient-color)",
                  display: index + 1 === activeNavOrder ? "block" : "none",
                }}
              ></span>
            </Link>
          ))}
        </nav>

        <div
          className={`hidden xl:flex items-center gap-2.5 justify-end min-w-[370px] min-h-10 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {isLoadingUserData ? (
            <Spinner />
          ) : (
            <>
              <ChangeLanguage openFrom={"down"} />
              {userData ? (
                <Link
                  to="/profile"
                  style={{ fontSize: "40px", color: "rgb(60, 60, 60)" }}
                >
                  <RxAvatar />
                </Link>
              ) : (
                <>
                  <button
                    style={{
                      padding: "5px 20px",
                      background: "var(--gradient-color)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      border: "1px solid #00d0ff",
                      borderRadius: "30px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    onClick={() => openLoginPopup()}
                  >
                    {t.LoginHeaderButton}
                  </button>
                  <button
                    style={{
                      padding: "5px 20px",
                      background: "var(--gradient-color)",
                      color: "white",
                      border: "1px solid #00d0ff",
                      borderRadius: "30px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    onClick={() => openLoginPopup()}
                  >
                    {t["Start Creating"]}
                  </button>
                </>
              )}
            </>
          )}
        </div>

        <ToolsMenu toolsMenuOpen={toolsMenuOpen} />

        <div
          className={`flex gap-3 xl:hidden ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <ChangeLanguage openFrom={"down"} />
          <button
            className="cursor-pointer"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setIsVisible(!isVisible);
            }}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div
            className={`shadow-md absolute top-[78px] bg-white p-6 flex flex-col gap-4 ${
              isRTL ? "left-[7.5%]" : "right-[7.5%]"
            } rounded-b-[10px]`}
          >
            {[
              { img: "home", label: t.Home, to: "/" },
              { img: "extra-features", label: t.Tools, to: "/" },
              { img: "tags", label: t.Pricing, to: "/pricing" },
            ].map(({ img, label, to }) => (
              <Link
                to={to}
                key={label}
                className={`flex items-center gap-1.5 ${
                  isRTL ? "flex-row-reverse" : ""
                } cursor-pointer`}
                onClick={() => handleChangeView(label)}
              >
                <img src={`/images/${img}.png`} alt={label} />
                <span>{label}</span>
              </Link>
            ))}

            {userData ? (
              <Link
                to="/profile"
                className="mt-2.5 flex gap-1"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <FaUser style={{ fontSize: "22px" }} />
                <span style={{ fontSize: "17px" }}>{t["Profile"]}</span>
              </Link>
            ) : (
              <>
                <button
                  style={{
                    padding: "5px 20px",
                    background: "var(--gradient-color)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    border: "1px solid #00d0ff",
                    borderRadius: "30px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={() => openLoginPopup()}
                >
                  {t.LoginHeaderButton}
                </button>
                <button
                  style={{
                    padding: "5px 20px",
                    background: "var(--gradient-color)",
                    color: "white",
                    border: "1px solid #00d0ff",
                    borderRadius: "30px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={() => openLoginPopup()}
                >
                  {t["Start Creating"]}
                </button>
              </>
            )}
          </div>
        )}
      </Container>
    </header>
  );
}
