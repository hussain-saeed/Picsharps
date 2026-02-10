import { useContext } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { LanguageContext } from "../context/LanguageContext";
import { ViewContext } from "../context/ViewContext";

import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import French from "/src/i18n/french.json";
import Portuguese from "/src/i18n/portuguese.json";
import Spanish from "/src/i18n/spanish.json";
import Hindi from "/src/i18n/hindi.json";
import Indonesian from "/src/i18n/indonesian.json";

import { PiSelectionBackgroundBold } from "react-icons/pi";
import { IoSparklesOutline } from "react-icons/io5";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { IoIosResize } from "react-icons/io";

const translations = {
  English,
  Arabic,
  French,
  Portuguese,
  Spanish,
  Hindi,
  Indonesian,
};

function ToolsMenuMobile() {
  const { language, direction } = useContext(LanguageContext);
  const { goToHome } = useContext(ViewContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  const data = [
    {
      title: t["Background & Object Editing"],
      image: (
        <PiSelectionBackgroundBold className="text-[#00B0FF] text-[18px]" />
      ),
      links: [
        { name: t["Remove Background"], to: "/remove-background" },
        { name: t["Blur Image"], to: "/blur-image" },
      ],
    },
    {
      title: t["Image Enhancement"],
      image: <IoSparklesOutline className="text-[#00B0FF] text-[18px]" />,
      links: [
        { name: t["AI Image Enhancer"], to: "/ai-image-enhancer" },
        { name: t["Sharpen Image"], to: "/sharpen-image" },
        { name: t["Oil Paint Effect"], to: "/oil-paint-effect" },
      ],
    },
    {
      title: t["Artistic Effects & Filters"],
      image: <HiOutlinePaintBrush className="text-[#00B0FF] text-[18px]" />,
      links: [
        { name: t["Photo to Cartoon"], to: "/photo-to-cartoon" },
        { name: t["Grayscale Image"], to: "/grayscale-image" },
        { name: t["Rounded Corner Image"], to: "/rounded-corner-image" },
      ],
    },
    {
      title: t["Basic Adjustments & Resize"],
      image: <IoIosResize className="text-[#00B0FF] text-[20px]" />,
      links: [
        { name: t["Adjust Image"], to: "/adjust-image" },
        { name: t["Crop Image"], to: "/crop-image" },
        { name: t["Resize Image"], to: "/resize-image" },
        { name: t["Create Collage"], to: "/create-collage" },
      ],
    },
  ];

  return (
    <div
      style={{ backgroundColor: "rgba(221, 244, 255, 1)" }}
      className="min-h-[calc(100vh-600px)] sm:min-h-[calc(100vh-350px)] lg:min-h-[calc(100vh-50px)] flex flex-col pt-36 pb-28"
    >
      <div className="flex flex-col items-center w-full">
        <Container className="pb-10 grid gap-4 grid-cols-1 sm:grid-cols-2 place-content-center w-full px-4">
          {data.map((tool, i) => (
            <div
              key={i}
              className={`bg-white p-5 rounded-2xl flex gap-4 shadow-sm h-full ${
                isRTL ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              <div
                className="shrink-0 w-8 h-8"
                style={{
                  borderRadius: "50%",
                  backgroundColor: "rgba(195, 231, 249, 1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {tool.image}
              </div>

              <div className="flex-1">
                <h3
                  className="mb-2"
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {tool.title}
                </h3>
                <ul className="space-y-1">
                  {tool.links.map((link, j) => (
                    <li key={j} dir={isRTL ? "rtl" : "ltr"}>
                      <Link
                        to={link.to}
                        className="hover:text-blue-600 transition block py-0.5"
                        style={{ fontWeight: "500", fontSize: "12px" }}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Container>

        <div className="w-full">
          <Link
            to="/"
            className="text-[18px] text-center underline hover:text-blue-700 transition"
            style={{
              fontWeight: "700",
              display: "inline-block",
              width: "100%",
            }}
            onClick={goToHome}
          >
            {t["Back to Home"]}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ToolsMenuMobile;
