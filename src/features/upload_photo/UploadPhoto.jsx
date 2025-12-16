import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import Header from "../../components/Header";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import DropZone from "./components/DropZone";
import CropDropZone from "./components/CropDropZone";
import ObjectRemovalDropZone from "./components/ObjectRemovalDropZone";

const toolsData = [
  {
    path: "remove-background",
    title: "Remove Background",
    description:
      "Upload your image and let AI automatically detect and remove the background in seconds.",
  },
  {
    path: "blur-image",
    title: "Blur Image",
    description:
      "Upload your image and apply a blur effect in just a few seconds.",
  },
  {
    path: "ai-image-enhancer",
    title: "AI Image Enhancer",
    description:
      "Automatically improve image quality, lighting, and details with powerful AI enhancement tools.",
  },
  {
    path: "sharpen-image",
    title: "Sharpen Image",
    description:
      "Make blurry photos crystal clear by enhancing edges and restoring lost details instantly.",
  },
  {
    path: "photo-to-cartoon",
    title: "Photo to Cartoon",
    description:
      "Turn your photo into a fun, high-quality cartoon or illustration with AI magic.",
  },
  {
    path: "resize-image",
    title: "Resize Image",
    description:
      "Quickly adjust your photo dimensions without losing quality — fit any platform or use.",
  },
  {
    path: "flip-image",
    title: "Flip Image",
    description:
      "Flip or mirror your photos horizontally or vertically in just one click.",
  },
  {
    path: "rotate-image",
    title: "Rotate Image",
    description:
      "Rotate your images clockwise or counterclockwise in just one click.",
  },
  {
    path: "grayscale-image",
    title: "Grayscale Image",
    description: "Upload your image and convert it to grayscale instantly.",
  },
  {
    path: "rounded-corner-image",
    title: "Rounded Corner Image",
    description: "Upload your image and apply rounded corners with ease.",
  },
  {
    path: "oil-paint-effect",
    title: "Oil Paint Effect",
    description: "Transform your image into an oil painting style artwork.",
  },
  {
    path: "adjust-image",
    title: "Adjust Image",
    description:
      "Allows fine-tuning image colors by adjusting brightness, contrast, saturation, and gamma — only the provided values are applied.",
  },
  {
    path: "crop-image",
    title: "Crop Image",
    description: "Crop an image to remove unwanted areas.",
  },
  {
    path: "object-removal",
    title: "Object-Removal",
    description:
      "Remove any unwanted objects from your photos and make them stay crystal clear.",
  },
];

const staticBoxesData = [
  {
    id: 1,
    img: "/images/group-263.png",
    title: "Fast AI Processing",
    span: "Get results in seconds with our advanced AI technology",
  },
  {
    id: 2,
    img: "/images/group-262.png",
    title: "High Quality Cutouts",
    span: "Precise edge detection for professional results",
  },
  {
    id: 3,
    img: "/images/group-261.png",
    title: "Automatic Edge Detection",
    span: "Smart algorithms handle complex images effortlessly",
  },
  {
    id: 4,
    img: "/images/group-260.png",
    title: "Supports Large Images",
    span: "Process high-resolution images up to 10MB",
  },
];

function UploadPhoto() {
  const location = useLocation();
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname.replace("/", "");
    const matchedService = toolsData.find((toolData) =>
      currentPath.includes(toolData.path)
    );

    if (matchedService) {
      setTitle(matchedService.title);
      setDescription(matchedService.description);
    } else {
      setTitle(null);
      setDescription(null);
    }
  }, [location.pathname]);

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
                location.pathname
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
                  flex flex-col items-center justify-center text-center
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
