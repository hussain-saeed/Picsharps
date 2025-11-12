/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";
import ReactDOM from "react-dom";
import Overlay from "../components/Overlay";

const OverlayContext = createContext();

export function OverlayProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <OverlayContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
      {isVisible && ReactDOM.createPortal(<Overlay />, document.body)}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  return useContext(OverlayContext);
}
