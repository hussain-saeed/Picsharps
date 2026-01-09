import React, { createContext, useContext, useState, useEffect } from "react";
import { BACKEND_URL } from "../../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1) Basic Auth State
  const [userData, setUserData] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

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
        console.log(data);
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
      }

      return data;
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const [forgotPassScreen, setForgotPassScreen] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const forgotPassword = async (email) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Forgot Password Error:", err);
    }
  };

  const verifyResetCode = async (email, code) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Verify Reset Code Error:", err);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: token, newPassword }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Reset Password Error:", err);
    }
  };

  const changeEmail = async (newEmail) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/change-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ newEmail }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error("Change email error:", err);
    }
  };

  const verifyEmail = async (token, id) => {
    if (!token || !id)
      return { status: "fail", message: "Invalid verification link" };

    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, id }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Verify email error:", err);
      return { status: "error", message: "Network error" };
    }
  };

  const setPassword = async (newPassword) => {
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

      return data;
    } catch (err) {
      console.error("Set password error:", err);
    }
  };

  // 6) Logout
  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUserData(null);
      setAccessToken(null);
      window.location.href = "/";
    }
  };

  // Provider
  return (
    <AuthContext.Provider
      value={{
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

        changeEmail,
        verifyEmail,

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
