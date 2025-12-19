import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";

const VerifyEmailPage = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const id = query.get("id");

  useEffect(() => {
    const verify = async () => {
      const res = await verifyEmail(token, id);

      if (res?.status === "success") {
        toast.success(res.message || "Email verified successfully!");
      } else {
        toast.error(res?.message || "Verification failed");
      }

      window.location.href = "/";
    };

    verify();
  }, [token, id, verifyEmail, navigate]);

  return <div style={{ padding: "2rem" }}>Verifying email...</div>;
};

export default VerifyEmailPage;
