import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import ProtectedRoute from "../auth/ProtectedRoute";

function Profile() {
  const { setPassword, logout, userData, changeEmail } = useAuth();

  const [password, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState(userData?.email || "");
  const [isEditing, setIsEditing] = useState(false);

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

  // لو userData اتغير (login/logout)
  useEffect(() => {
    setEmailInput(userData?.email || "");
  }, [userData]);

  // زر Edit
  const handleEditClick = () => {
    setEmailInput(""); // خلي input فاضي للتحرير
    setIsEditing(true);
  };

  // زر Cancel
  const handleCancelClick = () => {
    setEmailInput(userData?.email || "");
    setIsEditing(false);
  };

  // زر OK
  const handleOkClick = async () => {
    const res = await changeEmail(emailInput);

    // لو success بس نعرض الايميل الجديد تحت الانبوت
    if (res?.status === "success") {
      alert(res.message); // "Please check your new email..."
      window.location.href = "/";
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ padding: "1rem", width: "300px" }}>
        <label>Current Email:</label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            readOnly={!isEditing}
            placeholder="Email"
            style={{ flex: 1, padding: "0.5rem" }}
          />

          {!isEditing && (
            <button
              onClick={handleEditClick}
              style={{ padding: "0.3rem 0.5rem" }}
            >
              Edit
            </button>
          )}
        </div>

        {isEditing && (
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleOkClick}
              style={{ padding: "0.3rem 0.5rem" }}
            >
              OK
            </button>
            <button
              onClick={handleCancelClick}
              style={{ padding: "0.3rem 0.5rem" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div
        style={{ padding: "1rem", width: "250px", backgroundColor: "yellow" }}
      >
        <h3>Set Password</h3>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPasswordInput(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
        />

        <button
          onClick={handleSetPassword}
          style={{ marginTop: "1rem", width: "100%", padding: "0.5rem" }}
        >
          Set Password
        </button>
      </div>

      <button style={{ backgroundColor: "red" }} onClick={() => logout()}>
        logout
      </button>
    </ProtectedRoute>
  );
}

export default Profile;
