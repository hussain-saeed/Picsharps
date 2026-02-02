import React, { useEffect, useMemo, useState } from "react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../features/core/adminCoreApi";
import { toast } from "react-toastify";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineSave } from "react-icons/ai";

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
        toast.success("Settings updated successfully!");
        setOriginalFormData(formData); // reset dirty
      } else {
        toast.error("Failed to update settings!");
      }
    } catch (err) {
      toast.error("Failed to update settings!");
    }
  };

  const handleDiscard = () => {
    if (originalFormData) setFormData(originalFormData);
  };

  return (
    <div
      style={{ padding: "30px", border: "1px solid rgba(228, 228, 228, 1)" }}
      className="bg-white w-full lg:max-w-[700px] rounded-2xl shadow-xl"
    >
      <div className="mb-10">
        <h2 className="text-xl font-semibold ">General Settings</h2>
        <p className="text-gray-500">
          Manage your application's basic information and preferences
        </p>
      </div>

      {/* Loading / Error */}
      {isFetching && <div>Loading settings...</div>}
      {isError && <div>Error fetching settings</div>}
      {!isFetching && !isError && !hasData && (
        <div>Error fetching settings</div>
      )}
      {/* Form */}
      {!isFetching && hasData && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-6 flex-col md:flex-row mb-6">
            <div className="w-full md:w-[50%]">
              <label className="font-semibold block mb-2 text-[#374151]">
                Site Name
              </label>
              <input
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                className="w-full bg-[#F0F0F0] p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all"
              />
            </div>

            {/* Support Email */}
            <div className="w-full md:w-[50%]">
              <label className="font-semibold block mb-2 text-[#374151]">
                Support Email
              </label>
              <input
                name="emailSupport"
                value={formData.emailSupport}
                onChange={handleChange}
                className="w-full bg-[#F0F0F0] p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all"
              />
            </div>
          </div>

          {/* Company Name */}
          <div className="mb-6">
            <label className="font-semibold block mb-2 text-[#374151]">
              Company Name
            </label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full md:w-[calc(50%-12px)] bg-[#F0F0F0] p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] focus:shadow-[0_0_8px_rgba(0,176,255,0.3)] transition-all"
            />
          </div>

          {/* ACTION BUTTONS (Bottom Bar) */}
          <div className="md:justify-between md:items-center flex md:flex-row flex-col items-end gap-3 pt-6">
            <button
              type="button"
              disabled={!isDirty || isSaving}
              onClick={handleDiscard}
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                background: "rgb(240,240, 240)",
                cursor: !isDirty || isSaving ? "not-allowed" : "pointer",
              }}
              className="w-full sm:w-[220px] flex items-center justify-center gap-2 font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <IoCloseOutline className="text-2xl" />
              Discard Changes
            </button>

            <button
              type="button"
              disabled={!isDirty || isSaving}
              onClick={handleSave}
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "var(--gradient-color)",
                color: "#fff",
                opacity: !isDirty || isSaving ? 0.6 : 1,
                cursor: !isDirty || isSaving ? "not-allowed" : "pointer",
              }}
              className="w-full sm:w-[220px] flex items-center justify-center gap-2 font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <AiOutlineSave className="text-2xl" />
              {isSaving ? "Saving ..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Settings;
