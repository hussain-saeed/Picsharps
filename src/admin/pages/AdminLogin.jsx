import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminLogin() {
  const { loginAdmin } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return toast.error("Email is required!");
    if (!password) return toast.error("Password is required!");

    setLoading(true);

    try {
      const success = await loginAdmin({ email, password });
      if (!success) setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Admin Login
        </h1>

        {/* Email */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>

        <input
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full
            rounded-xl
            bg-gray-100
            px-4
            py-2.5
            outline-none
            border
            border-transparent
            focus:border-blue-500
            transition
            mb-4
          "
        />

        {/* Password */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              rounded-xl
              bg-gray-100
              px-4
              py-2.5
              outline-none
              border
              border-transparent
              focus:border-blue-500
              transition
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-blue-500
              text-lg
            "
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={loading ? null : handleSubmit}
          disabled={loading}
          className={`
            w-full
            rounded-xl
            py-3
            font-semibold
            text-white
            bg-blue-600
            hover:bg-blue-700
            transition
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
