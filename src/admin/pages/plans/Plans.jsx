import React, { useEffect, useMemo, useState } from "react";
import {
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "../../features/core/adminCoreApi";
import { toast } from "react-toastify";
import { transformPlansBySlug } from "../../../utils/plansUtils";

function Plans() {
  const prevGroupRef = React.useRef(null);

  const { data, isFetching } = useGetPlansQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  console.log("Fetched Plans Data:", data);

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
      name: groupChanged ? currentGroup.name : prev.name, // 👈 فرقنا هنا
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
      toast.error("Invalid plan selected");
      return;
    }

    // جهز البودي
    const body = { ...formData };

    // لو الاسم نفس الاسم الأصلي، ما تبعتهوش
    if (formData.name === originalFormData.name) {
      delete body.name;
    }

    try {
      const res = await updatePlan({
        code: activePlan.slug,
        body,
      }).unwrap();

      if (res.status === "success") {
        toast.success("Plan updated successfully");
        setOriginalFormData(formData);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
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
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "20px" }}>
        Plan Management
      </h1>

      {isFetching && <div>Loading...</div>}
      {!isFetching && data?.status !== "success" && (
        <div>Error fetching plans</div>
      )}

      {!isFetching && transformedPlans.length > 0 && (
        <>
          {/* PLAN GROUPS */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            {transformedPlans.map((group, index) => (
              <button
                key={group.name}
                onClick={() => {
                  setSelectedGroupIndex(index);
                  setSelectedPeriod("monthly"); // 👈 reset period on group change
                }}
                disabled={isSaving}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border:
                    selectedGroupIndex === index
                      ? "2px solid #4f46e5"
                      : "1px solid #ddd",
                  background: selectedGroupIndex === index ? "#eef2ff" : "#fff",
                }}
              >
                {group.name}
              </button>
            ))}
          </div>

          {/* FORM */}
          {activePlan && (
            <form
              style={{
                maxWidth: "440px",
                padding: "24px",
                borderRadius: "14px",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,.05)",
              }}
            >
              {/* Name */}
              <div style={{ marginBottom: "12px" }}>
                <label>Name</label>
                <input
                  name="name"
                  value={formData.name}
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

              {/* PERIOD */}
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "16px" }}
              >
                {["monthly", "yearly"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPeriod(p)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      border:
                        selectedPeriod === p
                          ? "2px solid #16a34a"
                          : "1px solid #ddd",
                      background: selectedPeriod === p ? "#dcfce7" : "#fff",
                    }}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Description */}
              <div style={{ marginBottom: "12px" }}>
                <label>Description</label>
                <input
                  name="description"
                  value={formData.description}
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

              {/* Credits */}
              <div style={{ marginBottom: "12px" }}>
                <label>Credits Per Period</label>
                <input
                  type="number"
                  name="creditsPerPeriod"
                  value={formData.creditsPerPeriod}
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

              {/* Active */}
              <label style={{ display: "flex", gap: "8px" }}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active
              </label>

              {/* ACTIONS */}
              <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  disabled={!isDirty || isSaving}
                  onClick={handleSave}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#16a34a",
                    color: "#fff",
                    opacity: !isDirty || isSaving ? 0.6 : 1,
                  }}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  disabled={!isDirty || isSaving}
                  onClick={() => setFormData(originalFormData)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    background: "#fff",
                  }}
                >
                  Discard
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
