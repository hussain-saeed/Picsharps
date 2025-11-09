import { useContext } from "react";
import { LanguageContext, languages } from "../context/LanguageContext";

export default function ChangeLanguage() {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="
        border border-gray-300 
        rounded-lg 
        p-0.5
        shadow-sm 
        transition 
        duration-200 
        ease-in-out
      hover:border-gray-400
        cursor-pointer
      "
    >
      {languages.map((lang) => (
        <option key={lang.name} value={lang.name}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
