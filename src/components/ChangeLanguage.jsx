import { useContext } from "react";
import { LanguageContext, languages } from "../context/LanguageContext";

export default function ChangeLanguage() {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="border rounded px-2 py-1"
    >
      {languages.map((lang) => (
        <option key={lang.name} value={lang.name}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
