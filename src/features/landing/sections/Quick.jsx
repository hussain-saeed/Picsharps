import { useContext } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import Container from "../../../components/Container";
import TitleBlock from "../../../components/TitleBlock";

const data = [
  {
    image: "/images/remove-bg.png",
    title: "Remove Backgrounds",
    description: "Remove backgrounds instantly with powerful AI",
  },
  {
    image: "/images/ai-image-enhancer.png",
    title: "AI Image Enhancer",
    description: "Enhance image quality and clarity automatically",
  },
  {
    image: "/images/remove-object.png",
    title: "Remove Object from Photo",
    description: "Erase unwanted objects seamlessly in seconds",
  },
  {
    image: "/images/photo-to-cartoon.png",
    title: "Photo to Cartoon",
    description: "Turn your photos into fun cartoon-style art",
  },
  {
    image: "/images/collage-maker.png",
    title: "Collage Maker",
    description: "Combine multiple photos into beautiful layouts",
  },
];

function Quick() {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <div className="bg-(--primary-section-color) pb-12">
      <Container>
        <TitleBlock
          subtitle={"QUICK LINKS"}
          title={"POPULAR TOOLS"}
          description={
            "Here we collected the most used Generative AI and Photo Editing tools people are looking for!"
          }
        />
        <div
          className={`flex flex-wrap justify-between ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {data.map((box, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center mb-6 w-full sm:w-[48%] lg:w-[17%]`}
            >
              <img src={box.image} alt={box.title} className="mb-[23px]" />
              <h3
                className="text-[14px] text-[rgba(0, 0, 0, 1)] mb-1"
                style={{ fontWeight: "500" }}
              >
                {box.title}
              </h3>
              <p
                className="text-[13px] text-[rgba(0, 0, 0, 0.6)]"
                style={{ lineHeight: "21px" }}
              >
                {box.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Quick;
