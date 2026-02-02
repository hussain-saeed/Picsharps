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
import { useRef } from "react";
import useExportPDF from "../../../hooks/useExportPDF";
import ShowAsPDF from "../../../components/ShowAsPDF";
import useGeneralModal from "../../../hooks/useGeneralModal";
import GeneralModal from "../../../components/GeneralModal";
import { FiUserPlus } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { LuCalendarDays } from "react-icons/lu";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IoMdTrendingDown } from "react-icons/io";
import { IoMdTrendingUp } from "react-icons/io";

const PERIODS = ["7D", "30D", "90D", "1Y"];

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
  const [period, setPeriod] = useState("90D");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5); // Maximum records to display in view
  const { isOpen, openModal, closeModal } = useGeneralModal();
  const [selectedItem, setSelectedItem] = useState(null);
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    openModal();
  };

  const chartRef = useRef(null);
  const { downloadPDF: exportToPDF } = useExportPDF();

  const downloadPDF = async () => {
    await exportToPDF(chartRef);
  };

  const { data, isFetching, isError } = useGetUserGrowthQuery(
    period.slice(0, -1) + period.slice(-1).toLowerCase(),
    {
      refetchOnMountOrArgChange: true,
    },
  );

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
      return { color: "#00B0FF", icon: null };
    }

    if (currentValue > previousValue) {
      return {
        color: "rgba(0, 200, 83, 1)",
        icon: <IoMdTrendingUp style={{ fontSize: "20px" }} />,
      };
    } else if (currentValue < previousValue) {
      return {
        color: "red",
        icon: <IoMdTrendingDown style={{ fontSize: "20px" }} />,
      };
    } else {
      return { color: "#00B0FF", icon: null };
    }
  };

  // Function to get previous day's value (from the row above in table)
  const getPreviousDayValue = (currentIndex, fieldName) => {
    if (currentIndex === 0) return null; // First record has no previous day

    // Since formattedRawData is sorted ascending, previous day is at currentIndex - 1
    const previousRecord = formattedRawData[currentIndex - 1];
    return previousRecord ? previousRecord[fieldName] : null;
  };

  // Reset to first page when period changes
  useEffect(() => {
    setCurrentPage(1);
  }, [period]);

  return (
    <div className>
      <h2 className="text-xl font-semibold mb-4">User Growth</h2>

      {/* Period Buttons */}
      <div style={{ display: "flex", gap: 5, marginBottom: 40 }}>
        {PERIODS.map((p) => {
          const isActive = p === period;
          const isDisabled = isFetching;

          return (
            <>
              <button
                key={p}
                onClick={() => setPeriod(p)}
                disabled={isDisabled}
                style={{
                  width: "75px",
                  padding: "8px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  backgroundColor: isActive ? "#00B0FF" : "#fff",
                  color: isActive ? "#fff" : "#000",
                  fontWeight: 600,
                  opacity: isDisabled ? 0.6 : 1,
                }}
              >
                {p}
              </button>
            </>
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
          <div className="relative">
            <ShowAsPDF onClick={() => downloadPDF(chartRef)} breakP="lg" />

            <div style={{ width: "100%", overflow: "hidden" }}>
              <div
                ref={chartRef}
                style={{
                  display: "block",
                }}
                className="p-4 pb-12 lg:p-0 w-[1800px] lg:w-[103%]"
              >
                <div
                  style={{ height: 400, width: "100%", marginLeft: "-40px" }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    accessibilityLayer={false}
                  >
                    <LineChart
                      accessibilityLayer={false}
                      data={processedData}
                      margin={{ right: 50, left: 20, top: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        accessibilityLayer={false}
                      />
                      <XAxis
                        accessibilityLayer={false}
                        dataKey="formattedDate"
                        ticks={xAxisTicks.map((date) => {
                          const item = processedData.find(
                            (d) => d.date === date,
                          );
                          return item ? item.formattedDate : date;
                        })}
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis
                        accessibilityLayer={false}
                        domain={[0, "auto"]}
                        ticks={yAxisTicks}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        accessibilityLayer={false}
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
                      <Line
                        accessibilityLayer={false}
                        type="monotone"
                        dataKey="totalUsers"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                        name="Total Users"
                      />
                      <Line
                        accessibilityLayer={false}
                        type="monotone"
                        dataKey="newSignups"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                        name="New Signups"
                      />
                      <Line
                        accessibilityLayer={false}
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
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div style={{ marginTop: 40 }}>
            {formattedRawData.length > 0 ? (
              <>
                {/* Data Table Container */}
                <div className="overflow-x-auto rounded-xl shadow-lg mt-5">
                  <div className="w-full overflow-hidden">
                    <table className="w-full bg-white table-fixed sm:table-auto">
                      <thead>
                        <tr className="bg-linear-to-r from-[#00c853] to-[#00b0ff]">
                          <th className="px-3 md:pl-6 py-4 text-left w-2/3 md:w-auto">
                            <div className="flex items-center gap-2 text-white font-semibold text-xs md:text-sm">
                              <LuCalendarDays className="w-5 h-5 hidden md:block" />
                              <span>Date</span>
                            </div>
                          </th>

                          <th className="px-5 py-4 text-left hidden md:table-cell">
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                              <HiUsers className="w-5 h-5" />
                              <span>Active Users</span>
                            </div>
                          </th>
                          <th className="px-5 py-4 text-left hidden md:table-cell">
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                              <FiUserPlus className="w-5 h-5" />
                              <span>New Signups</span>
                            </div>
                          </th>
                          <th className="px-5 py-4 text-left hidden md:table-cell">
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                              <BsFileEarmarkBarGraph className="w-5 h-5" />
                              <span>Total Users</span>
                            </div>
                          </th>

                          <th className="px-3 py-4 md:hidden w-1/3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.map((record, index) => {
                          const globalIndex = indexOfFirstRecord + index;
                          const activeUsersIndicator = getValueIndicator(
                            record.activeUsers,
                            getPreviousDayValue(globalIndex, "activeUsers"),
                            "activeUsers",
                          );
                          const newSignupsIndicator = getValueIndicator(
                            record.newSignups,
                            getPreviousDayValue(globalIndex, "newSignups"),
                            "newSignups",
                          );
                          const totalUsersIndicator = getValueIndicator(
                            record.totalUsers,
                            getPreviousDayValue(globalIndex, "totalUsers"),
                            "totalUsers",
                          );

                          return (
                            <tr
                              key={record.date}
                              className={`
                border-b border-gray-100 transition-all duration-200 hover:bg-[#ddf4ff]/30
                ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              `}
                            >
                              <td className="px-3 md:pl-6 py-4">
                                <span className="text-[13px] md:text-sm font-semibold text-gray-800">
                                  {record.formattedDate}
                                </span>
                              </td>

                              <td className="px-5 py-4 hidden md:table-cell">
                                <div
                                  className="flex items-center gap-2 text-md font-medium"
                                  style={{ color: activeUsersIndicator.color }}
                                >
                                  {record.activeUsers}{" "}
                                  {activeUsersIndicator.icon}
                                </div>
                              </td>
                              <td className="px-5 py-4 hidden md:table-cell">
                                <div
                                  className="flex items-center gap-2 text-md font-medium"
                                  style={{ color: newSignupsIndicator.color }}
                                >
                                  {record.newSignups} {newSignupsIndicator.icon}
                                </div>
                              </td>

                              <td className="px-5 py-4 hidden md:table-cell">
                                <div
                                  className="flex items-center gap-2 text-md font-medium"
                                  style={{ color: totalUsersIndicator.color }}
                                >
                                  {record.totalUsers} {totalUsersIndicator.icon}
                                </div>
                              </td>

                              <td className="px-3 py-4 md:hidden flex items-center justify-end">
                                <button
                                  onClick={() => handleOpenModal(record)} // تأكد من وجود الميثود لفتح المودال
                                  className="flex items-center gap-1 text-[11px] font-bold text-[#00b0ff] cursor-pointer whitespace-nowrap"
                                >
                                  Details
                                  <LuSquareArrowOutUpRight />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Section - Matches exactly your style */}
                {formattedRawData.length > recordsPerPage && (
                  <div className="flex justify-center lg:justify-end items-center gap-6 mt-6">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1 || isFetching}
                      className={`
        group flex items-center gap-1 px-5 py-2.5 rounded-lg font-medium text-sm
        transition-all duration-300 shadow-md
        ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
            : "text-white bg-linear-to-r from-[#00b0ff] to-[#00c853] hover:shadow-lg hover:scale-105 cursor-pointer"
        }
      `}
                    >
                      <FiChevronLeft
                        className={`w-4 h-4 transition-transform duration-300 ${currentPage !== 1 ? "group-hover:-translate-x-1" : ""}`}
                      />
                      <span className="hidden sm:block">Previous</span>
                    </button>

                    <div className="flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-[#00c853]/10 to-[#00b0ff]/10 rounded-lg border border-[#00b0ff]/20">
                      <span className="text-sm font-semibold text-gray-700">
                        <span className="hidden sm:inline">Page</span>
                        <span className="font-bold text-base mx-1">
                          {currentPage}
                        </span>
                        of
                        <span className="font-bold text-base mx-1">
                          {totalPages}
                        </span>
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages || isFetching}
                      className={`
        group flex items-center gap-1 px-5 py-2.5 rounded-lg font-medium text-sm
        transition-all duration-300 shadow-md
        ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
            : "text-white bg-linear-to-r from-[#00b0ff] to-[#00c853] hover:shadow-lg hover:scale-105 cursor-pointer"
        }
      `}
                    >
                      <span className="hidden sm:block">Next</span>
                      <FiChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${currentPage !== totalPages ? "group-hover:translate-x-1" : ""}`}
                      />
                    </button>
                  </div>
                )}

                {/* Modal Section - Same Layout */}
                <GeneralModal isOpen={isOpen} onClose={closeModal}>
                  {selectedItem && (
                    <div className="text-left">
                      <h2 className="font-bold text-lg border-b border-gray-400 pb-3 mb-3">
                        {selectedItem.formattedDate}
                      </h2>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-sm">
                            Active Users:
                          </span>
                          <span className="font-semibold">
                            {selectedItem.activeUsers}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-sm">
                            New Signups:
                          </span>
                          <span className="font-semibold">
                            {selectedItem.newSignups}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-sm">
                            Total Users:
                          </span>
                          <span className="font-semibold">
                            {selectedItem.totalUsers}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </GeneralModal>
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
