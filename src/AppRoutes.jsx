import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Landing from "./features/landing/Landing";
import UploadPhoto from "./features/upload_photo/UploadPhoto";

const data = [
  "remove-background",
  "change-background",
  "remove-object-from-photo",
  "ai-image-enhancer",
  "sharpen-image",
  "cleanup-pictures",
  "photo-filters",
  "photo-to-cartoon",
  "sticker-maker",
  "collage-maker",
  "resize-image",
  "crop-image",
  "flip-image",
];

export default function AppRoutes() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {data.map((path) => (
            <Route key={path} path={`/${path}`} element={<UploadPhoto />} />
          ))}

          <Route path="*" element={<p>not found</p>} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
