import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { OverlayProvider } from "./context/OverlayContext";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./features/static/landing/Landing";
import UploadPhoto from "./features/upload_photo/UploadPhoto";
import AllTools from "./features/static/AllTools";
import NotFound from "./features/static/NotFound";

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
      <OverlayProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />

            {data.map((path) => (
              <Route
                key={path}
                path={`/${path}`}
                element={<UploadPhoto key={path} />}
              />
            ))}

            <Route path="/all-tools" element={<AllTools />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </OverlayProvider>
    </LanguageProvider>
  );
}
