import { useContext, useState } from "react";
import { LanguageContext } from "../../../../context/LanguageContext";
import { GiCheckMark } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import { useAuth } from "/src/features/auth/AuthProvider";
import { BACKEND_URL } from "/src/api";

const translations = { English, Arabic };

export default function Pricing() {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];
  const [isYearly, setIsYearly] = useState(false);
  const [planSlug, setPlanSlug] = useState(null);
  const { requireLogin, accessToken } = useAuth();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [clickedPlan, setClickedPlan] = useState(null);

  const plans = [
    {
      id: 1,
      hasBorder: false,
      border: "",
      shadow: "0px 1px 4px 3px rgba(221, 235, 246, 1)",
      badgeBg: "rgba(210, 220, 255, 1)",
      badgeText: "Free Forever",
      badgeColor: "rgba(0, 176, 255, 1)",

      image: "images/star-8.png",
      imageLabel: "Free",

      priceMonthly: 0,
      priceYearly: 0,
      priceColor: "black",
      priceLabel: "",

      smallText: "Forever free",
      smallTextYearly: "Forever free",
      smallTextYearlyPlus: "",
      desc: "Perfect for trying out our tools",

      features: [
        { text: "10 images per month", active: true },
        { text: "Standard quality output", active: true },
        { text: "All tools access", active: true },
        { text: "Watermark on downloads", active: true },
        { text: "HD/4K quality", active: false },
        { text: "Priority processing", active: false },
        { text: "Commercial use", active: false },
        { text: "Download history (7 days only)", active: false },
        { text: "No watermark", active: false },
      ],

      buttonBg: "",
      buttonColor: "rgba(0, 176, 255, 1)",
      buttonText: "Get Started Free",
      buttonBorder: "1.5px solid rgba(0, 176, 255, 1)",
    },

    {
      id: 2,
      hasBorder: true,
      border: "rgba(0, 176, 255, 1)",
      shadow: "",
      badgeBg: "var(--gradient-color-2)",
      badgeText: "Most Popular",
      badgeColor: "white",

      image: "images/star-9.png",
      imageLabel: "Pro",

      priceMonthly: 9.99,
      priceYearly: 7.99,
      priceColor: "var(--gradient-color-2)",
      priceLabel: "/ month",

      smallText: "Billed monthly",
      smallTextYearly: "$95.88 /year",
      smallTextYearlyPlus: "(save 20%)",
      desc: "Best for creators and professionals",

      features: [
        { text: "100 images per month", active: true },
        { text: "HD quality output", active: true },
        { text: "All tools access", active: true },
        { text: "No watermark", active: true },
        { text: "Priority processing", active: true },
        { text: "30-day download history", active: true },
        { text: "Commercial use allowed", active: true },
        { text: "Email support", active: true },
        { text: "4K quality", active: false },
        { text: "API access", active: false },
      ],

      buttonBg: "var(--gradient-color-2)",
      buttonColor: "white",
      buttonText: "Start Pro Plan",
      buttonBorder: "",
    },

    {
      id: 3,
      hasBorder: false,
      border: "",
      shadow: "0px 1px 4px 3px rgba(221, 235, 246, 1)",
      badgeBg: "rgba(0, 200, 83, 1)",
      badgeText: "Best Value",
      badgeColor: "white",

      image: "images/star-10.png",
      imageLabel: "Premium",

      priceMonthly: 19.99,
      priceYearly: 14.99,
      priceColor: "black",
      priceLabel: "/ month",

      smallTextYearly: "$179.88 /year",
      smallTextYearlyPlus: "(save 20%)",
      desc: "For power users and businesses",

      features: [
        { text: "Unlimited images", active: true },
        { text: "4K quality output", active: true },
        { text: "All tools access (including future tools)", active: true },
        { text: "No watermark", active: true },
        { text: "Fastest priority processing", active: true },
        { text: "Unlimited download history", active: true },
        { text: "Commercial use allowed", active: true },
        { text: "Priority email support", active: true },
        { text: "API access (coming soon)", active: true },
        { text: "Bulk processing", active: true },
        { text: "Team collaboration (coming soon)", active: true },
      ],

      buttonBg: "rgba(0, 200, 83, 1)",
      buttonColor: "white",
      buttonText: "Start Premium Plan",
      buttonBorder: "",
    },
  ];

  const handlePlanClick = (planType) => {
    if (isCheckoutLoading) return;

    requireLogin(async () => {
      setClickedPlan(planType);

      let slug = null;

      if (planType === "Pro") {
        slug = isYearly ? "pro-yearly" : "pro-monthly";
      } else if (planType === "Premium") {
        slug = isYearly ? "premium-yearly" : "premium-monthly";
      }

      setPlanSlug(slug);
      console.log("Selected planSlug:", slug);

      try {
        setIsCheckoutLoading(true);

        const res = await fetch(
          `${BACKEND_URL}/plans/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
            body: JSON.stringify({
              planSlug: slug,
            }),
          }
        );

        const data = await res.json();
        console.log("Checkout response:", data);

        if (!res.ok) {
          console.error("Checkout error:", data);
          setIsCheckoutLoading(false);
          return;
        }

        if (data?.data?.url) {
          window.location.href = data.data.url;
        }
      } catch (error) {
        console.error("Network error:", error);
        setIsCheckoutLoading(false);
      }
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-4 mb-16 flex-col md:flex-row">
        <div className="flex items-center justify-center gap-4 ">
          <span
            style={{
              fontWeight: "500",
              color: isYearly ? "rgba(150, 150, 150, 1)" : "black",
            }}
          >
            {t["Monthly"]}
          </span>

          <button
            className={`w-15 h-8 rounded-full flex items-center px-1 transition`}
            style={{
              backgroundColor: isYearly
                ? "rgba(0, 176, 255, 1)"
                : "rgba(225, 225, 225, 1)",
              cursor: isCheckoutLoading ? "not-allowed" : "pointer",
            }}
            onClick={() => {
              if (isCheckoutLoading) return;
              setIsYearly(!isYearly);
            }}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow transform duration-300 ${
                isYearly && isRTL
                  ? "-translate-x-7"
                  : isYearly && !isRTL
                  ? "translate-x-7"
                  : ""
              }`}
            />
          </button>

          <span
            style={{
              fontWeight: "500",
              color: isYearly ? "black" : "rgba(150, 150, 150, 1)",
            }}
          >
            {t["Yearly"]}
          </span>
        </div>

        {isYearly && (
          <span
            style={{
              padding: "6px 14px",
              backgroundColor: "rgba(0, 200, 83, 1)",
              color: "white",
              borderRadius: "20px",
            }}
          >
            Save 20%
          </span>
        )}
      </div>

      <div className="grid gap-12 lg:gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {plans.map((plan, indx) => (
          <div
            key={plan.id}
            className={`p-10 flex flex-col justify-between relative`}
            style={{
              boxShadow: plan.shadow,
              border:
                plan.hasBorder === true ? `1.5px solid ${plan.border}` : "",
              borderRadius: "20px",
            }}
          >
            <div
              className={`py-1 font-medium absolute`}
              style={{
                background: plan.badgeBg,
                color: plan.badgeColor,
                width: "118px",
                fontSize: "14px",
                textAlign: "center",
                borderRadius: "30px",
                top: "0",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {plan.badgeText}
            </div>

            <div style={{ marginBottom: "40px" }}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-[50px] h-[50px] flex items-center justify-center"
                  style={{
                    background: "var(--gradient-color-2)",
                    borderRadius: "10px",
                  }}
                >
                  <img src={plan.image} alt={plan.imageLabel} />
                </div>
                <span className="font-semibold text-[24px]">
                  {plan.imageLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: "40px",
                    fontWeight: "600",
                    background: plan.priceColor,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    wordSpacing: "-6px",
                  }}
                >
                  ${isYearly ? " " + plan.priceYearly : " " + plan.priceMonthly}
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    color: "rgba(144, 144, 144, 1)",
                    wordSpacing: "-3px",
                  }}
                >
                  {plan.priceLabel}
                </span>
              </div>

              <div
                style={{
                  color: "rgba(154, 154, 154, 1)",
                  fontSize: "12px",
                  marginBottom: "16px",
                }}
              >
                {isYearly ? (
                  <div className="flex  gap-1.5">
                    <span>{plan.smallTextYearly}</span>
                    <span style={{ color: "rgba(0, 200, 83, 1)" }}>
                      {plan.smallTextYearlyPlus}
                    </span>
                  </div>
                ) : (
                  plan.smallText
                )}
              </div>

              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(68, 68, 68, 1)",
                  marginBottom: "14px",
                }}
              >
                {plan.desc}
              </p>

              <div className="space-y-1.5">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {f.active ? (
                      <GiCheckMark
                        style={{
                          color: "rgba(0, 200, 83, 1)",
                          fontSize: "12px",
                        }}
                      />
                    ) : (
                      <RxCross2
                        style={{
                          color: "rgba(150, 150, 150, 1)",
                          fontSize: "12px",
                        }}
                      />
                    )}
                    <span
                      style={{
                        color: f.active
                          ? "rgba(65, 65, 65, 1)"
                          : "rgba(150, 150, 150, 1)",
                        fontSize: "12px",
                      }}
                    >
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {indx === 0 ? (
              ""
            ) : (
              <button
                style={{
                  background: plan.buttonBg,
                  color: plan.buttonColor,
                  fontWeight: "600",
                  fontSize: "18px",
                  border: plan.buttonBorder,
                  padding: "16px 0",
                  borderRadius: "15px",
                  cursor: isCheckoutLoading ? "not-allowed" : "pointer",
                  opacity:
                    isCheckoutLoading && clickedPlan === plan.imageLabel
                      ? 0.6
                      : 1,
                }}
                onClick={() => handlePlanClick(plan.imageLabel)}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading && clickedPlan === plan.imageLabel
                  ? "Loading ..."
                  : plan.buttonText}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
