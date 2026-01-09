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
        {data?.data?.profile?.lastSubscription === null ? (
          // free plan case
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
              {data?.data?.profile?.creditsBalance} {t["Credits of"]} 100
            </p>
            <ReusableButton
              text={t["Change Plan"]}
              position={isRTL ? "right" : "left"}
              onClick={() => (window.location.href = "/pricing")}
            />
          </div>
        ) : (
          ""
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
