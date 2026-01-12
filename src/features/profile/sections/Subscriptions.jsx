import ReusableButton from "/src/components/ReusableButton";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import { useContext } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import { FiCalendar, FiDollarSign, FiExternalLink } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { FaRegCalendarCheck } from "react-icons/fa";
import { useState } from "react";
import { BsArrowsFullscreen } from "react-icons/bs";
import { AiOutlineFullscreenExit } from "react-icons/ai";

const translations = { English, Arabic };

function Subscriptions({ data, billings }) {
  const { language, direction } = useContext(LanguageContext);
  const t = translations[language] || translations["English"];
  const isRTL = direction === "rtl";
  const [visibleCount, setVisibleCount] = useState(4);

  return (
    <div className="">
      <div className="mb-12">
        {/* free plan case*/}
        {data?.data?.profile?.lastSubscription === null ? (
          <div
            style={{ border: "3px solid #00b0ff", borderRadius: "15px" }}
            className="p-6"
          >
            <h3
              style={{
                color: "#00b0ff",
              }}
              className="font-bold text-xl mb-2"
            >
              {t["Free Plan"]}
            </h3>
            <p
              className="font-semibold text-md mb-6"
              style={{
                color:
                  data?.data?.profile?.creditsBalance == 0 ? "red" : "#00c853",
              }}
            >
              {data?.data?.profile?.creditsBalance} {t["credits remaining of"]}{" "}
              100
            </p>
            <ReusableButton
              text={t["Change Plan"]}
              position={isRTL ? "right" : "left"}
              onClick={() => (window.location.href = "/pricing")}
            />
          </div>
        ) : (
          <div
            style={{ border: "3px solid #00b0ff", borderRadius: "15px" }}
            className="p-6"
          >
            <h3
              style={{
                color: "#00b0ff",
              }}
              className="font-bold text-xl mb-2"
            >
              {t[data?.data?.profile?.lastSubscription?.plan?.slug]}{" "}
              {data?.data?.profile?.lastSubscription?.status === "ACTIVE" ? (
                <span
                  className={`font-semibold text-[#00c853] italic ${
                    isRTL ? "mr-2" : " ml-2"
                  }`}
                  style={{ fontSize: "15px" }}
                >
                  {t["Active"]}
                </span>
              ) : (
                <span
                  className={`font-semibold text-[red] italic ${
                    isRTL ? "mr-2" : " ml-2"
                  }`}
                  style={{ fontSize: "15px" }}
                >
                  {t["Not Active"]}
                </span>
              )}
            </h3>

            {data?.data?.profile?.lastSubscription?.status === "ACTIVE" ? (
              <p
                className="font-semibold text-md mb-2"
                style={{
                  color:
                    data?.data?.profile?.creditsBalance == 0
                      ? "red"
                      : "#00c853",
                }}
              >
                {data?.data?.profile?.creditsBalance}{" "}
                {t["credits remaining of"]}{" "}
                {data?.data?.profile?.lastSubscription?.plan?.creditsPerPeriod}
              </p>
            ) : (
              ""
            )}

            {/* temp if we may show criedts in all cases */}
            {/*<p
              className="font-semibold text-md mb-2"
              style={{
                color:
                  data?.data?.profile?.creditsBalance == 0 ? "red" : "#00c853",
              }}
            >
              {data?.data?.profile?.creditsBalance} {t["credits remaining of"]}{" "}
              {data?.data?.profile?.lastSubscription?.plan?.creditsPerPeriod}
            </p>*/}

            <p className="font-semibold text-lg">
              {t["Start:"]}{" "}
              <span
                className="font-semibold italic text-gray-700"
                style={{ fontSize: "15px" }}
              >
                {new Date(
                  data?.data?.profile?.lastSubscription?.currentPeriodStart
                ).toLocaleDateString(
                  localStorage.getItem("language").slice(0, 2).toLowerCase() ||
                    "en",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </p>
            <p className="mb-6 font-semibold text-lg">
              {t["End:"]}{" "}
              <span
                className="font-semibold italic text-gray-700"
                style={{ fontSize: "15px" }}
              >
                {new Date(
                  data?.data?.profile?.lastSubscription?.currentPeriodEnd
                ).toLocaleDateString(
                  localStorage.getItem("language").slice(0, 2).toLowerCase(),
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </p>
            <ReusableButton
              text={t["Change Plan"]}
              position={isRTL ? "right" : "left"}
              onClick={() => (window.location.href = "/pricing")}
            />
          </div>
        )}
      </div>
      <div className="">
        <div
          style={{
            borderBottom: "1px dashed rgba(186, 186, 186, 1)",
            paddingBottom: "25px",
            marginBottom: "35px",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: "500" }}>
            {t["Billing History"]}
          </h1>
        </div>
        {billings?.data?.items?.length === 0 ? (
          t["You haven't made any payments yet!"]
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
              {billings.data.items.slice(0, visibleCount).map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl p-6 flex flex-col justify-between"
                  style={{
                    backgroundColor: "rgb(250, 250, 250)",
                    border: "1px solid rgb(240, 240, 240)",
                  }}
                >
                  <div className="mb-4 text-gray-700">
                    <div className="flex gap-2 mb-1">
                      <FaRegCalendarCheck
                        className="text-lg"
                        style={{ color: "#00b0ff" }}
                      />
                      <p className="text-sm text-gray-400">{t["Date"]}</p>
                    </div>
                    <p className="font-semibold">
                      {new Date(item.date).toLocaleDateString(
                        (localStorage.getItem("language") || "en")
                          .slice(0, 2)
                          .toLowerCase(),
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="mb-5 text-gray-700">
                    <div className="flex gap-2 mb-1">
                      <IoWalletOutline
                        className="text-xl"
                        style={{ color: "#00b0ff" }}
                      />
                      <p className="text-sm text-gray-400">{t["AmountText"]}</p>
                    </div>
                    <p
                      className="font-semibold text-lg"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {item.amount.slice(1)} <span>$</span>
                    </p>
                  </div>

                  <a
                    href={item.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-1.5 text-white font-semibold py-2 px-4 rounded-lg transition"
                    style={{ background: "var(--gradient-color)" }}
                  >
                    {t["More Details"]}{" "}
                    <FiExternalLink
                      className={`${isRTL ? "rotate-270" : ""}`}
                    />
                  </a>
                </div>
              ))}
            </div>
            {billings.data.items.length > 4 && (
              <div className="flex gap-3 mt-6">
                {/* Show More */}
                <button
                  onClick={() =>
                    setVisibleCount((prev) =>
                      Math.min(prev + 4, billings.data.items.length)
                    )
                  }
                  disabled={visibleCount >= billings.data.items.length}
                  className={`justify-center flex items-center gap-2 px-4 py-2 text-white rounded-lg font-semibold transition flex-1 sm:flex-none ${
                    visibleCount >= billings.data.items.length
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100 cursor-pointer"
                  }
                  `}
                  style={{ background: "var(--gradient-color)" }}
                >
                  {t["More"]}
                  <BsArrowsFullscreen />
                </button>

                {/* Show Less */}
                <button
                  onClick={() => {
                    window.scrollBy({
                      top: -450,
                      behavior: "smooth",
                    });
                    setVisibleCount((prev) => Math.max(prev - 4, 4));
                  }}
                  disabled={visibleCount <= 4}
                  className={`justify-center flex items-center gap-2 px-4 py-2 text-white rounded-lg font-semibold transition flex-1 sm:flex-none ${
                    visibleCount <= 4
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100 cursor-pointer"
                  }`}
                  style={{ background: "var(--gradient-color-2)" }}
                >
                  {t["Less"]}
                  <AiOutlineFullscreenExit />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Subscriptions;
