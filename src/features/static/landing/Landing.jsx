import { useState } from "react";
import Container from "../../../components/Container";
import Header from "../../../components/Header";
import ToolsMenuMobile from "../../../components/ToolsMenuMobile";
import Hero from "./sections/Hero";
import Quick from "./sections/Quick";
import PresentService from "../../../components/PresentService";
import { Link } from "react-router-dom";
import How from "./sections/How";
import Ready from "./sections/Ready";
import Footer from "../../../components/Footer";

function Landing() {
  const [activeView, setActiveView] = useState(
    localStorage.getItem("activeView") || "home"
  );

  return (
    <>
      <Header setActiveView={setActiveView} />

      {activeView === "home" && (
        <>
          <Hero />
          <Quick />

          <div className="py-20 bg-(--secondary-section-color)">
            <Container>
              <PresentService
                isTextFirst={false}
                imageSrc="/images/remove-bg-2.png"
                title="Remove Backgrounds Instantly"
                description="Upload your image and let our smart tool do the work. Whether you're editing product photos or creating social media content, our background remover helps you isolate your subject with precision and speed. No manual cropping—just fast, clean results."
                linkTo="/remove-background"
                innerLinkText="Try it now for free"
              />
            </Container>
          </div>
          <div className="pb-20 bg-(--secondary-section-color)">
            <Container>
              <PresentService
                isTextFirst={true}
                imageSrc="/images/ai-image-enhancer-2.png"
                title="AI Image Enhancer – Make Every Pixel Shine!"
                description="Breathe new life into your photos with our intelligent image enhancer. Boost clarity, sharpen details, and enhance colors—all with a single click. Whether it’s a selfie, product shot, or landscape, your images will look stunning and professional in seconds."
                linkTo="/ai-image-enhancer"
                innerLinkText="Try it now for free"
              />
            </Container>
          </div>
          <div className="pb-20 bg-(--secondary-section-color)">
            <Container>
              <PresentService
                isTextFirst={false}
                imageSrc="/images/remove-object-exp.png"
                title="Remove Unwanted Objects"
                description="Clean up your photos in seconds with our smart AI object remover. Whether it's a stray person, a distracting item, or background clutter—just highlight it and let the magic happen. Your image stays flawless, your focus stays sharp."
                linkTo="/remove-object-from-photo"
                innerLinkText="Try it now for free"
                isNeedArrow={true}
              />
            </Container>
          </div>
          <div className="pb-20 bg-(--secondary-section-color)">
            <Container>
              <PresentService
                isTextFirst={true}
                imageSrc="/images/photo-to cartoon-exp.png"
                title="Turn Photos into Cartoons"
                description="Add a playful twist to your images with our AI-powered cartoonizer. Transform selfies, portraits, or pet photos into vibrant cartoon-style artwork in seconds. Perfect for social media, avatars, or just for fun!"
                linkTo="/photo-to-cartoon"
                innerLinkText="Try it now for free"
              />
            </Container>
          </div>
          <div className="pb-20 bg-(--secondary-section-color)">
            <Container>
              <PresentService
                isTextFirst={false}
                imageSrc="/images/collage-maked-exp-1.png"
                title="Build Custom Collages with Ease"
                description="Mix, match, and tell your story with our easy-to-use collage maker. Choose your layout, drag in your favorite images, and let your creativity shine. Perfect for social media, scrapbooks, or sharing memories with style!"
                linkTo="collage-maker"
                innerLinkText="Try it now for free"
              />
            </Container>
          </div>
          <div className="pb-20 bg-(--secondary-section-color) text-center">
            <Link
              to="/all-tools"
              className="text-[20px] sm:text-[24px]"
              style={{
                color: "rgba(0, 176, 255, 1)",
                fontWeight: "900",
                borderBottom: "2px solid rgba(0, 176, 255, 1)",
              }}
            >
              Explore All Tools
            </Link>
          </div>

          <How />
          <Ready />
        </>
      )}

      {activeView === "tools" && (
        <ToolsMenuMobile setActiveView={setActiveView} />
      )}

      <Footer setActiveView={setActiveView} />
    </>
  );
}

export default Landing;
