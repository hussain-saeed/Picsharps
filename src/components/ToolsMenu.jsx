import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { Link } from "react-router-dom";

const data1 = [
  {
    title: "Background Tools",
    image: "/images/background-99.png",
    links: [
      { name: "Remove Background", to: "/remove-background" },
      { name: "Change Background", to: "/change-background" },
      { name: "Remove Object from Photo", to: "/remove-object-from-photo" },
    ],
  },
  {
    title: "Enhance & Cleanup",
    image: "/images/magic-1.png",
    links: [
      { name: "AI Image Enhancer", to: "/ai-image-enhancer" },
      { name: "Sharpen Image", to: "/sharpen-image" },
      { name: "Cleanup Pictures", to: "/cleanup-pictures" },
      { name: "Photo Filters", to: "/photo-filters" },
    ],
  },
];

const data2 = [
  {
    title: "Creative & Fun",
    image: "/images/idea-1.png",
    links: [
      { name: "Photo to Cartoon", to: "/photo-to-cartoon" },
      { name: "Sticker Maker", to: "/sticker-maker" },
      { name: "Collage Maker", to: "/collage-maker" },
    ],
  },
  {
    title: "Basic Edits",
    image: "/images/edit-1.png",
    links: [
      { name: "Resize Image", to: "/resize-image" },
      { name: "Crop Image", to: "/crop-image" },
      { name: "Flip Image", to: "/flip-image" },
    ],
  },
];

function ToolsMenu({ toolsMenuOpen }) {
  const { direction } = useContext(LanguageContext);

  const isRTL = direction === "rtl";

  return (
    <div
      className={`bg-white absolute top-21 px-20 py-10 shadow-md gap-22 z-200 ${
        isRTL ? "flex-row-reverse" : ""
      }`}
      style={{
        borderBottomLeftRadius: "20px",
        borderBottomRightRadius: "20px",
        left: "50%",
        transform: isRTL ? "translate(-43%)" : "translate(-54%)",
        display: toolsMenuOpen ? "flex" : "none",
      }}
    >
      <div className="flex flex-col gap-12">
        {data1.map((tool, i) => (
          <div
            key={i}
            className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
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

      <div className="flex flex-col gap-12">
        {data2.map((tool, i) => (
          <div
            key={i}
            className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
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
