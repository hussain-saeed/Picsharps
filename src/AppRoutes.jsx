import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { OverlayProvider } from "./context/OverlayContext";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./features/static/landing/Landing";
import UploadPhoto from "./features/upload_photo/UploadPhoto";
import AllTools from "./features/static/AllTools";
import About from "./features/static/about/About";
import ContactUs from "./features/static/contact/ContactUs";
import Pricing from "./features/static/pricing/Pricing";
import PrivacyPolicy from "./features/static/privacy/PrivacyPolicy";
import TermsOfService from "./features/static/terms/TermsOfService";
import NotFound from "./features/static/NotFound";
import Callback from "./features/auth/Callback";
import Profile from "./features/profile/Profile";
import VerifyEmailPage from "./features/auth/VerifyEmailPage";
import LoginPopup from "./features/auth/LoginPopup";

const data = [
  "remove-background",
  "ai-image-enhancer",
  "sharpen-image",
  "photo-to-cartoon",
  "resize-image",
  "flip-image",
  "rotate-image",
  "blur-image",
  "grayscale-image",
];

export default function AppRoutes() {
  return (
    <LanguageProvider>
      <LoginPopup />
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
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/auth/callback" element={<Callback />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </OverlayProvider>
    </LanguageProvider>
  );
}
