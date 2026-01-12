import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthProvider";
import { LanguageContext } from "../../context/LanguageContext";
import { toast } from "react-toastify";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import ParticleCanvas from "../../components/ParticleCanvas";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const translations = { English, Arabic };

const LoginPopup = () => {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];
  const [showPassword, setShowPassword] = useState(false);

  const {
    isLoginPopupOpen,
    closeLoginPopup,
    loginWithGoogle,
    login,

    setIsPopupActionLoading,
    isPopupActionLoading,

    // Forgot Password Flow
    forgotPassScreen,
    setForgotPassScreen,
    forgotEmail,
    setForgotEmail,
    resetToken,
    setResetToken,

    forgotPassword,
    verifyResetCode,
    resetPassword,
  } = useAuth();

  // Local states
  const [renderLogWithGoogle, setRenderLogWithGoogle] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");

  // Clear inputs when popup opens
  useEffect(() => {
    if (isLoginPopupOpen) {
      setEmail("");
      setPassword("");
      setCode("");
      setNewPass("");
      setShowPassword(false);
    }
  }, [isLoginPopupOpen]);

  if (!isLoginPopupOpen) return null;

  // HANDLERS
  const handleEmailLogin = async () => {
    if (!email) {
      toast.error(t["Email is Required!"]);
      return;
    }
    if (!password) {
      toast.error(t["Password is Required!"]);
      return;
    }
    const res = await login(email, password);
    if (res?.status === "success") {
      setShowPassword(false);
    }
  };

  const handleForgotEmail = async () => {
    if (!forgotEmail) {
      toast.error(t["Email is Required!"]);
      return;
    }
    await forgotPassword(forgotEmail);
  };

  const handleVerifyCode = async () => {
    if (!code) {
      toast.error(t["Code is Required!"]);
      return;
    }
    if (code.length < 6) {
      toast.error(t["Invalid Code!"]);
      return;
    }

    await verifyResetCode(forgotEmail, code);
  };

  const handleResetPassword = async () => {
    if (!newPass) return toast.error(t["New password is Required!"]);
    const res = await resetPassword(resetToken, newPass);
    if (res?.status === "success") {
      setShowPassword(false);
    }
  };

  // RENDER SCREENS
  const renderScreen = () => {
    // SCREEN 1 — LOGIN
    if (forgotPassScreen === 1) {
      return (
        <>
          {renderLogWithGoogle ? (
            <div className="h-full flex items-end">
              <div className="h-[70%] flex flex-col justify-between w-full">
                <div className="flex flex-col items-center">
                  <div
                    onClick={loginWithGoogle}
                    style={{
                      padding: "10px",
                      width: "85%",
                      border: "1px solid rgba(215, 215, 215, 1)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "14px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "500",
                      marginBottom: "15px",
                      cursor: "pointer",
                    }}
                  >
                    <img src="/images/google-1.png" alt="google" />
                    <span>{t["Continue with Google"]}</span>
                  </div>
                  <p
                    onClick={() => setRenderLogWithGoogle(false)}
                    style={{
                      color: "rgba(0, 176, 255, 1)",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    {t["Or use email"]}
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  <p>{t["By continuing, you agree to our"]}</p>
                  <p>
                    <span
                      style={{
                        color: "rgba(0, 176, 255, 1)",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        (window.location.href = "/terms-of-service")
                      }
                    >
                      {t["Terms Of Service"]}
                    </span>{" "}
                    {t["and"]}{" "}
                    <span
                      style={{
                        color: "rgba(0, 176, 255, 1)",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        (window.location.href = "/terms-of-service")
                      }
                    >
                      {t["Privacy Policy"]}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label> {t["Email"]}</label>
              <input
                type="email"
                placeholder="your.example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => {
                  e.target.style.border = "2px solid #00b0ff";
                }}
                onBlur={(e) => {
                  e.target.style.border = "2px solid transparent";
                }}
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  backgroundColor: "rgba(245, 245, 245, 1)",
                  marginTop: "5px",
                  marginBottom: "12px",
                  borderRadius: "10px",
                  outline: "none",
                }}
              />
              <label> {t["Password"]}</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t["Enter password"]}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.border = "2px solid #00b0ff";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "2px solid transparent";
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(245, 245, 245, 1)",
                    marginTop: "5px",
                    marginBottom: "24px",
                    borderRadius: "10px",
                    outline: "none",
                  }}
                  className={`${
                    isRTL ? "pl-[60px] pr-5" : "pl-5 pr-[60px]"
                  } py-2.5`}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: isRTL ? "unset" : "18px",
                    left: isRTL ? "18px" : "unset",
                    top: "20%",
                    cursor: "pointer",
                    color: "#00b0ff",
                    fontSize: "24px",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                onClick={
                  isPopupActionLoading === true ? null : handleEmailLogin
                }
                disabled={isPopupActionLoading === true}
                style={{
                  cursor:
                    isPopupActionLoading === true ? "not-allowed" : "pointer",
                  opacity: isPopupActionLoading === true ? "0.5" : "1",
                  padding: "10px",
                  width: "100%",
                  background: "var(--gradient-color-2)",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "20px",
                  borderRadius: "10px",
                  marginBottom: "18px",
                }}
              >
                {isPopupActionLoading === true ? t["Loading ..."] : t["Login"]}
              </button>
              <button
                onClick={() => setForgotPassScreen(2)}
                style={{
                  color: "rgba(0, 176, 255, 1)",
                  marginBottom: "4px",
                  cursor: "pointer",
                }}
              >
                {t["Forgot Password?"]}
              </button>
              <p
                onClick={() => setRenderLogWithGoogle(true)}
                style={{ color: "rgba(0, 176, 255, 1)", cursor: "pointer" }}
              >
                {t["Back to Login with Google"]}
              </p>
            </div>
          )}
        </>
      );
    }

    // SCREEN 2 — ENTER EMAIL
    if (forgotPassScreen === 2) {
      return (
        <div>
          <h2
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginBottom: "24px",
            }}
          >
            {t["Forgot Password?"]}
          </h2>
          <p style={{ fontWeight: "600" }}>{t["Email"]}</p>
          <input
            type="email"
            placeholder="your.example@gmail.com"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            onFocus={(e) => {
              e.target.style.border = "2px solid #00b0ff";
            }}
            onBlur={(e) => {
              e.target.style.border = "2px solid transparent";
            }}
            style={{
              width: "100%",
              padding: "10px 20px",
              backgroundColor: "rgba(245, 245, 245, 1)",
              marginTop: "5px",
              marginBottom: "32px",
              borderRadius: "10px",
              outline: "none",
            }}
          />

          <button
            onClick={isPopupActionLoading === true ? null : handleForgotEmail}
            disabled={isPopupActionLoading === true}
            style={{
              cursor: isPopupActionLoading === true ? "not-allowed" : "pointer",
              opacity: isPopupActionLoading === true ? "0.5" : "1",
              padding: "10px",
              width: "100%",
              background: "var(--gradient-color-2)",
              color: "white",
              fontWeight: "600",
              fontSize: "20px",
              borderRadius: "10px",
              marginBottom: "65px",
            }}
          >
            {isPopupActionLoading === true
              ? t["Loading ..."]
              : t["Request Code"]}
          </button>
        </div>
      );
    }

    // SCREEN 3 — ENTER CODE
    if (forgotPassScreen === 3) {
      return (
        <div>
          <p style={{ fontWeight: "600" }}>{t["Code"]}</p>
          <input
            type="text"
            placeholder={t["6-digit code"]}
            value={code}
            maxLength={6}
            inputMode="numeric"
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setCode(onlyNumbers);
            }}
            onFocus={(e) => {
              e.target.style.border = "2px solid #00b0ff";
            }}
            onBlur={(e) => {
              e.target.style.border = "2px solid transparent";
            }}
            style={{
              width: "100%",
              padding: "10px 20px",
              backgroundColor: "rgba(245, 245, 245, 1)",
              marginTop: "5px",
              marginBottom: "38px",
              borderRadius: "10px",
              outline: "none",
            }}
          />

          <button
            onClick={isPopupActionLoading === true ? null : handleVerifyCode}
            style={{
              cursor: isPopupActionLoading === true ? "not-allowed" : "pointer",
              opacity: isPopupActionLoading === true ? "0.5" : "1",
              padding: "10px",
              width: "100%",
              background: "var(--gradient-color-2)",
              color: "white",
              fontWeight: "600",
              fontSize: "20px",
              borderRadius: "10px",
              marginBottom: "85px",
            }}
          >
            {isPopupActionLoading === true
              ? t["Loading ..."]
              : t["Verify Code"]}
          </button>
        </div>
      );
    }

    // SCREEN 4 — ENTER NEW PASSWORD
    if (forgotPassScreen === 4) {
      return (
        <div>
          <h2
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginBottom: "24px",
            }}
          >
            {t["Set New Password"]}
          </h2>
          <p style={{ fontWeight: "600" }}> {t["New Password"]}</p>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t["New Password"]}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              onFocus={(e) => {
                e.target.style.border = "2px solid #00b0ff";
              }}
              onBlur={(e) => {
                e.target.style.border = "2px solid transparent";
              }}
              style={{
                width: "100%",
                backgroundColor: "rgba(245, 245, 245, 1)",
                marginTop: "5px",
                marginBottom: "32px",
                borderRadius: "10px",
                outline: "none",
              }}
              className={`${
                isRTL ? "pl-[60px] pr-5" : "pl-5 pr-[60px]"
              } py-2.5`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: isRTL ? "unset" : "18px",
                left: isRTL ? "18px" : "unset",
                top: "19%",
                cursor: "pointer",
                color: "#00b0ff",
                fontSize: "24px",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            onClick={isPopupActionLoading === true ? null : handleResetPassword}
            disabled={isPopupActionLoading === true}
            style={{
              cursor: isPopupActionLoading === true ? "not-allowed" : "pointer",
              opacity: isPopupActionLoading === true ? "0.5" : "1",
              padding: "10px",
              width: "100%",
              background: "var(--gradient-color-2)",
              color: "white",
              fontWeight: "600",
              fontSize: "20px",
              borderRadius: "10px",
              marginBottom: "70px",
            }}
          >
            {isPopupActionLoading === true
              ? t["Loading ..."]
              : t["Reset Password"]}
          </button>
        </div>
      );
    }
  };

  return (
    <div style={{ position: "relative" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
        className="bg-black/65 backdrop-blur-xs excluded"
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
        className="max-w-[1250px] lg:w-[75%] w-[80%] relative"
      >
        <img
          src="/images/close.png"
          onClick={() => {
            if (isPopupActionLoading === true) return;
            setIsPopupActionLoading(false);
            setRenderLogWithGoogle(true);
            closeLoginPopup();
          }}
          style={{
            position: "absolute",
            top: "-25px",
            cursor: isPopupActionLoading === true ? "not-allowed" : "pointer",
            zIndex: 2000,
            width: "65px",
          }}
          className={`${isRTL ? "-left-5" : "-right-5"}`}
        />

        <div
          style={{
            borderRadius: "40px",
            height: "500px",
            overflow: "hidden",
          }}
          className="flex bg-white"
        >
          <div
            style={{
              backgroundImage: "url('/images/login.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "50%",
              height: "100%",
            }}
            className="w-[50%] lg:block hidden"
          ></div>

          <div className="lg:w-[50%] w-full py-10 px-8 md:px-17 flex flex-col justify-between relative">
            <div className="text-center">
              <h2 style={{ fontSize: "40px", fontWeight: "700" }}>
                {t["Hi there!"]}
              </h2>
              <p style={{ fontWeight: "500", lineHeight: "1.2" }}>
                {t["Welcome to Picsharps, so happy to see you."]}
              </p>
            </div>
            {renderScreen()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
