import Layout from "../../../components/Layout";
import HeroSection from "../../../components/HeroSection";
import DynamicSidebar from "../../../components/DynamicSidebar";
import ContentSection from "../../../components/ContentSection";
import ParagraphHasBold from "../../../components/ParagraphHasBold";
import { XCircle } from "lucide-react";
import IconBox from "./components/IconBox";
import ReusableButton from "../../../components/ReusableButton";
import { useContext } from "react";
import { LanguageContext } from "../../../context/LanguageContext";

const heroContent = {
  id: "terms-hero",
  title: "Terms of Service",
  paragraphs: [
    "Please read these terms carefully before using our services.",
    "Last Updated: November 24, 2025",
  ],
  imageUrl: "/images/terms-60.png",
};

const sidebarItems = [
  { id: "terms-1", label: "1. Acceptance of Terms", targetId: "terms-1" },
  { id: "terms-2", label: "2. Usage Restrictions", targetId: "terms-2" },
  { id: "terms-3", label: "3. Service Guarantee", targetId: "terms-3" },
  { id: "terms-4", label: "4. Payment Terms", targetId: "terms-4" },
  { id: "terms-6", label: "5. Cancelation", targetId: "terms-6" },
  { id: "terms-7", label: "6. Intellectual Property", targetId: "terms-7" },
  { id: "terms-8", label: "7. Limitation of Liability", targetId: "terms-8" },
  { id: "terms-9", label: "8. Account Termination", targetId: "terms-9" },
  { id: "terms-10", label: "9. Changes to Terms", targetId: "terms-10" },
  { id: "terms-11", label: "10. Governing Law", targetId: "terms-11" },
  { id: "terms-12", label: "11. Contact us", targetId: "terms-12" },
];

const data = [
  "Harmful or abusive content",
  "Illegal material",
  "Political content",
  "Nudity",
  "Content violating others' rights",
  "Platform misuse or interference",
  "Unauthorized automated access",
];

const data2 = [
  {
    image: "/images/credit-card-1.png",
    title: "Billing System",
    descreption: "Payment processed securely through Stripe",
  },
  {
    image: "/images/credit-card-2.png",
    title: "Auto-Renewal",
    descreption: "Subscriptions renew automatically each period",
  },
  {
    image: "/images/credit-card-3.png",
    title: "Payment Methods",
    descreption: "All major credit/debit cards via Stripe",
  },
  {
    image: "/images/credit-card-4.png",
    title: "Price Changes",
    descreption: "30 days advance notice for any changes",
  },
];

const data3 = [
  {
    image: "/images/credit-card-5.png",
    title: "Data Loss",
    descreption: "Loss of user data or files",
  },
  {
    image: "/images/credit-card-6.png",
    title: "Service Interruptions",
    descreption: "Downtime or unavailability",
  },
  {
    image: "/images/credit-card-7.png",
    title: "Misuse by User",
    descreption: "Actions taken by users",
  },
  {
    image: "/images/credit-card-8.png",
    title: "Force Majeure",
    descreption: "Events outside our control",
  },
];

function TermsOfService() {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <Layout>
      <HeroSection content={heroContent} />

      <div className="flex flex-col lg:flex-row gap-16">
        <DynamicSidebar items={sidebarItems} />

        <div className="flex-1 space-y-7">
          <ContentSection
            id="terms-1"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/terms-101.png"
            title="Acceptance of Terms"
          >
            <ParagraphHasBold>
              By accessing and using PicSharps, you accept and agree to be bound
              by these Terms of Service. If you do not agree, please do not use
              our services.
            </ParagraphHasBold>
          </ContentSection>

          <ContentSection
            id="terms-2"
            background="rgba(255, 250, 235, 1)"
            border="1px solid rgba(255, 228, 149, 1)"
            boxShadow=""
            image="/images/terms-102.png"
            title="Usage Restrictions"
          >
            <div className="space-y-5">
              <ParagraphHasBold>
                You agree not to use our tools or services to create, upload, or
                distribute any content that is harmful, abusive, illegal,
                political, nudity, or violates the rights of others. You also
                agree not to misuse the platform, attempt to interfere with its
                functionality, or use automated systems to access the services
                in an unauthorized way.
              </ParagraphHasBold>
              <div
                className="p-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  borderRadius: "15px",
                }}
              >
                <h2 style={{ fontWeight: "600", marginBottom: "6px" }}>
                  Prohibited Content Includes:
                </h2>
                {data.map((point, index) => (
                  <div key={index} className="flex pl-4">
                    <div
                      className={`h-7 flex items-center justify-center ${
                        isRTL ? "ml-2" : "mr-2"
                      }`}
                    >
                      <XCircle className="w-[15px] text-red-600" />
                    </div>
                    <span
                      style={{
                        color: "rgba(102, 102, 102, 1)",
                        marginTop: "2px",
                      }}
                    >
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ContentSection>

          <ContentSection
            id="terms-3"
            background="rgba(240, 250, 255, 1)"
            border="1px solid rgba(151, 220, 255, 1)"
            boxShadow=""
            image="/images/terms-103.png"
            title="No Guarantee of Results"
          >
            <div
              style={{
                backgroundColor: "rgba(255, 250, 235, 1)",
                padding: "25px",
                border: "1px solid rgba(255, 228, 149, 1)",
                borderRadius: "30px",
              }}
            >
              <ParagraphHasBold bold={["'AS", "IS'"]}>
                We do not provide any guarantee regarding the accuracy, quality,
                or perfection of the results generated by our AI tools. All
                outputs are provided 'AS IS' based on the available AI models
                and processing capabilities. We are not responsible for
                unexpected outcomes, quality variations, or any decisions made
                based on the generated results.
              </ParagraphHasBold>
            </div>
          </ContentSection>

          <ContentSection
            id="terms-4"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/terms-104.png"
            title="Payment & Subscription"
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
              }}
              className="mt-7 justify-center gap-4"
            >
              {data2.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRadius: "15px",
                    padding: "18px",
                    backgroundColor: "rgba(245, 245, 245, 1)",
                  }}
                  className="w-full md:w-[48%]"
                >
                  <div className="h-14">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <h2
                    style={{
                      fontSize: "14px",
                      letterSpacing: "2px",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "12px",
                      letterSpacing: "2px",
                      color: "rgba(115, 115, 115, 1)",
                    }}
                  >
                    {item.descreption}
                  </p>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            id="terms-5"
            background="rgba(234, 255, 243, 1)"
            border="1px solid rgba(123, 255, 178, 1)"
            boxShadow=""
            image="/images/terms-105.png"
            title="Refund Policy"
          >
            <div className="space-y-3">
              <IconBox
                borderColor={"rgba(0, 228, 95, 1)"}
                backgroundColor={"rgba(211, 255, 229, 1)"}
                icon={"/images/checkmark-5.png"}
                title={"Refunds Allowed"}
                desc="Within 7 days of first purchase"
                bold={["7", "days"]}
              />
              <IconBox
                borderColor={"rgba(228, 0, 0, 1)"}
                backgroundColor={"rgba(255, 240, 240, 1)"}
                icon={"/images/checkmark-6.png"}
                title={"Non-Refundable"}
                desc="Renewals and old subscriptions"
              />
            </div>
          </ContentSection>

          <ContentSection
            id="terms-6"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/terms-106.png"
            title="How to Cancel Your Subscription"
          >
            <p
              style={{ color: "rgba(102, 102, 102, 1)", marginBottom: "15px" }}
            >
              Users can cancel anytime from the Billing page.
            </p>
            <ReusableButton
              text="Go to Billing"
              position={isRTL ? "right" : "left"}
            />
          </ContentSection>

          <ContentSection
            id="terms-7"
            background="rgba(234, 255, 243, 1)"
            border="1px solid rgba(123, 255, 178, 1)"
            boxShadow=""
            image="/images/terms-107.png"
            title="Ownership & Intellectual Property"
          >
            <div
              className="flex flex-col items-center"
              style={{
                backgroundColor: "rgba(211, 255, 229, 1)",
                padding: "25px",
                border: "2px solid rgba(0, 228, 95, 1)",
                borderRadius: "15px",
              }}
            >
              <img src="images/checkmark-20.png" alt="copy" className="mb-3" />
              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "24px",
                  marginBottom: "5px",
                  textAlign: "center",
                }}
              >
                YOU OWN YOUR CONTENT
              </h2>
              <p
                className="text-center"
                style={{
                  fontSize: "14px",
                  letterSpacing: "2px",
                  color: "rgba(92, 92, 92, 1)",
                }}
              >
                Users retain full ownership of all images they upload and
                generate. picsharps does not claim any rights to your content.
              </p>
            </div>
          </ContentSection>

          <ContentSection
            id="terms-8"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/terms-108.png"
            title="Limitation of Liability"
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
              }}
              className="mt-7 justify-center gap-4"
            >
              {data3.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRadius: "15px",
                    padding: "18px",
                    backgroundColor: "rgba(245, 245, 245, 1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  className="w-full md:w-[48%]"
                >
                  <div className="h-20">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <h2
                    style={{
                      fontSize: "14px",
                      letterSpacing: "2px",
                      fontWeight: "500",
                      marginBottom: "5px",
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "12px",
                      letterSpacing: "2px",
                      color: "rgba(115, 115, 115, 1)",
                    }}
                  >
                    {item.descreption}
                  </p>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            id="terms-9"
            background="rgba(255, 250, 235, 1)"
            border="1px solid rgba(255, 228, 149, 1)"
            boxShadow=""
            image="/images/terms-109.png"
            title="Usage Restrictions"
          >
            <div className="space-y-3">
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(91, 91, 91, 1)",
                  letterSpacing: "2px",
                }}
              >
                We may terminate accounts for:
              </p>
              <IconBox
                borderColor={"rgba(228, 0, 0, 1)"}
                backgroundColor={"rgba(255, 240, 240, 1)"}
                icon={"/images/checkmark-7.png"}
                title={"Abuse or Misuse"}
              />
              <IconBox
                borderColor={"rgba(228, 0, 0, 1)"}
                backgroundColor={"rgba(255, 240, 240, 1)"}
                icon={"/images/checkmark-6.png"}
                title={"Illegal Activity"}
              />
              <IconBox
                borderColor={"rgba(228, 0, 0, 1)"}
                backgroundColor={"rgba(255, 240, 240, 1)"}
                icon={"/images/checkmark-8.png"}
                title={"System Attacks or Exploitation"}
              />
            </div>
          </ContentSection>

          <ContentSection
            id="terms-10"
            background="rgba(240, 250, 255, 1)"
            border="1px solid rgba(151, 220, 255, 1)"
            boxShadow=""
            image="/images/terms-110.png"
            title="Changes to Terms of Service"
          >
            <ParagraphHasBold bold={["Email"]}>
              Users will be notified via Email when terms are updated. Continued
              use after notification constitutes acceptance of new terms.
            </ParagraphHasBold>
          </ContentSection>

          <ContentSection
            id="terms-11"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/terms-111.png"
            title="Governing Law"
          >
            <div className="flex flex-col items-center gap-5 text-center">
              <img src="/images/balance-1.png" alt="Law" />
              <ParagraphHasBold bold={["United", "Arab", "Emirates", "(UAE)"]}>
                These Terms are governed by the laws of United Arab Emirates
                (UAE)
              </ParagraphHasBold>
            </div>
          </ContentSection>

          <ContentSection
            id="terms-12"
            background="white"
            border=""
            boxShadow={"0px 0px 4px 1px rgba(205, 228, 247, 1)"}
            image="/images/terms-112.png"
            title="Questions About Terms?"
          >
            <div className="flex flex-col items-center gap-5 text-center">
              <img src="/images/balance-2.png" alt="Law" />
              <ParagraphHasBold>
                If you have any questions about these Terms of Service, please
                contact us.
              </ParagraphHasBold>
              <ReusableButton text="Contact us" position="left" />
            </div>
          </ContentSection>
        </div>
      </div>
    </Layout>
  );
}

export default TermsOfService;
