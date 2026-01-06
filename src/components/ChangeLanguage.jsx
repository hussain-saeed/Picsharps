import { useState, useContext, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import { LanguageContext, languages } from "../context/LanguageContext";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ChangeLanguage({ openFrom }) {
  const { direction, language, changeLanguage } = useContext(LanguageContext);

  const [isChangeLangOpen, setIsChangeLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isRTL = direction === "rtl";

  const handleSelect = (lang) => {
    changeLanguage(lang);
    setIsChangeLangOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsChangeLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsChangeLangOpen((prev) => !prev)}
        className={`
          flex items-center gap-0.5 sm:gap-1
          bg-[linear-gradient(141deg,#00c853_0%,#00b0ff_62.41%)]
          text-white font-medium
          px-2 py-1 sm:px-4 sm:py-2 rounded-xl shadow-md
          transition duration-300
          hover:opacity-90 cursor-pointer
          ${isRTL ? "flex-row-reverse" : ""}
        `}
      >
        <Globe className="w-[15px] h-[15px] sm:w-[21px] sm:h-[21px]" />
        <span className="text-[14px] sm:text-[16px]">
          {language.slice(0, 2).toUpperCase()}
        </span>
        {!isChangeLangOpen ? (
          <FiChevronDown className="w-[15px] h-[15px] sm:w-[21px] sm:h-[21px]" />
        ) : (
          <FiChevronUp className="w-[15px] h-[15px] sm:w-[21px] sm:h-[21px]" />
        )}
      </button>

      {isChangeLangOpen && (
        <div
          className={`
            absolute w-full text-center
            bg-white rounded-xl shadow-lg
            border border-gray-200
            overflow-hidden
            ${openFrom === "down" ? "mt-[3px]" : "top-[-220%]"}
          `}
        >
          {languages.map((lang) => (
            <div
              key={lang.name}
              onClick={() => handleSelect(lang.name)}
              className="
                px-2 py-1 sm:px-4 sm:py-2
                text-[13px] sm:text-[16px]
                text-gray-700 
                cursor-pointer 
                hover:bg-gray-100
                transition
              "
            >
              {lang.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
