import React, { useEffect, useMemo, useState } from "react";
import {
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "../../features/core/adminCoreApi";
import { toast } from "react-toastify";
import { transformPlansBySlug } from "../../../utils/plansUtils";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineSave } from "react-icons/ai";
import { LoadingDots } from "../../components/LoadingDots";

function Plans() {
  const prevGroupRef = React.useRef(null);

  const { data, isFetching } = useGetPlansQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updatePlan, { isLoading: isSaving }] = useUpdatePlanMutation();

  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    creditsPerPeriod: 0,
    isActive: false,
  });

  const [originalFormData, setOriginalFormData] = useState(null);

  /* =============================
      TRANSFORM BY SLUG
  ============================== */

  const transformedPlans = useMemo(() => {
    if (data?.status !== "success") return [];
    return transformPlansBySlug(data?.data?.plans);
  }, [data]);

  /* =============================
      INIT FORM
  ============================== */

  useEffect(() => {
    if (!transformedPlans.length) return;

    const currentGroup = transformedPlans[selectedGroupIndex];
    const currentPlan = currentGroup?.[selectedPeriod];

    if (!currentPlan) return;

    const groupChanged = prevGroupRef.current !== selectedGroupIndex;

    setFormData((prev) => ({
      name: groupChanged ? currentGroup.name : prev.name,
      description: currentPlan.description,
      creditsPerPeriod: currentPlan.creditsPerPeriod,
      isActive: currentPlan.isActive,
    }));

    setOriginalFormData({
      name: currentGroup.name,
      description: currentPlan.description,
      creditsPerPeriod: currentPlan.creditsPerPeriod,
      isActive: currentPlan.isActive,
    });

    prevGroupRef.current = selectedGroupIndex;
  }, [transformedPlans, selectedGroupIndex, selectedPeriod]);

  /* =============================
      DIRTY CHECK
  ============================== */

  const isDirty = useMemo(() => {
    if (!originalFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  }, [formData, originalFormData]);

  const activePlan = transformedPlans[selectedGroupIndex]?.[selectedPeriod];

  /* =============================
        HANDLERS
  ============================== */

  const handleSave = async () => {
    if (!activePlan?.slug) {
      toast.error("Something went wrong!");
      return;
    }

    if (!formData.name || formData.name.trim() === "") {
      toast.error("Name can't be blank!");
      return;
    }

    if (!formData.description || formData.description.trim() === "") {
      toast.error("Description can't be blank!");
      return;
    }

    if (formData.creditsPerPeriod === "" || formData.creditsPerPeriod < 0) {
      toast.error("Credits must be 0 or more!");
      return;
    }

    const body = { ...formData };

    if (formData.name === originalFormData.name) {
      delete body.name;
    }

    try {
      const res = await updatePlan({
        code: activePlan.slug,
        body,
      }).unwrap();

      if (res.status === "success") {
        toast.success("Plan updated successfully!");
        setOriginalFormData(formData);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  /* =============================
        RENDER
  ============================== */

  return (
    <div
      style={{ padding: "30px", border: "1px solid rgba(228, 228, 228, 1)" }}
      className="bg-white w-full lg:max-w-[700px] rounded-2xl shadow-xl min-h-[671px]"
    >
      <h2 className="text-xl font-semibold mb-4">Plan Management</h2>

      {isFetching && (
        <LoadingDots
          loadingSize="20px"
          loadingWeight="500"
          dotsSize="25px"
          dotsWeight="600"
          gap="4px"
        />
      )}
      {!isFetching && data?.status !== "success" && (
        <p className="text-[20px] font-semibold text-red-600 pt-2.5">
          Something went wrong!
        </p>
      )}

      {!isFetching && transformedPlans.length > 0 && (
        <>
          {/* 1. PLAN GROUPS (Top Controller) */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginBottom: "30px",
              background: "rgb(240,240, 240)",
            }}
            className="sm:w-fit p-1.5 rounded-xl shadow-sm"
          >
            {transformedPlans.map((group, index) => (
              <button
                key={group.name}
                onClick={() => {
                  setSelectedGroupIndex(index);
                  setSelectedPeriod("monthly");
                }}
                disabled={isSaving}
                style={{
                  color:
                    selectedGroupIndex === index
                      ? "black"
                      : "rgb(125,125, 125)",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background:
                    selectedGroupIndex === index
                      ? "rgb(250,250, 250)"
                      : "transparent",
                }}
                className="font-semibold w-[50%] sm:min-w-[120px] cursor-pointer transition-all"
              >
                {group.name}
              </button>
            ))}
          </div>

          {/* FORM START */}
          {activePlan && (
            <form onSubmit={(e) => e.preventDefault()}>
              {/* 2. BASIC INFO SECTION */}
              <div className="mb-6">
                <label className="font-semibold block mb-2">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full md:w-[calc(50%-12px)] bg-[#F0F0F0] p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] focus:shadow-[0_0_8px_rgba(0,176,255,0.3)] transition-all"
                />
              </div>

              {/* 3. PLAN DETAILS BOX (The Grouped Section) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10">
                {/* Period Toggle inside the box */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginBottom: "30px",
                    background: "rgb(240,240, 240)",
                  }}
                  className="sm:w-fit p-1.5 rounded-xl"
                >
                  {["monthly", "yearly"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPeriod(p)}
                      disabled={isSaving}
                      style={{
                        color:
                          selectedPeriod === p ? "black" : "rgb(125,125, 125)",
                        padding: "5px 9px",
                        borderRadius: "10px",
                        background:
                          selectedPeriod === p
                            ? "rgb(250,250, 250)"
                            : "transparent",
                      }}
                      className="font-semibold w-[50%] sm:min-w-[100px] cursor-pointer transition-all"
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Description & Credits Row */}
                <div className="flex gap-6 flex-col md:flex-row mb-8">
                  <div className="w-full md:w-[50%]">
                    <label className="font-semibold block mb-2">
                      Description
                    </label>
                    <input
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-[#F0F0F0] p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all"
                    />
                  </div>

                  <div className="w-full md:w-[50%]">
                    <label className="font-semibold block mb-2">
                      Credits Per Period
                    </label>
                    <input
                      type="number"
                      name="creditsPerPeriod"
                      value={formData.creditsPerPeriod}
                      onChange={handleChange}
                      className="w-full bg-[#F0F0F0] p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all"
                    />
                  </div>
                </div>

                {/* Active Toggle inside the box */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                  className="w-fit"
                >
                  <div style={{ position: "relative" }}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      style={{
                        opacity: 0,
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                        zIndex: 1,
                      }}
                    />
                    <div
                      style={{
                        width: "60px",
                        height: "30px",
                        backgroundColor: formData.isActive
                          ? "#4ade80"
                          : "#fb7185",
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 5px",
                        transition: "background-color 0.3s ease",
                        justifyContent: formData.isActive
                          ? "flex-end"
                          : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition:
                            "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                      >
                        {formData.isActive ? (
                          <IoCheckmarkCircle
                            style={{ color: "#4ade80", fontSize: "18px" }}
                          />
                        ) : (
                          <IoCloseCircle
                            style={{ color: "#fb7185", fontSize: "18px" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontWeight: "bold", color: "#374151" }}>
                    {formData.isActive ? "Plan is Active" : "Plan is Inactive"}
                  </span>
                </label>
              </div>

              {/* 4. MAIN ACTIONS (Bottom Bar) */}
              <div className="md:justify-between md:items-center flex md:flex-row flex-col items-end gap-3 pt-6">
                <button
                  type="button"
                  disabled={!isDirty || isSaving}
                  onClick={() => setFormData(originalFormData)}
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
                  className="w-full sm:w-[220px] flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <AiOutlineSave className="text-2xl" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default Plans;
