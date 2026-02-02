import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../../../../context/LanguageContext";
import { GiCheckMark } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "/src/features/auth/AuthProvider";
import { BACKEND_URL } from "../../../../api";
import { toast } from "react-toastify";

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

export default function Plans({ transformedPlans }) {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];
  const [isYearly, setIsYearly] = useState(false);
  const { requireLogin, accessToken } = useAuth();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [clickedPlan, setClickedPlan] = useState(null);

  const plans = [
    {
      fetchedDescMonthly: ".",
      fetchedDescYearly: ".",
      monthlycredits: 100,
      yearlycredits: 100,
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

      smallText: t["Forever free"],
      smallTextYearly: t["Forever free"],
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
      fetchedDescMonthly: transformedPlans[0]?.monthly.description,
      fetchedDescYearly: transformedPlans[0]?.yearly.description,
      monthlySlug: transformedPlans[0]?.monthly.slug,
      yearlySlug: transformedPlans[0]?.yearly.slug,
      monthlycredits: transformedPlans[0]?.monthly.creditsPerPeriod,
      yearlycredits: transformedPlans[0]?.yearly.creditsPerPeriod,
      id: 2,
      hasBorder: true,
      border: "rgba(0, 176, 255, 1)",
      shadow: "",
      badgeBg: "var(--gradient-color-2)",
      badgeText: "Most Popular",
      badgeColor: "white",

      image: "images/star-9.png",
      imageLabel: transformedPlans[0]?.name,

      priceMonthly: 9.99,
      priceYearly: 7.99,
      priceColor: "var(--gradient-color-2)",
      priceLabel: "/ month",

      smallText: t["Billed monthly"],
      smallTextYearly: t["$95.88 /year"],
      smallTextYearlyPlus: `(${t["Save 20%"]})`,
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
      buttonText: `${t["Start Plan"]} ${transformedPlans[0]?.name}`,
      buttonBorder: "",
    },

    {
      fetchedDescMonthly: transformedPlans[1]?.monthly.description,
      fetchedDescYearly: transformedPlans[1]?.yearly.description,
      monthlySlug: transformedPlans[1]?.monthly.slug,
      yearlySlug: transformedPlans[1]?.yearly.slug,
      monthlycredits: transformedPlans[1]?.monthly.creditsPerPeriod,
      yearlycredits: transformedPlans[1]?.yearly.creditsPerPeriod,
      id: 3,
      hasBorder: false,
      border: "",
      shadow: "0px 1px 4px 3px rgba(221, 235, 246, 1)",
      badgeBg: "rgba(0, 200, 83, 1)",
      badgeText: "Best Value",
      badgeColor: "white",

      image: "images/star-10.png",
      imageLabel: transformedPlans[1]?.name,

      priceMonthly: 19.99,
      priceYearly: 14.99,
      priceColor: "black",
      priceLabel: "/ month",

      smallText: t["Billed monthly"],
      smallTextYearly: t["$179.88 /year"],
      smallTextYearlyPlus: `(${t["Save 20%"]})`,
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
      buttonText: `${t["Start Plan"]} ${transformedPlans[1]?.name}`,
      buttonBorder: "",
    },
  ];

  const handlePlanClick = (passedSlug) => {
    if (isCheckoutLoading) return;

    requireLogin(async () => {
      setClickedPlan(passedSlug);
      setIsCheckoutLoading(true);

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
              planSlug: passedSlug,
            }),
          },
        );

        const data = await res.json();

        if (
          data.status === "fail" &&
          data.message.includes("Plan is not active")
        ) {
          setIsCheckoutLoading(false);
          toast.error(
            t[
              "This plan is temporarily unavailable for the selected subscription period!"
            ],
          );
          return;
        }
        if (!res.ok || !data?.data?.url) {
          setIsCheckoutLoading(false);
          toast.error(t["Something Went Wrong!"]);
          return;
        }

        window.location.href = data.data.url;
      } catch (error) {
        setIsCheckoutLoading(false);
        toast.error(t["Something Went Wrong!"]);
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
            {t["Save 20%"]}
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
              {t[plan.badgeText]}
            </div>

            <div style={{ marginBottom: "40px" }}>
              <span
                className={`block mb-4 text-center ${indx === 0 ? "opacity-0" : ""} text-sm -mt-4 text-gray-400`}
              >
                {isYearly ? plan.fetchedDescYearly : plan.fetchedDescMonthly}
              </span>
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
                  {t[plan.priceLabel]}
                </span>
              </div>

              <div
                style={{
                  color: "rgba(154, 154, 154, 1)",
                  fontSize: "12px",
                  marginBottom: "12px",
                }}
              >
                {isYearly ? (
                  <div className="flex gap-1.5">
                    <span>{plan.smallTextYearly}</span>
                    <span style={{ color: "rgba(0, 200, 83, 1)" }}>
                      {plan.smallTextYearlyPlus}
                    </span>
                  </div>
                ) : (
                  plan.smallText
                )}
              </div>

              <span style={{ marginBottom: "16px" }} className="block">
                {isYearly ? plan.yearlycredits : plan.monthlycredits}{" "}
                {[t["credits"]]}
              </span>

              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(68, 68, 68, 1)",
                  marginBottom: "14px",
                }}
              >
                {t[plan.desc]}
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
                      {t[f.text]}
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
                    isCheckoutLoading &&
                    (clickedPlan === plan.yearlySlug ||
                      clickedPlan === plan.monthlySlug)
                      ? 0.6
                      : 1,
                }}
                onClick={() =>
                  handlePlanClick(isYearly ? plan.yearlySlug : plan.monthlySlug)
                }
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading &&
                (clickedPlan === plan.yearlySlug ||
                  clickedPlan === plan.monthlySlug)
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
