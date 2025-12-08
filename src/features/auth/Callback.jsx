import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // هنا مثلاً تعمل call للـ backend علشان تجيب التوكن
    // وبعدها تعمل redirect
    navigate("/", { replace: true });
  }, []);

  return null; // أو loading spinner
}
