import { useState, useContext } from "react";
import { Globe } from "lucide-react";
import { LanguageContext, languages } from "../context/LanguageContext";

export default function ChangeLanguage({ openFrom }) {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [isChangeLangOpen, setIsChangeLangOpen] = useState(false);

  const handleSelect = (lang) => {
    changeLanguage(lang);
    setIsChangeLangOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsChangeLangOpen((prev) => !prev)}
        className="
          flex items-center gap-2
          bg-[linear-gradient(141deg,#00c853_0%,#00b0ff_62.41%)]
          text-white font-medium
          px-4 py-2 rounded-xl shadow-md
          transition duration-300
          hover:opacity-90 cursor-pointer
        "
      >
        <Globe size={20} />
        <span>{language}</span>
      </button>

      {isChangeLangOpen && (
        <div
          className={`absolute w-full
            bg-white rounded-xl shadow-lg
            border border-gray-200
            overflow-hidden ${
              openFrom === "down" ? "mt-[3px]" : "top-[-120px]"
            }`}
        >
          {languages.map((lang) => (
            <div
              key={lang.name}
              onClick={() => handleSelect(lang.name)}
              className="
                px-4 py-2 
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
