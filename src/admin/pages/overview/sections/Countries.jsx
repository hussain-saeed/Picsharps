import React, { useMemo, useState, useEffect } from "react";
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
import {
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiGlobe,
  FiTrendingUp,
} from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { IoEarth } from "react-icons/io5";
import { MdChevronLeft, MdChevronRight, MdPeopleOutline } from "react-icons/md";
import { FaArrowLeft, FaArrowRight, FaUsers } from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import useGeneralModal from "../../../hooks/useGeneralModal";
import GeneralModal from "../../../components/GeneralModal";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { useRef } from "react";
import useExportPDF from "../../../hooks/useExportPDF";
import ShowAsPDF from "../../../components/ShowAsPDF";

function Countries({ markAsDone }) {
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

  const { data, isFetching, isError } = useGetCountriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    let timeoutId;

    markAsDone(false);

    if (!isFetching) {
      markAsDone(true);
    } else {
      timeoutId = setTimeout(() => markAsDone(true), 10000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      markAsDone(false);
    };
  }, [isFetching]);

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
            Logins: {item.userCount} of {processedData.totalUsers}
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
    <div className="">
      {/* Title */}
      <h2 className="text-xl font-semibold">Geographic Analytics</h2>

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
        <>
          <div className="flex flex-col mt-1 text-gray-600 mb-10">
            <span>Total Countries: {processedData.allData.length}</span>
            <span>Total Logins Identified: {processedData.totalUsers}</span>
          </div>

          <div className="flex gap-8 xl:gap-4 xl:flex-row flex-col items-start">
            <div className="flex-1 min-w-[48%] w-full">
              <p className="pb-4 text-gray-500 font-semibold pl-1">
                All Records
              </p>
              <div className="overflow-x-auto rounded-xl shadow-lg">
                <>
                  <div className="w-full overflow-hidden">
                    <table className="w-full bg-white table-fixed sm:table-auto">
                      <thead>
                        <tr className="bg-linear-to-r from-[#00c853] to-[#00b0ff]">
                          <th className="px-3 sm:pl-6 sm:pr-6 py-4 text-left w-2/3 sm:w-auto">
                            <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                              <IoEarth className="w-5 h-5 hidden sm:block" />
                              <span>Country</span>
                            </div>
                          </th>

                          <th className="px-5 py-4 text-left hidden sm:table-cell">
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                              <HiUsers className="w-5 h-5" />
                              <span>Logins Identified</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left hidden sm:table-cell">
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                              <BsFileEarmarkBarGraph className="w-5 h-5" />
                              <span>Percentage</span>
                            </div>
                          </th>

                          <th className="px-3 py-4 sm:hidden w-1/3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {tablePagination?.currentRecords.map((item, index) => (
                          <tr
                            key={item.countryCode}
                            className={`
              border-b border-gray-100 transition-all duration-200 hover:bg-[#ddf4ff]/30
              ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
            `}
                          >
                            <td className="px-3 sm:pl-6 sm:pr-6 py-4">
                              <div className="flex items-center gap-2 sm:gap-4">
                                <div className="relative group hidden sm:block">
                                  <div className="w-10 h-6 flex justify-center items-center border border-gray-200 shadow-[0_2px_6px_rgba(0,0,0,0.08)] transform -skew-x-12 rounded-sm overflow-hidden">
                                    <img
                                      src={`https://flagsapi.com/${item.countryCode}/flat/64.png`}
                                      alt={item.countryName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                </div>
                                <span className="text-[13px] sm:text-sm font-semibold text-gray-800 truncate">
                                  {item.countryName}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 hidden sm:table-cell">
                              <span className="text-sm font-medium text-gray-700">
                                {item.userCount.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                              <div className="inline-flex items-center">
                                <span
                                  className="px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
                                  style={{
                                    background: "rgba(0, 136, 254, 0.1)",
                                    color: "#0088FE",
                                    border: "1px solid rgba(0, 136, 254, 0.2)",
                                  }}
                                >
                                  {item.percentage}%
                                </span>
                              </div>
                            </td>

                            <td className="px-3 py-4 sm:hidden flex items-center justify-end">
                              <button
                                onClick={() => handleOpenModal(item)}
                                className="flex items-center gap-1 text-[11px] font-bold text-[#00b0ff] cursor-pointer whitespace-nowrap"
                              >
                                Details
                                <LuSquareArrowOutUpRight />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <GeneralModal isOpen={isOpen} onClose={closeModal}>
                    {selectedItem && (
                      <div className="text-left">
                        <h2 className="font-bold text-lg border-b border-gray-400 pb-3 mb-3">
                          {selectedItem.countryName}
                        </h2>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-gray-500 text-sm">
                            Logins Identified:
                          </span>
                          <span className="font-semibold">
                            {selectedItem.userCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <span className="text-gray-500 text-sm">
                            Percentage:
                          </span>
                          <span className="font-semibold text-blue-600">
                            {selectedItem.percentage}%
                          </span>
                        </div>
                      </div>
                    )}
                  </GeneralModal>
                </>
              </div>

              {/* Pagination */}
              {processedData.allData.length > recordsPerPage && (
                <div className="flex justify-center lg:justify-end items-center gap-6 mt-4">
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
                    style={{
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      opacity: currentPage === 1 ? 0.6 : 1,
                    }}
                  >
                    <FiChevronLeft
                      className={`w-4 h-4 transition-transform duration-300 ${
                        currentPage !== 1 ? "group-hover:-translate-x-1" : ""
                      }`}
                    />
                    <span className="hidden sm:block">Previous</span>
                  </button>

                  <div className="flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-[#00c853]/10 to-[#00b0ff]/10 rounded-lg border border-[#00b0ff]/20">
                    <span className="text-sm font-semibold text-gray-700">
                      <span className="hidden sm:inline">Page</span>
                      <span className="font-bold text-base mx-1">
                        {currentPage}
                      </span>
                      of{" "}
                      <span className="font-bold text-base mx-1">
                        {tablePagination?.totalPages}
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, tablePagination?.totalPages || 1),
                      )
                    }
                    disabled={
                      currentPage === tablePagination?.totalPages || isFetching
                    }
                    className={`
                      group flex items-center gap-1 px-5 py-2.5 rounded-lg font-medium text-sm
                      transition-all duration-300 shadow-md
                      ${
                        currentPage === tablePagination?.totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                          : "text-white bg-linear-to-r from-[#00b0ff] to-[#00c853] hover:shadow-lg hover:scale-105 cursor-pointer"
                      }
                    `}
                    style={{
                      cursor:
                        currentPage === tablePagination?.totalPages
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        currentPage === tablePagination?.totalPages ? 0.6 : 1,
                    }}
                  >
                    <span className="hidden sm:block">Next</span>
                    <FiChevronRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        currentPage !== tablePagination?.totalPages
                          ? "group-hover:translate-x-1"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <ShowAsPDF onClick={downloadPDF} />

              <div
                ref={chartRef}
                style={{ color: "#000000", backgroundColor: "#ffffff" }}
                className="bg-white p-4 pb-12 sm:p-0"
              >
                <div
                  style={{
                    height: 400,
                    display: "flex",
                    justifyContent: "center",
                  }}
                  className="-ml-11 xl:ml-0"
                >
                  <div
                    style={{
                      width: Math.max(
                        400,
                        processedData.chartData.length * 120,
                      ),
                      height: "100%",
                      maxWidth: "100%",
                    }}
                  >
                    <p className="pb-4 pl-[105px] text-gray-500 font-semibold">
                      Top Ranked
                    </p>

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      accessibilityLayer={false}
                    >
                      <BarChart
                        accessibilityLayer={false}
                        style={{ outline: "none !important" }}
                        data={processedData.chartData}
                        margin={{
                          left: 30,
                          right: 30,
                          bottom: 20,
                        }}
                        barCategoryGap="30%"
                        barGap={2}
                        layout="vertical"
                      >
                        <CartesianGrid
                          accessibilityLayer={false}
                          strokeDasharray="3 3"
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis
                          accessibilityLayer={false}
                          type="number"
                          domain={[0, "dataMax"]}
                          tick={{ fontSize: 12 }}
                          label={{
                            value: "Number of Identified Logins",
                            position: "insideBottom",
                            offset: -10,
                            style: { textAnchor: "middle", fontSize: 14 },
                          }}
                        />
                        <YAxis
                          accessibilityLayer={false}
                          type="category"
                          dataKey="countryName"
                          width={80}
                          tick={{ fontSize: 12 }}
                          interval={0}
                          ignore={true}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          accessibilityLayer={false}
                          dataKey="userCount"
                          name="Users"
                          barSize={30}
                          radius={[0, 4, 4, 0]}
                          isAnimationActive={true}
                        >
                          {processedData.chartData.map((entry, index) => (
                            <Cell
                              accessibilityLayer={false}
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Countries;
