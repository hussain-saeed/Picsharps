import {  useState } from "react";
import { useAuth } from "../../auth/AuthProvider";

function Edit() {
  const { setPassword, userData } = useAuth();

  const [password, setPasswordInput] = useState("");

  const handleSetPassword = async () => {
    if (!password) return alert("Enter a password");

    const res = await setPassword(password);

    if (res?.status === "success") {
      alert("Password set successfully!");
      setPasswordInput("");
    } else {
      alert(res?.message || "Failed to set password");
    }
  };

  return (
    <div>
      <span style={{ fontWeight: "600" }}>Email</span>
      <div
        style={{
          backgroundColor: "rgba(235, 235, 235, 1)",
          borderRadius: "10px",
          marginTop: "8px",
          fontSize: "14px",
          cursor: "not-allowed",
        }}
        className="w-full lg:w-[75%] py-3 px-4 md:py-5 md:px-7 flex items-center justify-between mb-5"
      >
        <span>{(userData?.email || "").replace(/(.{20})/g, "$1\n")}</span>
        <img
          src="/images/google-1.png"
          alt="google"
          className="hidden md:block"
        />
      </div>

      <span style={{ fontWeight: "600" }}>Name</span>
      <div
        style={{
          backgroundColor: "rgba(235, 235, 235, 1)",
          borderRadius: "10px",
          marginTop: "8px",
          fontSize: "14px",
          cursor: "not-allowed",
        }}
        className="w-full lg:w-[75%] py-3 px-4 md:py-5 md:px-7 mb-5"
      >
        {(userData?.name || "").replace(/(.{20})/g, "$1\n")}{" "}
      </div>

      <span style={{ fontWeight: "600" }}>Set Password</span>
      <div
        style={{ marginTop: "8px" }}
        className="w-full lg:w-[75%] flex gap-2 lg:gap-5 flex-wrap flex-col lg:flex-row lg:items-end items-start"
      >
        <input
          type="password"
          placeholder="must have 8+ chars & one uppercase & one digit"
          value={password}
          onChange={(e) => setPasswordInput(e.target.value)}
          style={{
            flex: "1",
            backgroundColor: "rgba(235, 235, 235, 1)",
            borderRadius: "10px",
            fontSize: "14px",
          }}
          className="py-3 px-4 md:py-5 md:px-7 w-full"
        />

        <button
          onClick={handleSetPassword}
          style={{ background: "var(--gradient-color-2)" }}
          className="text-white py-1.5 px-3 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default Edit;
