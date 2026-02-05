import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import Header from "../../components/Header";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import DropZone from "./components/DropZone";
import CropDropZone from "./components/CropDropZone";
import ObjectRemovalDropZone from "./components/ObjectRemovalDropZone";
import CreateCollegeDropZone from "./components/CreateCollegeDropZone";

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

function UploadPhoto() {
  const location = useLocation();
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  const toolsData = [
    {
      path: "remove-background",
      title: t["Remove Background"],
      description:
        t[
          "Upload your image and let AI automatically detect and remove the background in seconds."
        ],
    },
    {
      path: "blur-image",
      title: t["Blur Image"],
      description:
        t["Upload your image and apply a blur effect in just a few seconds."],
    },
    {
      path: "ai-image-enhancer",
      title: t["AI Image Enhancer"],
      description:
        t[
          "Automatically improve image quality, lighting, and details with powerful AI enhancement tools."
        ],
    },
    {
      path: "sharpen-image",
      title: t["Sharpen Image"],
      description:
        t[
          "Make blurry photos crystal clear by enhancing edges and restoring lost details instantly."
        ],
    },
    {
      path: "photo-to-cartoon",
      title: t["Photo to Cartoon"],
      description:
        t[
          "Turn your photo into a fun, high-quality cartoon or illustration with AI magic."
        ],
    },
    {
      path: "resize-image",
      title: t["Resize Image"],
      description:
        t[
          "Quickly adjust your photo dimensions without losing quality — fit any platform or use."
        ],
    },
    {
      path: "grayscale-image",
      title: t["Grayscale Image"],
      description:
        t["Upload your image and convert it to grayscale instantly."],
    },
    {
      path: "rounded-corner-image",
      title: t["Rounded Corner Image"],
      description: t["Upload your image and apply rounded corners with ease."],
    },
    {
      path: "oil-paint-effect",
      title: t["Oil Paint Effect"],
      description:
        t["Transform your image into an oil painting style artwork."],
    },
    {
      path: "adjust-image",
      title: t["Adjust Image"],
      description:
        t[
          "Allows fine-tuning image colors by adjusting brightness, contrast, saturation, and gamma — only the provided values are applied."
        ],
    },
    {
      path: "crop-image",
      title: t["Crop Image"],
      description: t["Crop an image to remove unwanted areas."],
    },
    {
      path: "object-removal",
      title: t["Object Removal"],
      description:
        t[
          "Remove any unwanted objects from your photos and make them stay crystal clear."
        ],
    },
    {
      path: "create-collage",
      title: t["Create Collage"],
      description:
        t[
          "Create beautiful photo collages by combining multiple images into one layout."
        ],
    },
  ];

  const staticBoxesData = [
    {
      id: 1,
      img: "/images/group-263.png",
      title: t["Fast AI Processing"],
      span: t["Get results in seconds with our advanced AI technology"],
    },
    {
      id: 2,
      img: "/images/group-262.png",
      title: t["High Quality Cutouts"],
      span: t["Precise edge detection for professional results"],
    },
    {
      id: 3,
      img: "/images/group-261.png",
      title: t["Automatic Edge Detection"],
      span: t["Smart algorithms handle complex images effortlessly"],
    },
    {
      id: 4,
      img: "/images/group-260.png",
      title: t["Supports Large Images"],
      span: t["Process high-resolution images up to 10MB"],
    },
  ];

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname.replace("/", "");
    const matchedService = toolsData.find((toolData) =>
      currentPath.includes(toolData.path),
    );

    if (matchedService) {
      setTitle(matchedService.title);
      setDescription(matchedService.description);
    } else {
      setTitle(null);
      setDescription(null);
    }
  }, [location.pathname, isRTL]);

  return (
    <>
      <Header />
      <div
        style={{
          backgroundColor: "rgba(238, 238, 238)",
          padding: "140px 0 135px 0",
        }}
      >
        <Container className="text-center">
          <h2
            style={{
              fontWeight: "900",
              marginBottom: "15px",
            }}
            className={`${
              ["/remove-background", "/change-background"].includes(
                location.pathname,
              )
                ? "text-[39px] sm:text-[48px]"
                : "text-[48px]"
            }`}
          >
            {title}
          </h2>
          <p
            style={{ fontSize: "20px", color: "rgba(0, 0, 0, 1)" }}
            className="max-w-[700px] mx-auto mb-25"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {description}
          </p>

          {["/crop-image"].includes(location.pathname) ? (
            <CropDropZone />
          ) : ["/object-removal"].includes(location.pathname) ? (
            <ObjectRemovalDropZone />
          ) : ["/create-collage"].includes(location.pathname) ? (
            <CreateCollegeDropZone />
          ) : (
            <DropZone />
          )}

          <div
            className={`w-full flex flex-wrap justify-between gap-4 mt-36 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {staticBoxesData.map((box) => (
              <div
                key={box.id}
                className="
                  flex flex-col items-center justify-start text-center
                bg-white rounded-xl p-8 shadow
                  w-full sm:w-[48%] lg:w-[23%]
                "
              >
                <img src={box.img} alt={box.title} className="mb-2" />
                <h3 className="font-medium mb-2.5">{box.title}</h3>
                <span
                  style={{
                    color: "rgba(133, 133, 133, 1)",
                    fontSize: "13px",
                    fontWeight: "300",
                  }}
                >
                  {box.span}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default UploadPhoto;
