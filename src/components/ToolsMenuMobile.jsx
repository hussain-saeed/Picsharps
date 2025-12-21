import { useContext } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { LanguageContext } from "../context/LanguageContext";

const data = [
  {
    title: "Background & Object Editing",
    image: "/images/background-99.png",
    links: [
      { name: "Remove Background", to: "/remove-background" },
      { name: "Object Removal", to: "/object-removal" },
      { name: "Blur Image", to: "/blur-image" },
    ],
  },
  {
    title: "Image Enhancement",
    image: "/images/magic-1.png",
    links: [
      { name: "AI Image Enhancer", to: "/ai-image-enhancer" },
      { name: "Sharpen Image", to: "/sharpen-image" },
      { name: "Oil Paint Effect", to: "/oil-paint-effect" },
    ],
  },
  {
    title: "Artistic Effects & Filters",
    image: "/images/idea-1.png",
    links: [
      { name: "Photo to Cartoon", to: "/photo-to-cartoon" },
      { name: "Grayscale Image", to: "/grayscale-image" },
      { name: "Rounded Corner Image", to: "/rounded-corner-image" },
    ],
  },
  {
    title: "Basic Adjustments & Resize",
    image: "/images/edit-1.png",
    links: [
      { name: "Adjust Image", to: "/adjust-image" },
      { name: "Crop Image", to: "/crop-image" },
      { name: "Resize Image", to: "/resize-image" },
      { name: "Create Collage", to: "/create-collage" },
    ],
  },
];

function ToolsMenuMobile({ setActiveView }) {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <div style={{ backgroundColor: "rgba(221, 244, 255, 1)" }}>
      <Container className="pt-30 pb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
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
        className="text-[18px] mb-14 text-center underline"
        style={{
          fontWeight: "700",
          display: "inline-block",
          width: "100%",
        }}
        onClick={() => {
          setActiveView("home");
          localStorage.setItem("activeView", "home");
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}

export default ToolsMenuMobile;
