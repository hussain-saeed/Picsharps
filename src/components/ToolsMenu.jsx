import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { Link } from "react-router-dom";

const data1 = [
  {
    title: "Background Tools",
    image: "/images/background-99.png",
    links: [
      { name: "Remove Background", to: "" },
      { name: "Change Background", to: "" },
      { name: "Remove Object from Photo", to: "" },
    ],
  },
  {
    title: "Enhance & Cleanup",
    image: "/images/magic-1.png",
    links: [
      { name: "AI Image Enhancer", to: "" },
      { name: "Sharpen Image", to: "" },
      { name: "Cleanup Pictures", to: "" },
      { name: "Photo Filters", to: "" },
    ],
  },
];
const data2 = [
  {
    title: "Creative & Fun",
    image: "/images/idea-1.png",
    links: [
      { name: "Photo to Cartoon", to: "" },
      { name: "Sticker Maker", to: "" },
      { name: "Collage Maker", to: "" },
    ],
  },
  {
    title: "Basic Edits",
    image: "/images/edit-1.png",
    links: [
      { name: "Resize Image", to: "" },
      { name: "Crop Image", to: "" },
      { name: "Flip Image", to: "" },
    ],
  },
];

function ToolsMenu({ toolsMenuOpen }) {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <div
      className={`bg-white absolute top-20 px-12 py-6 shadow-md gap-16 z-200 ${
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
      <div className="flex flex-col gap-8">
        {data1.map((tool, i) => (
          <div
            key={i}
            className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-5 h-5 flex justify-center items-center"
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
                  fontSize: "11px",
                  marginTop: "3px",
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
                      style={{ fontWeight: "300", fontSize: "10px" }}
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
            className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-5 h-5 flex justify-center items-center"
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
                  fontSize: "11px",
                  marginTop: "3px",
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
                      style={{ fontWeight: "300", fontSize: "10px" }}
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
