import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetUserGrowthQuery } from "../../../features/core/adminCoreApi";

const PERIODS = ["7d", "30d", "90d", "1y"];

// Function to generate Y-axis ticks based on max value
const generateYAxisTicks = (maxValue) => {
  if (maxValue <= 10) {
    // If value ≤ 10, use step of 2
    const ticks = [];
    for (let i = 0; i <= maxValue + 2; i += 2) {
      ticks.push(i);
    }
    return ticks.length > 6 ? ticks.slice(0, 6) : ticks;
  } else {
    // If value > 10, use step of 100
    const roundedMax = Math.ceil(maxValue / 100) * 100;
    const ticks = [];
    for (let i = 0; i <= roundedMax; i += 100) {
      ticks.push(i);
    }
    return ticks.length > 6 ? ticks.slice(0, 6) : ticks;
  }
};

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function UserGrowth() {
  const [period, setPeriod] = useState("90d");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); // Maximum records to display in view

  const { data, isFetching, isError } = useGetUserGrowthQuery(period, {
    refetchOnMountOrArgChange: true,
  });

  const hasData = data?.status === "success";
  const rawData = data?.data || [];

  // Process data to fill time gaps (for chart only)
  const processedData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    const sortedData = [...rawData].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    const result = [];
    const startDate = new Date(sortedData[0].date);
    const endDate = new Date(sortedData[sortedData.length - 1].date);

    let currentDate = new Date(startDate);
    let lastKnownData = {};

    while (currentDate <= endDate) {
      const currentDateStr = currentDate.toISOString().split("T")[0];
      const existingData = sortedData.find(
        (item) => item.date === currentDateStr,
      );

      if (existingData) {
        lastKnownData = {
          ...existingData,
          date: currentDateStr,
          formattedDate: formatDate(currentDateStr),
        };
        result.push(lastKnownData);
      } else {
        result.push({
          date: currentDateStr,
          formattedDate: formatDate(currentDateStr),
          totalUsers: lastKnownData.totalUsers || 0,
          newSignups: 0,
          activeUsers: lastKnownData.activeUsers || 0,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }, [rawData]);

  // Calculate max value for Y-axis
  const maxValue = useMemo(() => {
    if (!processedData.length) return 10;

    let max = 0;
    processedData.forEach((item) => {
      max = Math.max(max, item.totalUsers, item.newSignups, item.activeUsers);
    });

    return max;
  }, [processedData]);

  // Generate Y-axis ticks
  const yAxisTicks = useMemo(() => generateYAxisTicks(maxValue), [maxValue]);

  // X-axis data - show only first and last date
  const xAxisTicks = useMemo(() => {
    if (processedData.length === 0) return [];
    if (processedData.length === 1) return [processedData[0].date];

    return [
      processedData[0].date,
      processedData[processedData.length - 1].date,
    ];
  }, [processedData]);

  // Format raw data for table display (ascending - oldest first)
  const formattedRawData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    // Sort raw data by date (ascending - oldest first)
    return [...rawData]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        ...item,
        formattedDate: formatDate(item.date),
      }));
  }, [rawData]);

  // Calculate pagination
  const totalPages = Math.ceil(formattedRawData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = formattedRawData.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  // Function to determine value change indicator
  const getValueIndicator = (currentValue, previousValue, fieldName) => {
    // Use strict comparison to check if previousValue is null or undefined
    // 0 should be treated as a valid number, not as falsy
    if (previousValue === null || previousValue === undefined) {
      return { color: "blue", icon: null };
    }

    if (currentValue > previousValue) {
      return { color: "green", icon: "↑" };
    } else if (currentValue < previousValue) {
      return { color: "red", icon: "↓" };
    } else {
      return { color: "blue", icon: null };
    }
  };

  // Function to get previous day's value (from the row above in table)
  const getPreviousDayValue = (currentIndex, fieldName) => {
    if (currentIndex === 0) return null; // First record has no previous day

    // Since formattedRawData is sorted ascending, previous day is at currentIndex - 1
    const previousRecord = formattedRawData[currentIndex - 1];
    return previousRecord ? previousRecord[fieldName] : null;
  };

  useEffect(() => {
    if (hasData) {
      console.log(`get ${period} successfully`);
      console.log("Growth Data:", data.data);
      console.log("Processed Data:", processedData);
    }
  }, [hasData, period, data, processedData]);

  // Reset to first page when period changes
  useEffect(() => {
    setCurrentPage(1);
  }, [period]);

  return (
    <div style={{ marginTop: 20, padding: 20 }}>
      {/* Period Buttons */}
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

      {/* Loading and Error States */}
      {isFetching && <div>Loading user growth...</div>}

      {isError && !isFetching && (
        <div>Something went wrong while fetching growth data.</div>
      )}

      {/* Chart */}
      {hasData && !isFetching && processedData.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="formattedDate"
                ticks={xAxisTicks.map((date) => {
                  const item = processedData.find((d) => d.date === date);
                  return item ? item.formattedDate : date;
                })}
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis
                domain={[0, "auto"]}
                ticks={yAxisTicks}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  const labels = {
                    totalUsers: "Total Users",
                    newSignups: "New Signups",
                    activeUsers: "Active Users",
                  };
                  return [value, labels[name] || name];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />

              {/* Lines */}
              <Line
                type="monotone"
                dataKey="totalUsers"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Total Users"
              />
              <Line
                type="monotone"
                dataKey="newSignups"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="New Signups"
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#ff7300"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Active Users"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Table Section */}
          <div style={{ marginTop: 40 }}>
            <h3>User Growth Data</h3>

            {formattedRawData.length > 0 ? (
              <>
                {/* Data Table */}
                <div style={{ overflowX: "auto", marginTop: 20 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #ddd" }}>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Active Users
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          New Signups
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Total Users
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.map((record, index) => {
                        // Calculate global index in formattedRawData
                        const globalIndex = indexOfFirstRecord + index;

                        // Get previous day values for comparison (from the row above)
                        const prevActiveUsers = getPreviousDayValue(
                          globalIndex,
                          "activeUsers",
                        );
                        const prevNewSignups = getPreviousDayValue(
                          globalIndex,
                          "newSignups",
                        );
                        const prevTotalUsers = getPreviousDayValue(
                          globalIndex,
                          "totalUsers",
                        );

                        // Determine indicators
                        const activeUsersIndicator = getValueIndicator(
                          record.activeUsers,
                          prevActiveUsers,
                          "activeUsers",
                        );
                        const newSignupsIndicator = getValueIndicator(
                          record.newSignups,
                          prevNewSignups,
                          "newSignups",
                        );
                        const totalUsersIndicator = getValueIndicator(
                          record.totalUsers,
                          prevTotalUsers,
                          "totalUsers",
                        );

                        return (
                          <tr
                            key={record.date}
                            style={{ borderBottom: "1px solid #eee" }}
                          >
                            <td style={{ padding: "12px", minWidth: "120px" }}>
                              {record.formattedDate}
                            </td>
                            <td style={{ padding: "12px", minWidth: "120px" }}>
                              <div
                                style={{
                                  color: activeUsersIndicator.color,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <span>{record.activeUsers}</span>
                                {activeUsersIndicator.icon && (
                                  <span style={{ fontWeight: "bold" }}>
                                    {activeUsersIndicator.icon}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "12px", minWidth: "120px" }}>
                              <div
                                style={{
                                  color: newSignupsIndicator.color,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <span>{record.newSignups}</span>
                                {newSignupsIndicator.icon && (
                                  <span style={{ fontWeight: "bold" }}>
                                    {newSignupsIndicator.icon}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "12px", minWidth: "120px" }}>
                              <div
                                style={{
                                  color: totalUsersIndicator.color,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <span>{record.totalUsers}</span>
                                {totalUsersIndicator.icon && (
                                  <span style={{ fontWeight: "bold" }}>
                                    {totalUsersIndicator.icon}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {formattedRawData.length > recordsPerPage && (
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
                      }}
                    >
                      Previous
                    </button>

                    <span style={{ fontSize: "14px" }}>
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages || isFetching}
                      style={{
                        padding: "6px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor:
                          currentPage === totalPages ? "#f5f5f5" : "#fff",
                        cursor:
                          currentPage === totalPages
                            ? "not-allowed"
                            : "pointer",
                        opacity: currentPage === totalPages ? 0.6 : 1,
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Show total records count */}
                <div
                  style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}
                >
                  Showing {indexOfFirstRecord + 1} to{" "}
                  {Math.min(indexOfLastRecord, formattedRawData.length)} of{" "}
                  {formattedRawData.length} records
                </div>
              </>
            ) : (
              <div style={{ marginTop: 20 }}>No data available for table</div>
            )}
          </div>
        </>
      )}

      {hasData && !isFetching && processedData.length === 0 && (
        <div>No data available</div>
      )}
    </div>
  );
}

export default UserGrowth;
