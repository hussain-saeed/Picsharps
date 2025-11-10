import Container from "../../components/Container";
import Header from "../../components/Header";
import Hero from "./sections/Hero";
import Quick from "./sections/Quick";
import PresentService from "../../components/PresentService";
import { Link } from "react-router-dom";
import How from "./sections/How";
import Ready from "./sections/Ready";
import Footer from "../../components/Footer";

function Landing() {
  return (
    <>
      <Header />
      <Hero />
      <Quick />

      <div className="py-20 bg-(--secondary-section-color)">
        <Container>
          <PresentService
            isTextFirst={false}
            imageSrc="/images/remove-bg-2.png"
            title="Remove Backgrounds Instantly"
            description="Upload your image and let our smart tool do the work. Whether you're editing product photos or creating social media content, our background remover helps you isolate your subject with precision and speed. No manual cropping—just fast, clean results."
            linkTo=""
            innerLinkText="Try it now for free"
          />
        </Container>
      </div>

      <div className="pb-20 bg-(--secondary-section-color) text-center">
        <Link
          to="/"
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
      <Footer />
    </>
  );
}

export default Landing;
