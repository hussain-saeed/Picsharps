import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useGetCountriesQuery } from "../../../features/core/adminCoreApi";

function Countries() {
  const { data, isFetching, isError } = useGetCountriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Process data according to requirements
  const processedData = useMemo(() => {
    if (!data || data.status !== "success" || !data.data) return null;

    // 1. Remove objects where countryCode equals countryName (like "LO": "LO")
    const filteredData = data.data.filter(
      (item) => item.countryCode !== item.countryName,
    );

    // 2. Calculate total userCount
    const totalUsers = filteredData.reduce(
      (sum, item) => sum + item.userCount,
      0,
    );

    // 3. Sort by userCount descending
    const sortedData = [...filteredData]
      .sort((a, b) => b.userCount - a.userCount)
      .map((item) => ({
        ...item,
        percentage:
          totalUsers > 0 ? ((item.userCount / totalUsers) * 100).toFixed(1) : 0,
      }));

    // Take top 5 for chart
    const chartData = sortedData.slice(0, 5);

    return {
      chartData,
      allData: sortedData,
      totalUsers,
      hasData: sortedData.length > 0,
    };
  }, [data]);

  // Calculate pagination for table
  const tablePagination = useMemo(() => {
    if (!processedData) return null;

    const totalPages = Math.ceil(processedData.allData.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = processedData.allData.slice(
      indexOfFirstRecord,
      indexOfLastRecord,
    );

    return {
      totalPages,
      currentRecords,
    };
  }, [processedData, currentPage]);

  // Custom tooltip component with percentage
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && processedData) {
      const item = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            minWidth: "150px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
            {item.countryName}
          </p>
          <p style={{ margin: "5px 0 0 0", color: "#555", fontSize: "13px" }}>
            Users: {item.userCount} of {processedData.totalUsers}
          </p>
          <p
            style={{
              margin: "3px 0 0 0",
              color: "#0088FE",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            {item.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Colors for bars
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div>
      {/* Title */}
      <h2 style={{ marginBottom: 30 }}>Geographic Analytics</h2>

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
      {!isFetching &&
        !isError &&
        (!processedData || !processedData.hasData) && (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            No data available
          </div>
        )}

      {/* Chart and Table Display */}
      {!isFetching && !isError && processedData && processedData.hasData && (
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {/* Bar Chart Container with dynamic width */}
          <div
            style={{
              width: "100%",
              height: 400,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: Math.max(400, processedData.chartData.length * 120),
                height: "100%",
                maxWidth: "100%",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processedData.chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 30,
                    bottom: 60,
                  }}
                  barCategoryGap="30%"
                  barGap={2}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, "dataMax"]}
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Number of Users",
                      position: "insideBottom",
                      offset: -10,
                      style: { textAnchor: "middle", fontSize: 14 },
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="countryName"
                    width={80}
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="userCount"
                    name="Users"
                    barSize={30}
                    radius={[0, 4, 4, 0]}
                    isAnimationActive={true}
                  >
                    {processedData.chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Section */}
          <div>
            <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>
              All Countries ({processedData.allData.length})
            </h3>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "500px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f5f5f5",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Country
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Users of total {processedData.totalUsers}
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tablePagination?.currentRecords.map((item, index) => (
                    <tr
                      key={item.countryCode}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "2px",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={`https://flagsapi.com/${item.countryCode}/flat/32.png`}
                            alt={item.countryName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>
                          {item.countryName}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 14 }}>
                        {item.userCount.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 14 }}>
                        <span
                          style={{
                            color: "#0088FE",
                            fontWeight: 600,
                            fontSize: 13,
                            backgroundColor: "rgba(0, 136, 254, 0.1)",
                            padding: "4px 10px",
                            borderRadius: 12,
                          }}
                        >
                          {item.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {processedData.allData.length > recordsPerPage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || isFetching}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.6 : 1,
                    fontSize: 14,
                  }}
                >
                  Previous
                </button>

                <span style={{ fontSize: "14px" }}>
                  Page {currentPage} of {tablePagination?.totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, tablePagination?.totalPages || 1),
                    )
                  }
                  disabled={
                    currentPage === tablePagination?.totalPages || isFetching
                  }
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor:
                      currentPage === tablePagination?.totalPages
                        ? "#f5f5f5"
                        : "#fff",
                    cursor:
                      currentPage === tablePagination?.totalPages
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      currentPage === tablePagination?.totalPages ? 0.6 : 1,
                    fontSize: 14,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Countries;
