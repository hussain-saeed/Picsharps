import { useState, useEffect, useRef } from "react";

export const useScrollSpy = (sectionIds, offset = 200) => {
  const [activeId, setActiveId] = useState(sectionIds[0] || "");
  const lastScrollY = useRef(0);
  const scrolling = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrolling.current) return;

      const scrollPosition = window.scrollY + offset;
      lastScrollY.current = scrollPosition;

      const sections = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          return element
            ? {
                id,
                element,
                top: element.offsetTop,
                bottom: element.offsetTop + element.clientHeight,
              }
            : null;
        })
        .filter(Boolean);

      if (scrollPosition < sections[0]?.top) {
        setActiveId(sectionIds[0]);
        return;
      }

      if (scrollPosition > sections[sections.length - 1]?.bottom - 200) {
        setActiveId(sectionIds[sectionIds.length - 1]);
        return;
      }

      let currentActiveId = activeId;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].top - 50) {
          currentActiveId = sections[i].id;
          break;
        }
      }

      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    const scrollTimeout = setTimeout(() => {
      scrolling.current = false;
    }, 100);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [sectionIds, offset, activeId]);

  const scrollToSection = (id) => {
    scrolling.current = true;
    setActiveId(id);

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 200;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      element.classList.add("pulse-animation");
      setTimeout(() => {
        element.classList.remove("pulse-animation");
      }, 1000);

      setTimeout(() => {
        scrolling.current = false;
      }, 1000);
    }
  };

  return { activeId, scrollToSection };
};
