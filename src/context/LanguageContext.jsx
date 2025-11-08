/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect } from "react";

export const languages = [
  { name: "English", direction: "ltr" },
  { name: "French", direction: "ltr" },
  { name: "Arabic", direction: "rtl" },
];

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const savedLanguage = localStorage.getItem("language") || "English";
  const langObj = languages.find((l) => l.name === savedLanguage);
  const [language, setLanguage] = useState(langObj.name);
  const [direction, setDirection] = useState(langObj.direction);

  useEffect(() => {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", language);
    }
  }, [language]);

  const changeLanguage = (newLanguage) => {
    const langObj = languages.find((l) => l.name === newLanguage);
    setLanguage(langObj.name);
    setDirection(langObj.direction);
    localStorage.setItem("language", langObj.name);
  };

  return (
    <LanguageContext.Provider value={{ language, direction, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
