import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import { useContext } from "react";
import { LanguageContext } from "../../../../context/LanguageContext";

const translations = { English, Arabic };

export default function FaqList() {
  const [openIndex, setOpenIndex] = useState(null);
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  const data = [
    {
      image: "/images/refresh-1.png",
      question: t["Can I change plans anytime?"],
      answer:
        t[
          "Yes! You can upgrade or downgrade your plan at any time from your billing page. Changes take effect immediately, and we'll prorate any payments."
        ],
    },
    {
      image: "/images/refresh-2.png",
      question: t["What payment methods do you accept?"],
      answer:
        t[
          "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe."
        ],
    },
    {
      image: "/images/refresh-3.png",

      question: t["Is there a free trial?"],
      answer:
        t[
          "Yes! Pro and Premium plans come with a 7-day free trial. You won't be charged until the trial period ends. Cancel anytime during the trial with no charges."
        ],
    },
    {
      image: "/images/refresh-4.png",
      question: t["Can I cancel anytime?"],
      answer:
        t[
          "Absolutely. You can cancel your subscription at any time from your billing page. You'll retain access until the end of your current billing period."
        ],
    },
    {
      image: "/images/refresh-5.png",
      question: t["What happens after I cancel?"],
      answer:
        t[
          "After cancellation, you'll keep access to your paid features until the end of your current billing period. After that, your account will revert to the Free plan."
        ],
    },
    {
      image: "/images/refresh-6.png",
      question: t["Do you offer refunds?"],
      answer:
        t[
          "Yes, we offer a 7-day money-back guarantee on your first purchase. If you're not satisfied, contact us within 7 days for a full refund. Note that renewals and older subscriptions are non-refundable."
        ],
    },
    {
      image: "/images/refresh-7.png",
      question: t["Can I use images commercially?"],
      answer:
        t[
          "Commercial use is available on Pro and Premium plans. Free plan images include watermarks and are for personal use only."
        ],
    },
    {
      image: "/images/refresh-8.png",
      question: t["How does billing work?"],
      answer:
        t[
          "Billing is automatic and recurring. You'll be charged at the start of each billing period (monthly or yearly). You can view and manage your billing from your account settings."
        ],
    },
  ];

  const toggle = (i) => {
    if (openIndex === i) return setOpenIndex(null);
    setOpenIndex(i);
  };

  return (
    <div className="w-full lg:w-4/5 mx-auto flex flex-col gap-4">
      {data.map((item, i) => (
        <div
          key={i}
          className="p-4 flex flex-col transition-all bg-white cursor-pointer"
          style={{
            border: "1px solid rgba(204, 204, 204, 1)",
            borderRadius: "15px",
          }}
          onClick={() => toggle(i)}
        >
          <div className="flex items-center gap-3">
            <div className="hidden xs:flex items-center justify-center w-[33px] h-[33px]">
              <img src={item.image} />
            </div>

            <div className="flex-1 min-w-[200px]">
              <p>{item.question}</p>
            </div>

            <div className="flex items-center justify-end w-7 h-7">
              {openIndex === i ? (
                <IoChevronUp size={18} />
              ) : (
                <IoChevronDown size={18} />
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="hidden xs:block w-[33px]"></div>

            <div className="flex-1">
              <div
                className={`transition-all overflow-hidden ${
                  openIndex === i
                    ? "max-h-[500px] opacity-100 mt-3"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p
                  style={{ fontSize: "14px", color: "rgba(104, 104, 104, 1)" }}
                >
                  {item.answer}
                </p>
              </div>
            </div>

            <div className="w-7 bg-amber-600"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
