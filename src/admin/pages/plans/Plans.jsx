import React, { useEffect, useMemo, useState } from "react";
import {
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "../../features/core/adminCoreApi";
import { toast } from "react-toastify";

function Plans() {
  const { data, isFetching, isError } = useGetPlansQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updatePlan, { isLoading: isSaving }] = useUpdatePlanMutation();

  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    creditsPerPeriod: 0,
    isActive: false,
  });
  const [originalFormData, setOriginalFormData] = useState(null);

  // detect dirty
  const isDirty = useMemo(() => {
    if (!originalFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  }, [formData, originalFormData]);

  // init from API, preserve active plan if possible
  useEffect(() => {
    if (
      data?.status === "success" &&
      Array.isArray(data.data?.plans) &&
      data.data.plans.length
    ) {
      // find current or default to first
      const currentPlan =
        data.data.plans.find((p) => p.id === selectedPlanId) ||
        data.data.plans[0];

      const snapshot = {
        name: currentPlan.name,
        description: currentPlan.description,
        creditsPerPeriod: currentPlan.creditsPerPeriod,
        isActive: currentPlan.isActive,
      };

      setSelectedPlanId(currentPlan.id);
      setOriginalFormData(snapshot);
      setFormData(snapshot);
    }
  }, [data]);

  // has valid plans
  const hasData = data?.status === "success" && Array.isArray(data.data?.plans);
  const plans = hasData ? data.data.plans : [];

  // swap second with third
  const swappedPlans = [...plans];
  if (swappedPlans.length >= 3) {
    const temp = swappedPlans[1];
    swappedPlans[1] = swappedPlans[2];
    swappedPlans[2] = temp;
  }

  const activePlan = plans.find((p) => p.id === selectedPlanId);

  const handleSelectPlan = (plan) => {
    const snapshot = {
      name: plan.name,
      description: plan.description,
      creditsPerPeriod: plan.creditsPerPeriod,
      isActive: plan.isActive,
    };
    setSelectedPlanId(plan.id);
    setOriginalFormData(snapshot);
    setFormData(snapshot);
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

  const handleSave = async () => {
    if (!activePlan) return;

    try {
      const res = await updatePlan({
        code: activePlan.slug,
        body: formData,
      }).unwrap();
      if (res.status === "success") {
        toast.success("Plan updated successfully");
        setOriginalFormData(formData); // reset dirty
      } else {
        toast.error("Something went wrong"); // server rejected
      }
    } catch {
      toast.error("Something went wrong"); // request failed
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* STATIC HEADER */}
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "20px" }}>
        Plan Management
      </h1>

      {/* STATUS */}
      {isFetching && <div>Loading...</div>}
      {isError && <div>Error fetching plans</div>}
      {!isFetching && !isError && !hasData && <div>Error fetching plans</div>}
      {!isFetching && hasData && plans.length === 0 && <div>No plans yet</div>}

      {/* PLAN BUTTONS */}
      {!isFetching && hasData && plans.length > 0 && (
        <>
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            {swappedPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                disabled={isSaving}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  border:
                    selectedPlanId === plan.id
                      ? "2px solid #4f46e5"
                      : "1px solid #ddd",
                  background: selectedPlanId === plan.id ? "#eef2ff" : "#fff",
                  fontWeight: selectedPlanId === plan.id ? 600 : 400,
                  opacity: isSaving ? 0.6 : 1,
                  transition: "all .2s",
                }}
              >
                {plan.name}{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({plan.slug})
                </span>
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
                    outline: "none",
                    marginTop: "6px",
                    transition: "0.2s",
                  }}
                  onFocus={(e) => (e.target.style.border = "1px solid #4f46e5")}
                  onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
                />
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
                    outline: "none",
                    marginTop: "6px",
                    transition: "0.2s",
                  }}
                  onFocus={(e) => (e.target.style.border = "1px solid #4f46e5")}
                  onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
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
                    outline: "none",
                    marginTop: "6px",
                    transition: "0.2s",
                  }}
                  onFocus={(e) => (e.target.style.border = "1px solid #4f46e5")}
                  onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
                />
              </div>

              {/* Active Checkbox */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active
              </label>

              {/* ACTION BUTTONS */}
              <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                {/* Save */}
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
                    transition: "0.2s",
                  }}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>

                {/* Discard */}
                <button
                  type="button"
                  disabled={!isDirty || isSaving}
                  onClick={() => setFormData(originalFormData)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    background: !isDirty || isSaving ? "#f3f4f6" : "#fff",
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
        </>
      )}
    </div>
  );
}

export default Plans;
