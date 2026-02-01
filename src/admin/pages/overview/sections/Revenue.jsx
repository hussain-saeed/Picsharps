import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useGetRevenueQuery } from "../../../features/core/adminCoreApi";

function Revenue() {
  const { data, isFetching, isError } = useGetRevenueQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  console.log("Revenue data:", data);

  const hasData = data?.status === "success" && data.data;
  const stats = hasData ? data.data : null;

  // Filter out "Free" plan from the data
  const filteredStats = React.useMemo(() => {
    if (!stats) return [];
    return stats.filter((plan) => plan.name !== "Free");
  }, [stats]);

  // Define colors for different plans
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{data.name}</p>
          <p style={{ margin: "5px 0 0 0" }}>
            Value: <strong>${data.value.toFixed(2)}</strong>
          </p>
          <p style={{ margin: "5px 0 0 0" }}>
            Percentage: <strong>{data.percentage}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-2xl font-semibold text-center -ml-4 bg">
        Revenue by Plan
      </h2>

      {/* Loading State */}
      {isFetching && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading statistics...
        </div>
      )}

      {/* Error State */}
      {isError && !isFetching && (
        <div style={{ textAlign: "center", padding: "40px", color: "#d32f2f" }}>
          Something went wrong while fetching statistics.
        </div>
      )}

      {/* No Data State */}
      {!isFetching && !isError && (!hasData || !stats) && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No data available
        </div>
      )}

      {/* Chart Display */}
      {!isFetching && !isError && hasData && filteredStats.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          {/* Pie Chart */}
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              accessibilityLayer={false} // أضف هذا السطر
            >
              <PieChart
                accessibilityLayer={false} // أضف هذا السطر
              >
                <Pie
                  accessibilityLayer={false} // أضف هذا السطر
                  data={filteredStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  innerRadius={80} // This creates the donut hole
                  fill="#8884d8"
                  dataKey="percentage"
                  nameKey="name"
                >
                  {filteredStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  accessibilityLayer={false} // أضف هذا السطر
                  content={<CustomTooltip />}
                />
                <Legend
                  accessibilityLayer={false} // أضف هذا السطر
                  verticalAlign="bottom"
                  formatter={(value, entry) => {
                    const item = filteredStats.find((s) => s.name === value);
                    return (
                      <span style={{ color: "#333", fontSize: "14px" }}>
                        {value}
                        {item && ` (${item.percentage}%)`}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Show message if only Free plan exists */}
      {!isFetching && !isError && hasData && filteredStats.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Only Free plan data available (excluded from chart)
        </div>
      )}
    </div>
  );
}

export default Revenue;
