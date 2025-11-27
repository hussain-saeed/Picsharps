import Header from "../../../components/Header";
import { useContext } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import Container from "../../../components/Container";
import Our from "./components/Our";
import { Link } from "react-router-dom";
import Footer from "../../../components/Footer";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

const data = [
  {
    image: "images/simplicity.png",
    title: "Simplicity",
    text: "easy-to-use tools with no learning curve",
  },
  {
    image: "images/speed.png",
    title: "Speed",
    text: "ultra-fast ai processing",
  },
  {
    image: "images/professional-quality.png",
    title: "Professional Quality",
    text: "studio-level results every time",
  },
  {
    image: "images/innovation.png",
    title: "Innovation",
    text: "continuously evolving with the latest ai technology",
  },
  {
    image: "images/reliability.png",
    title: "Reliability",
    text: "secure, stable, and consistent performance",
  },
  {
    image: "images/accessibility.png",
    title: "Accessibility",
    text: "high-quality tools available to all users",
  },
];

const data2 = [
  {
    image: "images/simplicity.png",
    header: "+10,000",
    title: "Users",
    text: "in the first 6 months",
  },
  {
    image: "images/speed.png",
    header: "4.8/5",
    title: "Rating",
    text: "by early users",
  },
  {
    image: "images/professional-quality.png",
    header: "AI Technology",
    title: "Powered",
    text: "built with industry-leading AI",
  },
];

function About() {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <>
      <Header />

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(223, 242, 255, 0.5) 0%,  rgb(235, 235, 235) 100%)",
        }}
      >
        <Container>
          <section
            className={`
              w-full md:w-[85%] lg:w-full mx-auto
              flex flex-col items-center xl:items-start
              ${
                isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
              } lg:gap-10 pt-[180px] lg:pt-[250px] pb-[130px] lg:pb-[200px]
            `}
          >
            <div
              className={`
                lg:w-1/2 w-full
                flex flex-col text-center
                ${isRTL ? "lg:text-right" : "lg:text-left"}
              `}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <h2
                className="text-[37px] sm:text-[60px] lg:text-[50px] xl:text-[60px] xl:mt-0.5 2xl:mt-[45px]"
                style={{
                  fontWeight: "700",
                  marginBottom: "20px",
                }}
              >
                About{" "}
                <span
                  style={{
                    background: "var(--gradient-color)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Picsharps
                </span>
              </h2>
              <p
                className="mb-[70px] lg:mb-0"
                style={{
                  fontWeight: "500",
                  letterSpacing: "2px",
                  lineHeight: "30px",
                }}
              >
                our platform was created to make advanced image enhancement
                simple, fast, and accessible. Many users struggle with
                complicated editing tools and low-quality images that affect
                their work. We built this project to solve that problem by
                offering AI-powered tools that deliver high-quality results in
                seconds—without any technical skills.
              </p>
            </div>

            <div
              className={`
                lg:w-1/2 w-full
                flex lg:mt-3.5 xl:mt-0
              `}
            >
              <img
                src="/images/hero-abstract.png"
                alt="hero"
                className="w-full h-auto object-contain"
              />
            </div>
          </section>

          <section className="pb-26">
            <Our
              isWhite={true}
              readyImage={true}
              image={"/images/our-mission.png"}
              title={"Our Mission"}
              paragraph={
                "to empower individuals, creators, and businesses with intelligent AI tools that simplify image editing and deliver professional, high-quality results instantly."
              }
            />
          </section>

          <section className="pb-28">
            <Our
              isWhite={false}
              readyImage={false}
              icon={"/images/view.png"}
              title={"Our Vision"}
              paragraph={
                "to become a global leader in AI-powered image solutions by building a complete ecosystem of smart tools that enhance, transform, and optimize visual content for millions of users worldwide."
              }
            />
          </section>

          <section className="pb-28">
            <h2
              className="mb-12 text-center text-[35px] sm:text-[40px]"
              style={{ fontWeight: "700" }}
            >
              Our Values
            </h2>

            <div
              className={`w-full flex flex-wrap gap-6 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {data.map((item, index) => (
                <div
                  key={index}
                  className="
                    w-full 
                    sm:w-[calc(50%-12px)] 
                    lg:w-[calc(33.333%-16px)]
                  bg-white p-6 rounded-4xl 
                    flex flex-col items-center text-center
                  "
                  style={{
                    boxShadow: "0px 4px 4px 0px rgba(64, 175, 255, 0.25)",
                  }}
                >
                  <div
                    className="mb-4"
                    style={{
                      width: "73px",
                      height: "73px",
                      background: "var(--gradient-color-2)",
                      borderRadius: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>

                  <h3
                    className="mb-3.5"
                    style={{ fontSize: "24px", fontWeight: "700" }}
                  >
                    {item.title}
                  </h3>

                  <span
                    style={{
                      color: "rgba(91, 91, 91, 1)",
                      fontSize: "13px",
                      fontWeight: "500",
                      letterSpacing: "2px",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="pb-28">
            <Our
              isWhite={true}
              readyImage={false}
              gridain={true}
              icon={"/images/book-1.png"}
              title={"Our Story"}
              paragraph={
                "founded in 2025, our mission is to build simple, fast, ai-powered creative tools accessible to everyone."
              }
            />
          </section>

          <section className="pb-26">
            <h2
              className="mb-12 text-center text-[35px] sm:text-[40px]"
              style={{ fontWeight: "700" }}
            >
              Our Achievements
            </h2>

            <div
              className={`w-full flex flex-wrap gap-6 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {data2.map((item, index) => (
                <div
                  key={index}
                  className="
                    w-full 
                    sm:w-[calc(50%-12px)] 
                    lg:w-[calc(33.333%-16px)]
                  bg-white px-6 pt-6 pb-12 rounded-4xl 
                    flex flex-col items-center text-center
                  "
                  style={{
                    boxShadow: "0px 4px 4px 0px rgba(64, 175, 255, 0.25)",
                  }}
                >
                  <div
                    className="mb-4"
                    style={{
                      width: "73px",
                      height: "73px",
                      background: "var(--gradient-color-2)",
                      borderRadius: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>

                  <h2
                    style={{
                      background: "var(--gradient-color)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "700",
                    }}
                    className={`
                        text-[40px] ${
                          index === 2 &&
                          "lg:text-[35px] mt-1 leading-[1.1] md:leading-normal mb-2.5 md:mb-0"
                        }
                    `}
                  >
                    {item.header}
                  </h2>

                  <h3
                    className="mb-2"
                    style={{ fontSize: "24px", fontWeight: "700" }}
                  >
                    {item.title}
                  </h3>

                  <span
                    style={{
                      color: "rgba(91, 91, 91, 1)",
                      fontSize: "13px",
                      fontWeight: "500",
                      letterSpacing: "2px",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Container>

        <section
          style={{
            padding: "60px 0",
            background: "var(--gradient-color-2)",
            textAlign: "center",
          }}
        >
          <Container>
            <h2
              style={{
                marginBottom: "25px",
                fontSize: "40px",
                fontWeight: "700",
                color: "white",
              }}
            >
              Ready To Transform Your Images?
            </h2>
            <p
              style={{
                marginBottom: "35px",
                fontSize: "24px",
                fontWeight: "500",
                color: "white",
              }}
            >
              Join Thousands Of Users Who Trust Picsharps
            </p>
            <Link
              className={`
                flex items-center gap-2 mx-auto justify-center
                ${isRTL ? "flex-row-reverse" : "flex-row"}
              `}
              style={{
                backgroundColor: "white",
                color: "rgba(0, 176, 255, 1)",
                width: "fit-content",
                boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0)",
                padding: "10px 40px",
                borderRadius: "50px",
                fontWeight: 600,
              }}
            >
              <span>Get Started Free</span>
              {isRTL ? <FaLongArrowAltLeft /> : <FaLongArrowAltRight />}
            </Link>
          </Container>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default About;
