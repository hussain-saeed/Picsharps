import { useContext, useState } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import { useAuth } from "../../auth/AuthProvider";
import { toast } from "react-toastify";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const translations = { English, Arabic };

function Edit() {
  const { language, direction } = useContext(LanguageContext);
  const t = translations[language] || translations["English"];
  const isRTL = direction === "rtl";
  const { setPassword, userData, isPopupActionLoading } = useAuth();
  const [password, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSetPassword = async () => {
    if (!password) return toast.error(t["New password is Required!"]);

    const res = await setPassword(password);
    if (res?.status === "success") {
      setPasswordInput("");
    }
  };

  return (
    <div>
      <span style={{ fontWeight: "600" }}>{t["Email"]}</span>
      <div
        style={{
          backgroundColor: "rgba(235, 235, 235, 1)",
          borderRadius: "10px",
          marginTop: "8px",
          fontSize: "14px",
          cursor: "not-allowed",
        }}
        className="w-full lg:w-[75%] py-3 px-4 md:py-5 md:px-7 flex items-center justify-between mb-5"
      >
        <span>{(userData?.email || "").replace(/(.{20})/g, "$1\n")}</span>
        <img
          src="/images/google-1.png"
          alt="google"
          className="hidden md:block"
        />
      </div>

      <span style={{ fontWeight: "600" }}>{t["Name"]}</span>
      <div
        style={{
          backgroundColor: "rgba(235, 235, 235, 1)",
          borderRadius: "10px",
          marginTop: "8px",
          fontSize: "14px",
          cursor: "not-allowed",
        }}
        className="w-full lg:w-[75%] py-3 px-4 md:py-5 md:px-7 mb-5"
      >
        {(userData?.name || "").replace(/(.{20})/g, "$1\n")}{" "}
      </div>

      <span style={{ fontWeight: "600" }}>{t["Set Password"]}</span>
      <div
        style={{ marginTop: "8px" }}
        className="w-full lg:w-[75%] flex gap-2 lg:gap-5 flex-wrap flex-col lg:flex-row lg:items-end items-start"
      >
        <div className="relative flex-1 w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t["New Password"]}
            value={password}
            maxLength="30"
            onChange={(e) => setPasswordInput(e.target.value)}
            onFocus={(e) => {
              e.target.style.border = "2px solid #00b0ff";
            }}
            onBlur={(e) => {
              e.target.style.border = "2px solid transparent";
            }}
            style={{
              flex: "1",
              backgroundColor: "rgba(235, 235, 235, 1)",
              borderRadius: "10px",
              fontSize: "14px",
              outline: "none",
            }}
            className="py-3 px-4 md:py-5 md:px-7 w-full"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: isRTL ? "unset" : "18px",
              left: isRTL ? "18px" : "unset",
              top: "30%",
              cursor: "pointer",
              color: "#00b0ff",
              fontSize: "24px",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          onClick={isPopupActionLoading === true ? null : handleSetPassword}
          disabled={isPopupActionLoading === true}
          style={{
            background: "var(--gradient-color-2)",
            cursor: isPopupActionLoading === true ? "not-allowed" : "pointer",
            opacity: isPopupActionLoading === true ? "0.5" : "1",
          }}
          className="text-white py-1.5 px-3 rounded-lg"
        >
          {isPopupActionLoading === true ? t["Loading ..."] : t["Confirm"]}
        </button>
      </div>
    </div>
  );
}

export default Edit;
