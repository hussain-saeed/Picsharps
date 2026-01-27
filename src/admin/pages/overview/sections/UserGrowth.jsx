import React, { useState, useEffect } from "react";
import { useGetUserGrowthQuery } from "../../../features/core/adminCoreApi";

const PERIODS = ["7d", "30d", "90d", "1y"];

function UserGrowth() {
  const [period, setPeriod] = useState("90d");

  const { data, isFetching, isError } = useGetUserGrowthQuery(period, {
    refetchOnMountOrArgChange: true,
  });

  const hasData = data?.status === "success";

  useEffect(() => {
    if (hasData) {
      console.log(`get ${period} successfully`);
      console.log("Growth Data:", data.data);
    }
  }, [hasData, period, data]);

  return (
    <div style={{ marginTop: 20 }}>
      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        {PERIODS.map((p) => {
          const isActive = p === period;
          const isDisabled = isFetching;

          return (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              disabled={isDisabled}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid #ddd",
                cursor: isDisabled ? "not-allowed" : "pointer",
                backgroundColor: isActive ? "#000" : "#fff",
                color: isActive ? "#fff" : "#000",
                fontWeight: 500,
                opacity: isDisabled ? 0.6 : 1,
              }}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* States */}
      {isFetching && <div>Loading user growth...</div>}

      {isError && !isFetching && (
        <div>Something went wrong while fetching growth data.</div>
      )}

      {hasData && !isFetching && <div>{`get ${period} successfully`}</div>}
    </div>
  );
}

export default UserGrowth;
