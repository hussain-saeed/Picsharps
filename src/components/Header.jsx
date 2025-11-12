import English from "../i18n/components/header/english.json";
import French from "../i18n/components/header/french.json";
import Arabic from "../i18n/components/header/arabic.json";
import { useContext, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";
import Container from "./Container";
import ChangeLanguage from "./ChangeLanguage";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import ToolsMenu from "./ToolsMenu";

const translations = { English, French, Arabic };

export default function Header() {
  const { language, direction } = useContext(LanguageContext);
  const t = translations[language] || translations["English"];
  const [menuOpen, setMenuOpen] = useState(false);
  const isRTL = direction === "rtl";
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);

  return (
    <header className="shadow-md py-[22px]">
      <Container
        className={`flex items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`flex items-center gap-2.5 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <img src="/images/logo.png" alt="Logo" />
          <span
            className="text-[20px] font-semibold"
            style={{ color: "rgba(2, 38, 108, 1)" }}
          >
            Picsharps
          </span>
        </div>

        <nav
          className={`hidden lg:flex items-center gap-16 font-medium text-black ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {[
            { img: "home", label: t.home },
            { img: "extra-features", label: t.tools, icon: <FiChevronDown /> },
            { img: "tags", label: t.pricing },
          ].map(({ img, label, icon }) => (
            <Link
              key={label}
              className={`flex items-center gap-1.5 ${
                isRTL ? "flex-row-reverse" : ""
              } cursor-pointer`}
              onClick={() => {
                label === t.tools && setToolsMenuOpen(!toolsMenuOpen);
              }}
            >
              <img src={`/images/${img}.png`} alt={label} />
              <span>{label}</span>
              {icon}
            </Link>
          ))}
        </nav>

        <div
          className={`hidden lg:flex items-center gap-2.5 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <ChangeLanguage />
          <button
            style={{
              padding: "5px 20px",
              background: "var(--gradient-color)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              border: "1px solid #00d0ff",
              borderRadius: "30px",
              fontWeight: "600",
            }}
          >
            {t.login}
          </button>
        </div>

        <ToolsMenu toolsMenuOpen={toolsMenuOpen} />

        <button
          className="lg:hidden cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {menuOpen && (
          <div
            className={`shadow-md absolute top-[79px] bg-white p-6 flex flex-col gap-4 ${
              isRTL ? "left-[5%]" : "right-[5%]"
            } rounded-b-[10px]`}
          >
            {[
              { img: "home", label: t.home },
              {
                img: "extra-features",
                label: t.tools,
                icon: <FiChevronDown />,
              },
              { img: "tags", label: t.pricing },
            ].map(({ img, label, icon }) => (
              <Link
                key={label}
                className={`flex items-center gap-1.5 ${
                  isRTL ? "flex-row-reverse" : ""
                } cursor-pointer`}
              >
                <img src={`/images/${img}.png`} alt={label} />
                <span>{label}</span>
                {icon}
              </Link>
            ))}

            <ChangeLanguage />
            <button
              style={{
                padding: "5px 20px",
                background: "var(--gradient-color)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                border: "1px solid #00d0ff",
                borderRadius: "30px",
                fontWeight: "600",
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
