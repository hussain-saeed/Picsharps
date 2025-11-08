import { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import English from "../i18n/components/header/english.json";
import French from "../i18n/components/header/french.json";
import Arabic from "../i18n/components/header/arabic.json";
import ChangeLanguage from "./ChangeLanguage";

const translations = { English, French, Arabic };

export default function Header() {
  const { language, direction } = useContext(LanguageContext);
  const t = translations[language] || translations["English"];

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100">
      <nav className="flex space-x-4">
        <Link to="/">{t.home}</Link>
        <Link to="/">{t.tools}</Link>
        <Link to="/">{t.pricing}</Link>
        <Link to="/">{t.login}</Link>
      </nav>
      <ChangeLanguage />
      <div className="mt-2 text-sm text-gray-500">
        اتجاه اللغة الحالي: {direction}
      </div>
    </header>
  );
}
