import { useContext, useState } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import Header from "../../../components/Header";
import Container from "../../../components/Container";
import Plans from "./components/Plans";
import ComparisonTableDesktop from "./components/ComparisonTableDesktop";
import ComparisonTableMobile from "./components/ComparisonTableMobile";
import FeatureModal from "./components/FeatureModal";
import FaqList from "./components/FaqList";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import Footer from "../../../components/Footer";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";

const translations = { English, Arabic };

function Pricing() {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];
  const [selectedFeature, setSelectedFeature] = useState(null);

  const data = {
    columns: ["Free", "Pro", "Premium"],
    features: [
      {
        section: "USAGE LIMITS",
        rows: [
          {
            feature: "Max file size",
            values: {
              Free: "10MB",
              Pro: "25MB",
              Premium: "100MB",
            },
          },
          {
            feature: "Storage duration",
            values: {
              Free: "7 days",
              Pro: "30 days",
              Premium: "Unlimited",
            },
          },
        ],
      },

      {
        section: "OUTPUT QUALITY",
        rows: [
          {
            feature: "HD quality",
            values: {
              Free: false,
              Pro: true,
              Premium: true,
            },
          },
          {
            feature: "4k quality",
            values: {
              Free: false,
              Pro: false,
              Premium: true,
            },
          },
        ],
      },

      {
        section: "FEATURES",
        rows: [
          {
            feature: "Watermark removal",
            values: {
              Free: false,
              Pro: true,
              Premium: true,
            },
          },
          {
            feature: "Priority processing",
            values: {
              Free: false,
              Pro: true,
              Premium: true,
            },
          },
          {
            feature: "Commercial use",
            values: {
              Free: false,
              Pro: true,
              Premium: true,
            },
          },
          {
            feature: "Download history",
            values: {
              Free: "7 days",
              Pro: "30 days",
              Premium: "Unlimited",
            },
          },
          {
            feature: "API access",
            values: {
              Free: false,
              Pro: false,
              Premium: true,
            },
          },
          {
            feature: "Bulk processing",
            values: {
              Free: false,
              Pro: false,
              Premium: true,
            },
          },
        ],
      },

      {
        section: "SUPPORT",
        rows: [
          {
            feature: "Email support",
            values: {
              Free: false,
              Pro: true,
              Premium: true,
            },
          },
          {
            feature: "Priority support",
            values: {
              Free: false,
              Pro: false,
              Premium: true,
            },
          },
        ],
      },
    ],
  };

  const data2 = [
    {
      text: "The Pro plan is worth every penny. The quality is outstanding and the processing speed is incredible!",
      name: "Sarah Johnson",
      job: "Graphic Designer",
    },
    {
      text: "I've tried many tools, but this one stands out. The Premium plan has everything I need for my business.",
      name: "Michael Chen",
      job: "Marketing Director",
    },
    {
      text: "Great value for money! The interface is intuitive and the results are consistently high quality.",
      name: "Emily Rodriguez",
      job: "Content Creator",
    },
  ];

  const data3 = [
    {
      imgSrc: "/images/padlock-4.png",
      title: t["Secure Payment"],
    },
    {
      imgSrc: "/images/padlock-3.png",
      title: t["SSL Encrypted"],
    },
    {
      imgSrc: "/images/padlock-2.png",
      title: t["Money Back Guarantee"],
    },
    {
      imgSrc: "/images/padlock-1.png",
      title: "+10,000 " + t["Users Number"],
    },
  ];

  return (
    <>
      <Header />

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(223, 242, 255, 0.15) 0%,  rgb(240, 240, 240) 100%)",
          paddingTop: "160px",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <section className="pb-28">
          <Container>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <h1
                style={{
                  marginBottom: "12px",
                  fontSize: "48px",
                  fontWeight: "900",
                  letterSpacing: "2px",
                }}
              >
                {t["Simple, Transparent Pricing"]}
              </h1>
              <p
                style={{
                  fontWeight: "500",
                  letterSpacing: "2px",
                }}
              >
                {
                  t[
                    "Choose the perfect plan for your image editing needs. Upgrade, downgrade, or cancel anytime"
                  ]
                }
              </p>
            </div>

            <Plans />
          </Container>
        </section>

        <section
          style={{
            backgroundColor: "rgba(236, 236, 236)",
            paddingTop: "70px",
            paddingBottom: "120px",
          }}
        >
          <Container>
            <div className="w-full">
              <div className="text-center">
                <h2
                  style={{
                    fontSize: "40px",
                    fontWeight: "600",
                    marginBottom: "5px",
                  }}
                >
                  {t["Compare All Features"]}
                </h2>
                <p
                  style={{
                    fontSize: "20px",
                    color: "rgba(127, 127, 127, 1)",
                    letterSpacing: "2px",
                    marginBottom: "50px",
                  }}
                >
                  {t["See what's included in each plan"]}
                </p>
              </div>

              <div className="hidden lg:block">
                <ComparisonTableDesktop data={data} />
              </div>

              <div className="block lg:hidden">
                <ComparisonTableMobile
                  data={data}
                  onSelectFeature={setSelectedFeature}
                />
              </div>

              <FeatureModal
                feature={selectedFeature}
                onClose={() => setSelectedFeature(null)}
              />
            </div>
          </Container>
        </section>

        <section
          style={{
            backgroundColor: "rgba(226, 246, 255, 1)",
            paddingTop: "60px",
            paddingBottom: "60px",
          }}
        >
          <Container>
            <div className="flex justify-center items-center flex-col md:flex-row gap-10">
              <div
                className="flex justify-center items-center"
                style={{
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "var(--gradient-color-2)",
                }}
              >
                <img src="/images/star-5.png" alt="money-back" />
              </div>
              <div className="text-center">
                <h2
                  style={{
                    fontWeight: "700",
                    fontSize: "32px",
                    marginBottom: "20px",
                  }}
                >
                  {t["7-Day Money Back Guarantee"]}
                </h2>
                <p
                  style={{
                    letterSpacing: "2px",
                    fontWeight: "500",
                    color: "rgba(91, 91, 91, 1)",
                    marginBottom: "5px",
                  }}
                >
                  {
                    t[
                      "try risk-free! refunds available within 7 days of first purchase"
                    ]
                  }
                </p>
                <p
                  style={{
                    letterSpacing: "2px",
                    fontWeight: "500",
                    color: "rgba(91, 91, 91, 1)",
                  }}
                >
                  {t["note: renewals and old subscriptions are non-refundable"]}
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section
          style={{
            paddingTop: "70px",
            paddingBottom: "95px",
          }}
        >
          <Container>
            <div className="text-center">
              <h2
                style={{
                  fontSize: "40px",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                {t["Frequently Asked Questions"]}
              </h2>
              <p
                style={{
                  fontSize: "20px",
                  color: "rgba(127, 127, 127, 1)",
                  letterSpacing: "2px",
                  marginBottom: "50px",
                }}
              >
                {t["Everything you need to know about our pricing and plans"]}
              </p>
            </div>
            <FaqList />
          </Container>
        </section>

        <section className="pb-30">
          <Container>
            <div className="text-center">
              <h2
                style={{
                  fontSize: "40px",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                {t["Loved by Thousands of Users"]}
              </h2>
              <p
                style={{
                  fontSize: "20px",
                  color: "rgba(127, 127, 127, 1)",
                  letterSpacing: "2px",
                  marginBottom: "50px",
                }}
              >
                {t["See what our customers are saying"]}
              </p>
            </div>
            <div className={`w-full flex flex-wrap gap-6`} dir="ltr">
              {data2.map((item, index) => (
                <div
                  key={index}
                  className="
                    w-full 
                    sm:w-[calc(50%-12px)] 
                    lg:w-[calc(33.333%-16px)]
                  bg-white p-[30px] rounded-3xl 
                    flex flex-col justify-between
                  "
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "2px",
                        marginBottom: "14px",
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <img key={i} src="/images/star-1.png" alt="" />
                      ))}
                    </div>

                    <span
                      style={{
                        color: "rgba(83, 83, 83, 1)",
                        fontSize: "13px",
                        marginBottom: "12px",
                      }}
                    >
                      "{item.text}"
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "var(--gradient-color-2)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "700",
                        color: "white",
                        borderRadius: "50%",
                      }}
                    >
                      {item.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: "13px" }}>{item.name}</p>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "rgba(172, 172, 172, 1)",
                        }}
                      >
                        {item.job}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section style={{ backgroundColor: "white", padding: "32px 0 48px 0" }}>
          <Container>
            <div className={`w-full flex flex-wrap sm:justify-center`}>
              {data3.map((item, index) => (
                <div
                  key={index}
                  className={`
                    w-[65%]
                    sm:w-[50%]
                    lg:w-[20%]
                    xl:w-[18%]
                    flex items-center lg:justify-center pt-4 gap-2
                  `}
                >
                  <div className="w-8 h-7 flex items-center justify-center">
                    <img src={item.imgSrc} alt={item.title} />
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </Container>
        </section>

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
              {t["Ready To Transform Your Images?"]}
            </h2>
            <p
              style={{
                marginBottom: "35px",
                fontSize: "24px",
                fontWeight: "500",
                color: "white",
              }}
            >
              {t["Join Thousands Of Users Who Trust Picsharps"]}
            </p>
            <Link
              className={`
                flex items-center gap-2 mx-auto justify-center
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
              to={"/all-tools"}
            >
              <span>{t["Get Started Free"]}</span>
              {isRTL ? <FaLongArrowAltLeft /> : <FaLongArrowAltRight />}
            </Link>
          </Container>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Pricing;
