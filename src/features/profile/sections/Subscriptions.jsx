import ReusableButton from "/src/components/ReusableButton";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import { useContext } from "react";
import { LanguageContext } from "/src/context/LanguageContext";

const translations = { English, Arabic };

function Subscriptions({ data, billings }) {
  const { language, direction } = useContext(LanguageContext);
  const t = translations[language] || translations["English"];
  const isRTL = direction === "rtl";

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
                  className="font-semibold text-[red] italic"
                  style={{ fontSize: "15px" }}
                >
                  {t["Not Active"]}
                </span>
              )}
            </h3>
            <p
              className="font-semibold text-md mb-2"
              style={{
                color:
                  data?.data?.profile?.creditsBalance == 0 ? "red" : "#00c853",
              }}
            >
              {data?.data?.profile?.creditsBalance} {t["credits remaining of"]}{" "}
              {data?.data?.profile?.lastSubscription?.plan?.creditsPerPeriod}
            </p>
            <p className="font-semibold text-lg">
              {t["Start:"]}{" "}
              <span
                className="font-semibold italic text-gray-700"
                style={{ fontSize: "15px" }}
              >
                {new Date(
                  data?.data?.profile?.lastSubscription?.currentPeriodStart
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
            marginBottom: "25px",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: "500" }}>
            {t["Billing History"]}
          </h1>
        </div>
        {billings?.data?.items?.length === 0
          ? t["You haven't made any payments yet!"]
          : ""}
      </div>
    </div>
  );
}

export default Subscriptions;
