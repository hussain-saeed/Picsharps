import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      localStorage.setItem("comesFromSuccess", true);
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  return null;
}
