import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthProvider";
import { LanguageContext } from "../../context/LanguageContext";
import { toast } from "react-toastify";

const LoginPopup = () => {
  const {
    isLoginPopupOpen,
    closeLoginPopup,
    loginWithGoogle,
    login,

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
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

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
    }
  }, [isLoginPopupOpen]);

  if (!isLoginPopupOpen) return null;

  // HANDLERS
  const handleEmailLogin = async () => {
    if (!email || !password) return alert("Please enter email and password");

    const data = await login(email, password);
    if (data?.status === "success") {
      closeLoginPopup();
    } else {
      toast.error(data?.message || "Login failed");
    }
  };

  const handleForgotEmail = async () => {
    if (!forgotEmail) return alert("Enter your email");

    const res = await forgotPassword(forgotEmail);

    if (res?.status === "success") {
      toast.success("Code sent to your email");
      setForgotPassScreen(3);
    } else {
      toast.error(res?.message || "Something went wrong");
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return alert("Enter the code");

    const res = await verifyResetCode(forgotEmail, code);

    if (res?.status === "success") {
      setResetToken(res.data.resetToken);
      setForgotPassScreen(4);
    } else {
      toast.error(res?.message || "Invalid or expired code");
    }
  };

  const handleResetPassword = async () => {
    if (!newPass) return toast.error("Enter a new password");

    const res = await resetPassword(resetToken, newPass);

    if (res?.status === "success") {
      toast.success("Password reset successfully!");

      // Back to first screen
      setForgotPassScreen(1);
    } else {
      toast.error(res?.message || "Failed to reset password");
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
                    <span> Continue with Google</span>
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
                    Or use email
                  </p>
                </div>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  By continuing, you agree to our{" "}
                  <span
                    style={{ color: "rgba(0, 176, 255, 1)", cursor: "pointer" }}
                  >
                    Terms Of Service
                  </span>{" "}
                  and{" "}
                  <span
                    style={{ color: "rgba(0, 176, 255, 1)", cursor: "pointer" }}
                  >
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          ) : (
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="your.example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  backgroundColor: "rgba(245, 245, 245, 1)",
                  marginTop: "5px",
                  marginBottom: "12px",
                  borderRadius: "10px",
                }}
              />
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  backgroundColor: "rgba(245, 245, 245, 1)",
                  marginTop: "5px",
                  marginBottom: "24px",
                  borderRadius: "10px",
                }}
              />
              <button
                onClick={handleEmailLogin}
                style={{
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
                Login
              </button>
              <button
                onClick={() => setForgotPassScreen(2)}
                style={{
                  color: "rgba(0, 176, 255, 1)",
                  marginBottom: "4px",
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </button>
              <p
                onClick={() => setRenderLogWithGoogle(true)}
                style={{ color: "rgba(0, 176, 255, 1)", cursor: "pointer" }}
              >
                Back to Login with Google
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
            Forgot Password ?
          </h2>
          <p style={{ fontWeight: "600" }}>Email</p>
          <input
            type="email"
            placeholder="your.example@gmail.com"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 20px",
              backgroundColor: "rgba(245, 245, 245, 1)",
              marginTop: "5px",
              marginBottom: "32px",
              borderRadius: "10px",
            }}
          />

          <button
            onClick={handleForgotEmail}
            style={{
              padding: "10px",
              width: "100%",
              background: "var(--gradient-color-2)",
              color: "white",
              fontWeight: "600",
              fontSize: "20px",
              borderRadius: "10px",
              marginBottom: "65px",
              cursor: "pointer",
            }}
          >
            Request code{" "}
          </button>
        </div>
      );
    }

    // SCREEN 3 — ENTER CODE
    if (forgotPassScreen === 3) {
      return (
        <div>
          <p style={{ fontWeight: "600" }}>Code</p>
          <input
            type="text"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 20px",
              backgroundColor: "rgba(245, 245, 245, 1)",
              marginTop: "5px",
              marginBottom: "38px",
              borderRadius: "10px",
            }}
          />

          <button
            onClick={handleVerifyCode}
            style={{
              padding: "10px",
              width: "100%",
              background: "var(--gradient-color-2)",
              color: "white",
              fontWeight: "600",
              fontSize: "20px",
              borderRadius: "10px",
              marginBottom: "85px",
              cursor: "pointer",
            }}
          >
            Verify Code
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
            Set New Password
          </h2>
          <p style={{ fontWeight: "600" }}>New Password</p>
          <input
            type="password"
            placeholder="New password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 20px",
              backgroundColor: "rgba(245, 245, 245, 1)",
              marginTop: "5px",
              marginBottom: "32px",
              borderRadius: "10px",
            }}
          />

          <button
            onClick={handleResetPassword}
            style={{
              padding: "10px",
              width: "100%",
              background: "var(--gradient-color-2)",
              color: "white",
              fontWeight: "600",
              fontSize: "20px",
              borderRadius: "10px",
              marginBottom: "70px",
              cursor: "pointer",
            }}
          >
            Reset Password
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
        className="max-w-[1200px] lg:w-[75%] w-[80%] relative"
      >
        <img
          src="/images/close.png"
          onClick={() => {
            setRenderLogWithGoogle(true);
            closeLoginPopup();
          }}
          style={{
            position: "absolute",
            top: "-25px",
            cursor: "pointer",
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

          <div className="lg:w-[50%] w-full py-10 px-8 md:px-17 flex flex-col justify-between">
            <div className="text-center">
              <h2 style={{ fontSize: "40px", fontWeight: "700" }}>
                Hi there !
              </h2>
              <p style={{ fontWeight: "500", lineHeight: "1.2" }}>
                Welcome to picsharps, so happy to see you
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
