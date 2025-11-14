import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import DropZone from "./components/DropZone";

const toolsData = [
  {
    path: "remove-background",
    title: "Remove Background",
    description:
      "Upload your image and let AI automatically detect and remove the background in seconds.",
  },
  {
    path: "change-background",
    title: "Change Background",
    description:
      "Replace your photo background instantly with any color or image using smart AI precision.",
  },
  {
    path: "remove-object",
    title: "Remove Object from Photo",
    description:
      "Easily erase unwanted objects or people from your photos in seconds — clean, smooth results every time.",
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
    path: "cleanup-pictures",
    title: "Cleanup Pictures",
    description:
      "Remove dust, scratches, and imperfections to give your old or messy photos a fresh new look.",
  },
  {
    path: "photo-filters",
    title: "Photo Filters",
    description:
      "Apply professional-grade filters to give your images the perfect mood or style in one click.",
  },
  {
    path: "photo-to-cartoon",
    title: "Photo to Cartoon",
    description:
      "Turn your photo into a fun, high-quality cartoon or illustration with AI magic.",
  },
  {
    path: "sticker-maker",
    title: "Sticker Maker",
    description:
      "Create custom stickers from your images — perfect for chats, memes, or fun edits.",
  },
  {
    path: "collage-maker",
    title: "Collage Maker",
    description:
      "Combine multiple photos into beautiful layouts with customizable grids and styles.",
  },
  {
    path: "resize-image",
    title: "Resize Image",
    description:
      "Quickly adjust your photo dimensions without losing quality — fit any platform or use.",
  },
  {
    path: "crop-image",
    title: "Crop Image",
    description:
      "Cut your images precisely the way you want — focus on what really matters.",
  },
  {
    path: "flip-image",
    title: "Flip Image",
    description:
      "Flip or mirror your photos horizontally or vertically in just one click.",
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
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

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
            className="max-w-[700px] mx-auto mb-10"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {description}
          </p>
          <DropZone />

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
