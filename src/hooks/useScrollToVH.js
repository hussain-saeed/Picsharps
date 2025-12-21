import { useCallback } from "react";

export const useScrollToVH = () => {
  const scrollToVH = useCallback((vh = 30, element = null) => {
    const scrollTop = (window.innerHeight * vh) / 100;

    if (element) {
      element.scrollTop = scrollTop;
    } else {
      window.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  }, []);

  return scrollToVH;
};
