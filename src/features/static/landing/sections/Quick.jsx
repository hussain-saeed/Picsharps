import { useContext } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import Container from "/src/components/Container";
import TitleBlock from "/src/components/TitleBlock";
import { Link } from "react-router-dom";

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

function Quick() {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  const data = [
    {
      link: "/remove-background",
      image: "/images/remove-bg.png",
      title: t["Remove Backgrounds"],
      description: t["Remove backgrounds instantly with powerful AI"],
    },

    /*
    {
      link: "/object-removal",
      image: "/images/remove-object.png",
      title: t["Remove Object from Photo"],
      description: t["Erase unwanted objects seamlessly in seconds"],
    },
    */
   
    {
      link: "/ai-image-enhancer",
      image: "/images/ai-image-enhancer.png",
      title: t["AI Image Enhancer"],
      description: t["Enhance image quality and clarity automatically"],
    },
    {
      link: "/photo-to-cartoon",
      image: "/images/photo-to-cartoon.png",
      title: t["Photo to Cartoon"],
      description: t["Turn your photos into fun cartoon-style art"],
    },
    {
      link: "/create-collage",
      image: "/images/collage-maker.png",
      title: t["Collage Maker"],
      description: t["Combine multiple photos into beautiful layouts"],
    },
  ];

  return (
    <div className="bg-(--primary-section-color) pb-8">
      <Container>
        <TitleBlock
          subtitle={t["QUICK LINKS"]}
          title={t["POPULAR TOOLS"]}
          description={
            t[
              "Here we collected the most used Generative AI and Photo Editing tools people are looking for!"
            ]
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
              className={`flex flex-col items-center text-center mb-14 w-full sm:w-[48%] lg:w-[17%]`}
            >
              <Link
                to={box.link}
                className="w-[90px] h-[90px] mb-[23px] block rounded-2xl overflow-hidden shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]"
              >
                <img
                  src={box.image}
                  alt={box.title}
                  className="w-full h-auto"
                />
              </Link>

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
