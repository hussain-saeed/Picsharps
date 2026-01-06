import { useContext } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { LanguageContext } from "../context/LanguageContext";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";

const translations = { English, Arabic };

function ToolsMenuMobile({ setActiveView }) {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  const data = [
    {
      title: t["Background & Object Editing"],
      image: "/images/background-99.png",
      links: [
        { name: t["Remove Background"], to: "/remove-background" },
        { name: t["Object Removal"], to: "/object-removal" },
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
      style={{ backgroundColor: "rgba(221, 244, 255, 1)" }}
      className="pt-30 pb-14 sm:pt-14 sm:pb-0"
    >
      <div className="min-h-[calc(100vh-300px)] flex flex-col items-center justify-center">
        <Container className="pb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 place-content-center">
          {data.map((tool, i) => (
            <div
              key={i}
              className={`bg-white p-5 rounded-2xl flex gap-2  ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className="w-7 h-7"
                style={{
                  borderRadius: "50%",
                  backgroundColor: "rgba(195, 231, 249, 1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img className="w-4 h-4" src={tool.image} alt="tool" />
              </div>

              <div>
                <h3
                  className="mb-1"
                  style={{
                    fontWeight: "600",
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
        <Link
          to="/"
          className="text-[18px] text-center underline"
          style={{
            fontWeight: "700",
            display: "inline-block",
            width: "100%",
          }}
          onClick={() => {
            setActiveView("Home");
            localStorage.setItem("activeView", "Home");
          }}
        >
          {t["Back to Home"]}
        </Link>
      </div>
    </div>
  );
}

export default ToolsMenuMobile;
