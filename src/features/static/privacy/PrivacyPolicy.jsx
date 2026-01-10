import Layout from "../../../components/Layout";
import HeroSection from "../../../components/HeroSection";
import DynamicSidebar from "../../../components/DynamicSidebar";
import ContentSection from "../../../components/ContentSection";
import ParagraphHasBold from "../../../components/ParagraphHasBold";
import BulletListHasBold from "./Components/BulletListHasBold";
import BorderedBox from "./Components/BorderedBox";
import ReusableButton from "../../../components/ReusableButton";
import { useContext } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";

const translations = { English, Arabic };

const heroContent = {
  id: "privacy-hero",
  title: "Privacy Policy",
  paragraphs: [
    "Your privacy matters to us. Learn how we collect, use, and protect your data.",
    "Last Updated: November 24, 2025",
  ],
  imageUrl: "/images/privacy-60.png",
};

const sidebarItems = [
  { id: "privacy-1", label: "1. Introduction", targetId: "privacy-1" },
  {
    id: "privacy-2",
    label: "2. Information We Collect",
    targetId: "privacy-2",
  },
  { id: "privacy-3", label: "3. How We Use Your Data", targetId: "privacy-3" },
  {
    id: "privacy-4",
    label: "4. Data Sharing & Third Parties",
    targetId: "privacy-4",
  },
  {
    id: "privacy-5",
    label: "5. Data Storage & Retention",
    targetId: "privacy-5",
  },
  {
    id: "privacy-6",
    label: "6. Your Data Rights",
    targetId: "privacy-6",
  },
  {
    id: "privacy-7",
    label: "7. Third-Party Authentication",
    targetId: "privacy-7",
  },
  {
    id: "privacy-8",
    label: "8. Image security",
    targetId: "privacy-8",
  },
  {
    id: "privacy-9",
    label: "9. Cookies & Tracking",
    targetId: "privacy-9",
  },
  {
    id: "privacy-10",
    label: "10. Age Policy",
    targetId: "privacy-10",
  },
  {
    id: "privacy-11",
    label: "11. Contact us",
    targetId: "privacy-11",
  },
];

const data = [
  {
    title: "Images",
    points: [
      "✓ Stored for 30 days",
      "✓ Then automatically deleted",
      "✓ Securely encrypted in transit and at rest",
    ],
  },
  {
    title: "Account Data",
    points: [
      "✓ Stored as long as account is active",
      "✓ Deleted upon account deletion",
      "✓ Backup retention: 90 days",
    ],
  },
];

function PrivacyPolicy() {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  return (
    <Layout>
      <HeroSection content={heroContent} />

      <div className="flex flex-col lg:flex-row gap-16">
        <DynamicSidebar items={sidebarItems} />

        <div className="flex-1 space-y-7">
          <ContentSection
            id="privacy-1"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/privacy-101.png"
            title={t["Introduction"]}
          >
            <ParagraphHasBold>
              {
                t[
                  "Yes, we collect limited user data necessary to operate and improve our services. This may include technical data such as browser type, device information, and usage statistics. We do not collect any unnecessary personal information."
                ]
              }
            </ParagraphHasBold>
          </ContentSection>

          <ContentSection
            id="privacy-2"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/privacy-102.png"
            title={t["Information We Collect"]}
          >
            <BulletListHasBold
              title={t["We collect the following types of information:"]}
              items={[
                t["Technical data (browser type, device information)"],
                t["Usage statistics to improve service performance"],
                t["Images you upload (stored temporarily)"],
                t[
                  "Account information from Google login (name, email, profile picture)"
                ],
              ]}
            />
          </ContentSection>

          <ContentSection
            id="privacy-3"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/privacy-103.png"
            title={t["How We Use Your Data"]}
          >
            <BulletListHasBold
              title={
                t["We use your data exclusively for the following purposes:"]
              }
              items={[
                t[
                  "Service Operation: To provide core functionality and process your requests"
                ],
                t[
                  "Performance Improvement: To analyze usage patterns and optimize our platform"
                ],
                t[
                  "User Experience Enhancement: To personalize your experience and provide better results"
                ],
              ]}
              boldWords={[
                t["Service"],
                t["Operation:"],
                t["Performance"],
                t["Improvement:"],
                t["User"],
                t["Experience"],
                t["Enhancement:"],
              ]}
            />
          </ContentSection>

          <ContentSection
            id="privacy-4"
            background="rgba(240, 250, 255, 1)"
            border="1px solid rgba(151, 220, 255, 1)"
            boxShadow=""
            image="/images/privacy-104.png"
            title={t["Data Sharing & Third Parties"]}
          >
            <div className="space-y-5">
              <BulletListHasBold
                title={t["We only share data with:"]}
                items={[
                  t["Stripe for secure payment processing"],
                  t["Analytics providers for performance improvement"],
                ]}
                boldWords={[t["Stripe"], t["Analytics"], t["providers"]]}
              />
              <BorderedBox
                title={t["We do not sell user data, period."]}
                borderColor="rgba(0, 228, 95, 1)"
                bgColor="rgba(211, 255, 229, 1)"
              />
            </div>
          </ContentSection>

          <ContentSection
            id="privacy-5"
            background="rgba(240, 250, 255, 1)"
            border="1px solid rgba(151, 220, 255, 1)"
            boxShadow=""
            image="/images/privacy-105.png"
            title={t["Data Storage & Retention"]}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
              className="md:space-y-0 space-y-4 mt-6"
            >
              {data.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid rgba(230, 230, 230, 1)",
                    borderRadius: "15px",
                    padding: "18px",
                    backgroundColor: "white",
                  }}
                  className="w-full md:w-[48.5%]"
                >
                  <h2
                    style={{
                      fontSize: "14px",
                      letterSpacing: "2px",
                      fontWeight: "bold",
                      marginBottom: "15px",
                    }}
                  >
                    {t[item.title]}
                  </h2>

                  {item.points.map((point, i) => (
                    <span
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                        fontSize: "12px",
                        letterSpacing: "2px",
                      }}
                    >
                      {t[point]}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            id="privacy-6"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/privacy-106.png"
            title={t["Your Data Rights"]}
          >
            <BulletListHasBold
              title={
                t[
                  "You have complete control over your data. You have the right to:"
                ]
              }
              items={[
                t["Download a copy of all your data"],
                t["Request complete account deletion"],
                t["Access and review your information at any time"],
                t["Opt-out of non-essential data collection"],
              ]}
            />
          </ContentSection>

          <ContentSection
            id="privacy-7"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/privacy-107.png"
            title={t["Third-Party Authentication"]}
          >
            <div className="space-y-1.5">
              <BulletListHasBold
                title={
                  t[
                    "Our platform provides login through Google for your convenience. When you sign in with Google, we only access basic profile information necessary for account creation, including:"
                  ]
                }
                items={[
                  t["Your name"],
                  t["Email address"],
                  t["Profile picture (optional)"],
                ]}
              />
              <ParagraphHasBold>
                {
                  t[
                    "Yes, we collect limited user data necessary to operate and improve our services. This may include technical data such as browser type, device information, and usage statistics. We do not collect any unnecessary personal information."
                  ]
                }
              </ParagraphHasBold>
            </div>
          </ContentSection>

          <ContentSection
            id="privacy-8"
            background="rgba(240, 250, 255, 1)"
            border="1px solid rgba(151, 220, 255, 1)"
            boxShadow=""
            image="/images/privacy-108.png"
            title={t["How We Protect Your Images"]}
          >
            <div className="space-y-1.5">
              <ParagraphHasBold>
                {
                  t[
                    "We temporarily store the images you upload on our servers to ensure proper processing and to provide features such as download history or re-accessing previous results."
                  ]
                }
              </ParagraphHasBold>
              <BulletListHasBold
                title={t["Security measures include:"]}
                items={[
                  t["End-to-end encryption during upload and storage"],
                  t["Strict access controls - only you can access your images"],
                  t["Regular security audits and monitoring"],
                  t["Automatic deletion after 30 days"],
                ]}
                boldWords={[t["Security"], t["measures"], t["include:"]]}
              />
              <div style={{ marginTop: "16px" }}>
                <BorderedBox
                  title={
                    t[
                      "Your images are never shared, reused, or used for AI training."
                    ]
                  }
                  description={
                    t["You may request immediate deletion at any time."]
                  }
                  borderColor="rgb(8, 120, 255)"
                  bgColor="white"
                />
              </div>
            </div>
          </ContentSection>

          <ContentSection
            id="privacy-9"
            background="rgba(240, 250, 255, 1)"
            border="1px solid rgba(151, 220, 255, 1)"
            boxShadow=""
            image="/images/privacy-109.png"
            title={t["Cookies & Tracking"]}
          >
            <div style={{ marginTop: "25px", marginBottom: "16px" }}>
              <BorderedBox
                title={t["Good news!"]}
                description={
                  t[
                    "We do not use cookies or tracking tools like Google Analytics. Your browsing experience is completely private and ad-free."
                  ]
                }
                borderColor="rgba(0, 228, 95, 1)"
                bgColor="rgba(211, 255, 229, 1)"
              />
            </div>
            <ParagraphHasBold>
              {
                t[
                  "We only use essential session storage to maintain your login state, which is cleared when you log out or close your browser."
                ]
              }
            </ParagraphHasBold>
          </ContentSection>

          <ContentSection
            id="privacy-10"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/privacy-110.png"
            title={t["Age Policy"]}
          >
            <ParagraphHasBold>
              {
                t[
                  "Our service is designed to be safe and appropriate for all age groups. We do not knowingly collect personal information from children, and we encourage parental supervision for younger users."
                ]
              }
            </ParagraphHasBold>
          </ContentSection>

          <ContentSection
            id="privacy-11"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/privacy-111.png"
            title={t["Privacy Questions?"]}
          >
            <div className="space-y-3">
              <ParagraphHasBold>
                {
                  t[
                    "If you have any questions about our privacy practices, need clarification on how we handle your data, or want to exercise your data rights, please don't hesitate to reach out."
                  ]
                }
              </ParagraphHasBold>
              <ReusableButton
                text={t["Contact Us"]}
                position={isRTL ? "right" : "left"}
                onClick={() => (window.location.href = "/contact-us")}
              />
            </div>
          </ContentSection>
        </div>
      </div>
    </Layout>
  );
}

export default PrivacyPolicy;
