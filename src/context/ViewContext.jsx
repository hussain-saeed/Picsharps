import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ViewContext = createContext();

export function ViewProvider({ children }) {
  const location = useLocation();
  const [activeView, setActiveView] = useState("Home");

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveView("Home");
    }
  }, [location.pathname]);

  const goToHome = () => {
    setActiveView("Home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ViewContext.Provider value={{ activeView, setActiveView, goToHome }}>
      {" "}
      {children}{" "}
    </ViewContext.Provider>
  );
}
