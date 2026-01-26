import React, { useEffect, useMemo, useState } from "react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../features/core/adminCoreApi";
import { toast } from "react-toastify";

function Settings() {
  // ================= QUERIES =================
  const { data, isFetching, isError } = useGetSettingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  // ================= STATE =================
  const [formData, setFormData] = useState({
    siteName: "",
    emailSupport: "",
    companyName: "",
  });
  const [originalFormData, setOriginalFormData] = useState(null);

  // ================= DERIVED =================
  const hasData = data?.status === "success" && data.data?.settings;
  const settings = hasData ? data.data.settings : null;

  // detect dirty
  const isDirty = useMemo(() => {
    if (!originalFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  }, [formData, originalFormData]);

  // ================= EFFECTS =================
  useEffect(() => {
    if (hasData) {
      setFormData(settings);
      setOriginalFormData(settings);
    }
  }, [hasData, settings]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await updateSettings({ body: formData }).unwrap();
      if (res.status === "success") {
        toast.success("Settings updated successfully");
        setOriginalFormData(formData); // reset dirty
      } else {
        toast.error("Failed to update settings");
      }
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  const handleDiscard = () => {
    if (originalFormData) setFormData(originalFormData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "20px" }}>
        System Settings
      </h1>

      {/* Loading / Error */}
      {isFetching && <div>Loading settings...</div>}
      {isError && <div>Error fetching settings</div>}
      {!isFetching && !isError && !hasData && (
        <div>Error fetching settings</div>
      )}

      {/* Form */}
      {!isFetching && hasData && (
        <form
          style={{
            maxWidth: "500px",
            padding: "24px",
            borderRadius: "14px",
            background: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,.05)",
          }}
        >
          {/* Site Name */}
          <div style={{ marginBottom: "12px" }}>
            <label>Site Name</label>
            <input
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Support Email */}
          <div style={{ marginBottom: "12px" }}>
            <label>Support Email</label>
            <input
              name="emailSupport"
              value={formData.emailSupport}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Company Name */}
          <div style={{ marginBottom: "12px" }}>
            <label>Company Name</label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginTop: "6px",
              }}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
            <button
              type="button"
              disabled={!isDirty || isSaving}
              onClick={handleSave}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                background: !isDirty || isSaving ? "#d1d5db" : "#16a34a",
                color: "#fff",
                fontWeight: 600,
                cursor: !isDirty || isSaving ? "not-allowed" : "pointer",
              }}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              disabled={!isDirty || isSaving}
              onClick={handleDiscard}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: 500,
                cursor: !isDirty || isSaving ? "not-allowed" : "pointer",
                opacity: !isDirty || isSaving ? 0.6 : 1,
                transition: "0.2s",
              }}
            >
              Discard
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Settings;
