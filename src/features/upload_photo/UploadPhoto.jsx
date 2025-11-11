import { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import DropZone from "./components/DropZone";

const data = [
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

function UploadPhoto() {
  const location = useLocation();
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  useEffect(() => {
    const currentPath = location.pathname.replace("/", ""); // يشيل الـ "/"
    const matchedService = data.find((s) => currentPath.includes(s.path));

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
          padding: "120px 0 135px 0",
        }}
      >
        <Container className="text-center">
          <h2
            style={{
              fontWeight: "900",
              fontSize: "48px",
              marginBottom: "28px",
            }}
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
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default UploadPhoto;
