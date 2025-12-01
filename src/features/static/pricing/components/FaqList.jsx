import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const data = [
  {
    image: "/images/refresh-1.png",
    question: "Can i change plans anytime ?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time from your billing page. Changes take effect immediately, and we'll prorate any payments.",
  },
  {
    image: "/images/refresh-2.png",
    question: "What payment methods do you accept ?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe.",
  },
  {
    image: "/images/refresh-3.png",
    question: "Is there a free trail ?",
    answer:
      "Yes! Pro and Premium plans come with a 7-day free trial. You won't be charged until the trial period ends. Cancel anytime during the trial with no charges.",
  },
  {
    image: "/images/refresh-4.png",
    question: "Can i cancel anytime ?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your billing page. You'll retain access until the end of your current billing period.",
  },
  {
    image: "/images/refresh-5.png",
    question: "What happens after i cancel ?",
    answer:
      "After cancellation, you'll keep access to your paid features until the end of your current billing period. After that, your account will revert to the Free plan.",
  },
  {
    image: "/images/refresh-6.png",
    question: "Do you offer refunds ?",
    answer:
      "Yes, we offer a 7-day money-back guarantee on your first purchase. If you're not satisfied, contact us within 7 days for a full refund. Note that renewals and older subscriptions are non-refundable.",
  },
  {
    image: "/images/refresh-7.png",
    question: "Can i use images commercially ?",
    answer:
      "Commercial use is available on Pro and Premium plans. Free plan images include watermarks and are for personal use only.",
  },
  {
    image: "/images/refresh-8.png",
    question: "How dose billing work ?",
    answer:
      "Billing is automatic and recurring. You'll be charged at the start of each billing period (monthly or yearly). You can view and manage your billing from your account settings.",
  },
];

export default function FaqList() {
  const [openIndex, setOpenIndex] = useState(null);

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
