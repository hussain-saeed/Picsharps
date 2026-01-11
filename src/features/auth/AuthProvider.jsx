import React, { createContext, useContext, useState, useEffect } from "react";
import { BACKEND_URL } from "../../api";
import { toast } from "react-toastify";
import { LanguageContext } from "/src/context/LanguageContext";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";

const translations = { English, Arabic };

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  // 1) Basic Auth State
  const [userData, setUserData] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [isPopupActionLoading, setIsPopupActionLoading] = useState(false);

  // 2) Token Management (refresh token)
  const refreshToken = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (data.status === "success") {
        setAccessToken(data.accessToken);
        setUserData(data.data?.user || null);
        console.log("refresh", data);
      } else {
        setUserData(null);
        setAccessToken(null);
      }
    } catch (err) {
      console.error("Refresh token error:", err);
      setUserData(null);
      setAccessToken(null);
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Initial login-check on first load
  useEffect(() => {
    refreshToken();
  }, []);

  // Auto token refresh every 10 min
  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // 3) Login Required + Popup Controls
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
    setForgotPassScreen(1);

    setForgotEmail("");
    setResetToken(null);
  };

  const requireLogin = (actionIfLoggedIn) => {
    if (userData) actionIfLoggedIn?.();
    else openLoginPopup();
  };

  // 4) Google Login
  const loginWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // 5) Email & Password Login
  const login = async (email, password) => {
    setIsPopupActionLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setAccessToken(data.accessToken);
        setUserData(data.data.user);
        window.location.reload();
        return;
      }

      if (data.status === "fail") {
        if (data.message.includes("Invalid email address")) {
          toast.error(t["Invalid Email Address!"]);
          setIsPopupActionLoading(false);
          return;
        }

        if (
          data.message.includes("Password") ||
          data.message.includes("Invalid credentials")
        ) {
          toast.error(t["Invalid Credentials!"]);
          setIsPopupActionLoading(false);
          return;
        }
      }

      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    } catch (err) {
      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    }
  };

  const [forgotPassScreen, setForgotPassScreen] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const forgotPassword = async (email) => {
    setIsPopupActionLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success(t["Code sent to your email!"]);
        setForgotPassScreen(3);
        setIsPopupActionLoading(false);
        return;
      }

      if (
        data.status === "fail" &&
        data.message.includes("Invalid email address")
      ) {
        toast.error(t["Invalid Email Address!"]);
        setIsPopupActionLoading(false);
        return;
      }
      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    } catch (err) {
      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    }
  };

  const verifyResetCode = async (email, code) => {
    setIsPopupActionLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setResetToken(data.data.resetToken);
        setForgotPassScreen(4);
        setIsPopupActionLoading(false);
        return;
      }

      if (data.status === "fail") {
        if (
          data.message.includes("Invalid code") ||
          data.message.includes("Code expired")
        ) {
          toast.error(t["Invalid or expired code!"]);
          setIsPopupActionLoading(false);
          return;
        }
      }
      console.log(data);
      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setIsPopupActionLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: token, newPassword }),
      });

      const data = await res.json();
      if (data.status === "success") {
        toast.success(t["Password reset successfully!"]);
        setForgotPassScreen(1);
        setIsPopupActionLoading(false);
        return;
      }

      if (data.status === "fail" && data.message.includes("Password")) {
        toast.error(
          t[
            "Password must be 8+ chars with upper, lower case letters, and at least one number!"
          ]
        );
        setIsPopupActionLoading(false);
        return;
      }
      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    } catch (err) {
      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    }
  };

  const setPassword = async (newPassword) => {
    setIsPopupActionLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success(t["Password reset successfully!"]);
        setIsPopupActionLoading(false);
        return data;
      }

      if (data.status === "fail" && data.message.includes("Password")) {
        toast.error(
          t[
            "Password must be 8+ chars with upper, lower case letters, and at least one number!"
          ]
        );
        setIsPopupActionLoading(false);
        return;
      }

      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    } catch (err) {
      toast.error(t["Something Went Wrong!"]);
      setIsPopupActionLoading(false);
    }
  };

  // 6) Logout
  const logout = async () => {
    setIsPopupActionLoading(true);

    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } finally {
      setIsPopupActionLoading(false);
      setUserData(null);
      setAccessToken(null);
      window.location.href = "/";
    }
  };

  // Provider
  return (
    <AuthContext.Provider
      value={{
        setIsPopupActionLoading,
        isPopupActionLoading,

        userData,
        isLoadingUserData,
        accessToken,

        // Token
        refreshToken,

        // Utilities
        isLoginPopupOpen,
        openLoginPopup,
        closeLoginPopup,
        requireLogin,

        // Login methods
        loginWithGoogle,
        login,

        forgotPassScreen,
        setForgotPassScreen,
        forgotEmail,
        setForgotEmail,
        resetToken,
        setResetToken,

        forgotPassword,
        verifyResetCode,
        resetPassword,

        setPassword,

        // Logout
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
