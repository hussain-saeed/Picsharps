import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { Link } from "react-router-dom";

import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import French from "/src/i18n/french.json";
import Portuguese from "/src/i18n/portuguese.json";
import Spanish from "/src/i18n/spanish.json";
import Hindi from "/src/i18n/hindi.json";
import Indonesian from "/src/i18n/indonesian.json";

const translations = {
  English,
  Arabic,
  French,
  Portuguese,
  Spanish,
  Hindi,
  Indonesian,
};

function ToolsMenu({ toolsMenuOpen }) {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  const data1 = [
    {
      title: t["Background & Object Editing"],
      image: "/images/background-99.png",
      links: [
        { name: t["Remove Background"], to: "/remove-background" },
        {
          /* name: t["Object Removal"], to: "/object-removal" */
        },
        { name: t["Blur Image"], to: "/blur-image" },
      ],
    },
    {
      title: t["Image Enhancement"],
      image: "/images/magic-1.png",
      links: [
        { name: t["AI Image Enhancer"], to: "/ai-image-enhancer" },
        { name: t["Sharpen Image"], to: "/sharpen-image" },
        { name: t["Oil Paint Effect"], to: "/oil-paint-effect" },
      ],
    },
  ];

  const data2 = [
    {
      title: t["Artistic Effects & Filters"],
      image: "/images/idea-1.png",
      links: [
        { name: t["Photo to Cartoon"], to: "/photo-to-cartoon" },
        { name: t["Grayscale Image"], to: "/grayscale-image" },
        { name: t["Rounded Corner Image"], to: "/rounded-corner-image" },
      ],
    },
    {
      title: t["Basic Adjustments & Resize"],
      image: "/images/edit-1.png",
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
      className={`bg-white absolute px-18 py-12 shadow-md gap-22 z-200 lg:h-100 xl:h-94 excluded ${
        isRTL ? "flex-row-reverse" : ""
      }`}
      style={{
        borderBottomLeftRadius: "20px",
        borderBottomRightRadius: "20px",
        left: "50%",
        top: "71px",
        transform: isRTL ? "translate(-43%)" : "translate(-54%)",
        display: toolsMenuOpen ? "flex" : "none",
      }}
    >
      <div className="flex flex-col gap-8">
        {data1.map((tool, i) => (
          <div
            key={i}
            className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""} h-28`}
          >
            <div
              className="w-6 h-6 flex justify-center items-center"
              style={{
                borderRadius: "50%",
                backgroundColor: "rgba(195, 231, 249, 1)",
              }}
            >
              <img src={tool.image} alt="tool" />
            </div>

            <div>
              <h3
                className="mb-1"
                style={{
                  fontWeight: "500",
                  fontSize: "13px",
                  marginTop: "4px",
                }}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {tool.title}
              </h3>

              <ul>
                {tool.links.map((link, j) => (
                  <li key={j} dir={isRTL ? "rtl" : "ltr"}>
                    <Link
                      to={link.to}
                      className="hover:text-blue-600 transition"
                      style={{ fontWeight: "300", fontSize: "11.5px" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {data2.map((tool, i) => (
          <div
            key={i}
            className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""} h-28`}
          >
            <div
              className="w-6 h-6 flex justify-center items-center"
              style={{
                borderRadius: "50%",
                backgroundColor: "rgba(195, 231, 249, 1)",
              }}
            >
              <img src={tool.image} alt="tool" />
            </div>

            <div>
              <h3
                className="mb-1"
                style={{
                  fontWeight: "500",
                  fontSize: "13px",
                  marginTop: "4px",
                }}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {tool.title}
              </h3>

              <ul>
                {tool.links.map((link, j) => (
                  <li key={j} dir={isRTL ? "rtl" : "ltr"}>
                    <Link
                      to={link.to}
                      className="hover:text-blue-600 transition"
                      style={{ fontWeight: "300", fontSize: "11.5px" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolsMenu;
