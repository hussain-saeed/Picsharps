import React from "react";
import { useGetOverviewStatisticsQuery } from "../../../features/core/adminCoreApi";
import {
  FaUser,
  FaCreditCard,
  FaDollarSign,
  FaTasks,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

function ChangeIndicator({ value, label }) {
  if (value == null) return null;

  const isPositive = value >= 0;
  const ArrowIcon = isPositive ? FaArrowUp : FaArrowDown;
  const displayValue = isPositive && value > 0 ? `+${value}` : value;

  const color = isPositive ? "green" : "red";

  return (
    <div
      style={{
        color,
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontWeight: 500,
      }}
    >
      <ArrowIcon />
      <span>{displayValue}%</span>
      {label && <span style={{ fontWeight: 400, marginLeft: 5 }}>{label}</span>}
    </div>
  );
}

function OverviewStatistics() {
  const { data, isFetching, isError } = useGetOverviewStatisticsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  if (isFetching) return <div>Loading statistics...</div>;
  if (isError)
    return <div>Something went wrong while fetching statistics.</div>;
  if (!data?.data) return <div>No data yet</div>;

  const stats = data.data;

  const boxStyle = {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 20,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 200,
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 20 }}>
      {/* Total Users */}
      <div style={boxStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaUser size={24} />
          <span>Total Users</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: "bold" }}>
          {stats.users?.total ?? "-"}
        </div>
        <ChangeIndicator
          value={stats.users?.change}
          label={stats.users?.label}
        />
      </div>

      {/* Active Subscriptions */}
      <div style={boxStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaCreditCard size={24} />
          <span>Active Subscriptions</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: "bold" }}>
          {stats.subscriptions?.total ?? "-"}
        </div>
        <ChangeIndicator value={stats.subscriptions?.change} />
        {stats.subscriptions?.breakdown?.length > 0 && (
          <div style={{ marginTop: 5 }}>
            {stats.subscriptions.breakdown.map((b, idx) => (
              <div key={idx} style={{ fontSize: 14 }}>
                {b.name}: {b.count}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total Revenue */}
      <div style={boxStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaDollarSign size={24} />
          <span>Total Revenue</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: "bold" }}>
          ${stats.revenue?.totalAllTime ?? "-"}{" "}
          <span style={{ fontSize: 14, fontWeight: 400 }}>
            (Current Month: ${stats.revenue?.currentMonth ?? "-"})
          </span>
        </div>
        <ChangeIndicator
          value={stats.revenue?.change}
          label={stats.revenue?.label}
        />
      </div>

      {/* Daily Operations */}
      <div style={boxStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaTasks size={24} />
          <span>Daily Operations</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: "bold" }}>
          {stats.operations?.total ?? "-"}
        </div>
        <div style={{ fontSize: 14, fontWeight: 400 }}>
          {stats.operations?.label}
        </div>
      </div>
    </div>
  );
}

export default OverviewStatistics;
