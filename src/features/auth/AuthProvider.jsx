import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = "https://picsharps-api.onrender.com";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ============================================
  // 1) Basic Auth State
  // ============================================
  const [user, setUser] = useState(null); // لو عايز تلغي دا لاحقًا قولّي
  const [userData, setUserData] = useState(null); // 👈 الجديد
  const [accessToken, setAccessToken] = useState(null);
  const [isLoadingLoggedIn, setIsLoadingLoggedIn] = useState(true);

  // ============================================
  // 2) Token Management (refresh token)
  // ============================================
  const refreshToken = async () => {
    setIsLoadingLoggedIn(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      const data = await res.json();
      console.log(data);

      if (data.status === "success") {
        setAccessToken(data.accessToken);

        // القديم
        setUser(data.data?.user || user);

        // الجديد
        setUserData(data.data?.user || null);
      } else {
        setUser(null);
        setUserData(null);
        setAccessToken(null);
      }
    } catch (err) {
      console.error("Refresh token error:", err);
      setUser(null);
      setUserData(null);
      setAccessToken(null);
    } finally {
      setIsLoadingLoggedIn(false);
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

  // ============================================
  // 3) Login Required + Popup Controls
  // ============================================
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
    setForgotPassScreen(1);

    // نفرّغ كل البيانات
    setForgotEmail("");
    setResetToken(null);
  };

  const requireLogin = (actionIfLoggedIn) => {
    if (userData) actionIfLoggedIn?.(); // نستعمل userData بدل user
    else openLoginPopup();
  };

  // ============================================
  // 4) Google Login
  // ============================================
  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/api/v1/auth/google`;
  };

  // ============================================
  // 5) Email & Password Login
  // ============================================
  const login = async (email, password) => {
    setIsLoadingLoggedIn(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (data.status === "success") {
        setAccessToken(data.accessToken);

        // القديم
        setUser(data.data.user);

        // الجديد
        setUserData(data.data.user);
      }

      return data;
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoadingLoggedIn(false);
    }
  };

  const [forgotPassScreen, setForgotPassScreen] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const forgotPassword = async (email) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
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
      const res = await fetch(`${API_URL}/api/v1/auth/verify-reset-code`, {
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
      const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
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
      const res = await fetch(`${API_URL}/api/v1/auth/change-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ newEmail }),
      });

      const data = await res.json();
      console.log(data);

      return data;
    } catch (err) {
      console.error("Change email error:", err);
    }
  };

  const verifyEmail = async (token, id) => {
    if (!token || !id)
      return { status: "fail", message: "Invalid verification link" };

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, id }),
      });

      const data = await res.json();
      console.log("Verify email response:", data);
      return data;
    } catch (err) {
      console.error("Verify email error:", err);
      return { status: "error", message: "Network error" };
    }
  };

  const setPassword = async (newPassword) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      console.log(data);

      return data;
    } catch (err) {
      console.error("Set password error:", err);
    }
  };

  // ============================================
  // 6) Logout
  // ============================================
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setUserData(null);
      setAccessToken(null);
      window.location.href = "/";
    }
  };

  // ============================================
  // Provider
  // ============================================
  return (
    <AuthContext.Provider
      value={{
        user, // القديم
        userData, // 👈 الجديد
        accessToken,
        isLoadingLoggedIn,

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

// ============================================
// Hook
// ============================================
export const useAuth = () => useContext(AuthContext);
