import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";

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

  // Local states
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

  // HANDLERS -----------------------------------------------------

  const handleEmailLogin = async () => {
    if (!email || !password) return alert("Please enter email and password");

    const data = await login(email, password);
    if (data?.status === "success") {
      alert("Login successful!");
      closeLoginPopup();
    } else {
      alert(data?.message || "Login failed");
    }
  };

  const handleForgotEmail = async () => {
    if (!forgotEmail) return alert("Enter your email");

    const res = await forgotPassword(forgotEmail);

    if (res?.status === "success") {
      alert("Code sent to your email");
      setForgotPassScreen(3);
    } else {
      alert(res?.message || "Something went wrong");
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return alert("Enter the code");

    const res = await verifyResetCode(forgotEmail, code);

    if (res?.status === "success") {
      setResetToken(res.data.resetToken);
      setForgotPassScreen(4);
    } else {
      alert(res?.message || "Invalid or expired code");
    }
  };

  const handleResetPassword = async () => {
    if (!newPass) return alert("Enter a new password");

    const res = await resetPassword(resetToken, newPass);

    if (res?.status === "success") {
      alert("Password reset successfully!");

      // Back to first screen
      setForgotPassScreen(1);
    } else {
      alert(res?.message || "Failed to reset password");
    }
  };

  // RENDER SCREENS -----------------------------------------------------

  const renderScreen = () => {
    // SCREEN 1 — LOGIN
    if (forgotPassScreen === 1) {
      return (
        <>
          <h2>Please log in</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />

          <button
            onClick={handleEmailLogin}
            style={{ marginTop: "1rem", padding: "0.5rem", width: "100%" }}
          >
            Login
          </button>

          <button
            onClick={() => setForgotPassScreen(2)}
            style={{
              marginTop: "1rem",
              padding: "0.5rem",
              width: "100%",
              background: "#eee",
            }}
          >
            Forgot Password?
          </button>

          <hr style={{ margin: "1rem 0" }} />

          <button
            onClick={loginWithGoogle}
            style={{ padding: "0.5rem", width: "100%" }}
          >
            Login with Google
          </button>
        </>
      );
    }

    // SCREEN 2 — ENTER EMAIL
    if (forgotPassScreen === 2) {
      return (
        <>
          <h2>Reset Password</h2>
          <p>Enter your email</p>

          <input
            type="email"
            placeholder="Email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}
          />

          <button
            onClick={handleForgotEmail}
            style={{ marginTop: "1rem", width: "100%", padding: "0.5rem" }}
          >
            Send Code
          </button>
        </>
      );
    }

    // SCREEN 3 — ENTER CODE
    if (forgotPassScreen === 3) {
      return (
        <>
          <h2>Enter Verification Code</h2>

          <input
            type="text"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}
          />

          <button
            onClick={handleVerifyCode}
            style={{ marginTop: "1rem", width: "100%", padding: "0.5rem" }}
          >
            Verify Code
          </button>
        </>
      );
    }

    // SCREEN 4 — ENTER NEW PASSWORD
    if (forgotPassScreen === 4) {
      return (
        <>
          <h2>Set New Password</h2>

          <input
            type="password"
            placeholder="New password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}
          />

          <button
            onClick={handleResetPassword}
            style={{ marginTop: "1rem", width: "100%", padding: "0.5rem" }}
          >
            Reset Password
          </button>
        </>
      );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          textAlign: "center",
          width: "320px",
        }}
      >
        {renderScreen()}

        <button
          onClick={closeLoginPopup}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem",
            width: "100%",
            backgroundColor: "#eee",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
