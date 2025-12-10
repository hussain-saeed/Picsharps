import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";

import Container from "./Container";
import ChangeLanguage from "./ChangeLanguage";
import ToolsMenu from "./ToolsMenu";

import { LanguageContext } from "../context/LanguageContext";
import { useOverlay } from "../context/OverlayContext";

import English from "../i18n/components/header/english.json";
import French from "../i18n/components/header/french.json";
import Arabic from "../i18n/components/header/arabic.json";
import { useAuth } from "../features/auth/AuthProvider";
import { RxAvatar } from "react-icons/rx";

const translations = { English, French, Arabic };

export default function Header({ setActiveView }) {
  const { language, direction } = useContext(LanguageContext);
  const { isVisible, setIsVisible } = useOverlay();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [activeNavOrder, setActiveNavOrder] = useState(0);

  const t = translations[language] || translations["English"];
  const isRTL = direction === "rtl";

  const { user, openLoginPopup } = useAuth();

  const handleHeaderClick = () => {
    if (toolsMenuOpen === true) {
      setToolsMenuOpen(false);
      setIsVisible(false);
    }
    if (menuOpen === true) {
      setMenuOpen(false);
      setIsVisible(false);
    }
  };

  const handleNavClick = (label) => {
    if (label === t.tools) {
      setToolsMenuOpen(!toolsMenuOpen);
      setIsVisible(!isVisible);
    }
  };

  const handleChangeView = (label) => {
    const view = label === t.home ? "home" : label === t.tools ? "tools" : null;
    if (view) {
      localStorage.setItem("activeView", view);
      setActiveView(view);
    }
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
          className={`flex items-center gap-2.5 ${
            isRTL ? "flex-row-reverse" : ""
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
            className="text-[20px] font-semibold hidden 2xs:block"
            style={{ color: "rgba(2, 38, 108, 1)" }}
          >
            Picsharps
          </span>
        </Link>

        <nav
          className={`hidden lg:flex gap-16 font-medium text-black ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {[
            { img: "home", label: t.home, to: "/" },
            { img: "extra-features", label: t.tools, icon: <FiChevronDown /> },
            { img: "tags", label: t.pricing, to: "/pricing" },
          ].map(({ img, label, icon, to }, index) => (
            <Link
              to={to}
              key={label}
              className={`flex items-center gap-1.5 relative ${
                isRTL ? "flex-row-reverse" : ""
              } cursor-pointer`}
              onClick={() => handleNavClick(label)}
            >
              <img src={`/images/${img}.png`} alt={label} />
              <span>{label}</span>
              {icon}
              <span
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  width: "105%",
                  height: "4px",
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
          className={`hidden lg:flex items-center gap-2.5 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <ChangeLanguage openFrom={"down"} />
          {user ? (
            <Link
              to="/profile"
              style={{ fontSize: "40px", color: "rgb(60, 60, 60)" }}
            >
              <RxAvatar />
            </Link>
          ) : (
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
              {t.login}
            </button>
          )}
        </div>

        <ToolsMenu toolsMenuOpen={toolsMenuOpen} />

        <div
          className={`flex gap-3 lg:hidden ${
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
              isRTL ? "left-[5%]" : "right-[5%]"
            } rounded-b-[10px]`}
          >
            {[
              { img: "home", label: t.home, to: "/" },
              { img: "extra-features", label: t.tools, to: "/" },
              { img: "tags", label: t.pricing, to: "/pricing" },
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
            >
              {t.login}
            </button>
          </div>
        )}
      </Container>
    </header>
  );
}
