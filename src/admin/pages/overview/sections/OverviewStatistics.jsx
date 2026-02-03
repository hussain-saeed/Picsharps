import React, { useEffect, useState, useRef } from "react";
import { useGetOverviewStatisticsQuery } from "../../../features/core/adminCoreApi";
import {
  FaUser,
  FaCreditCard,
  FaDollarSign,
  FaTasks,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { CiCreditCard1 } from "react-icons/ci";
import { FiDollarSign } from "react-icons/fi";
import { TbReport } from "react-icons/tb";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaArrowsRotate } from "react-icons/fa6";

function StatCard({
  title,
  icon: Icon,
  value,
  subValue,
  change,
  label,
  extraContent,
  footerText,
}) {
  const boxStyle = {
    borderRadius: 8,
    padding: 20,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 200,
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    position: "relative",
  };

  return (
    <div style={boxStyle} className="min-h-auto sm:min-h-[246px]">
      <div
        className="absolute right-5 top-5 w-12 h-12 rounded-xl flex justify-center items-center text-white text-3xl"
        style={{ background: "var(--gradient-color)" }}
      >
        <Icon />
      </div>

      <span>{title}</span>

      <div
        style={{ fontSize: 28, fontWeight: "bold" }}
        className={subValue ? "mb-4 flex flex-col" : "mb-4"}
      >
        {value}
        {subValue && (
          <span
            style={{ fontSize: 14, fontWeight: 400 }}
            className="text-gray-500"
          >
            {subValue}
          </span>
        )}
      </div>

      {change !== undefined && <ChangeIndicator value={change} label={label} />}

      {footerText && (
        <div style={{ fontSize: 14 }} className="text-gray-500">
          {footerText}
        </div>
      )}

      {extraContent}
    </div>
  );
}

function ChangeIndicator({ value, label }) {
  if (value == null) return null;

  const isPositive = value > 0;
  const isNegative = !isPositive && value != 0;
  const ArrowIcon = isPositive
    ? FaArrowTrendUp
    : isNegative
      ? FaArrowTrendDown
      : FaArrowsRotate;
  const displayValue = isPositive && value > 0 ? `+${value}` : value;
  return (
    <div
      style={{
        color: isPositive
          ? "rgba(0, 200, 83, 1)"
          : isNegative
            ? "red"
            : "#00B0FF",
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <ArrowIcon style={{ fontSize: "19px" }} />
      <span className="font-semibold">{displayValue}%</span>
      {label && (
        <span
          style={{ fontSize: "14px", marginLeft: 5 }}
          className="text-gray-500"
        >
          {label}
        </span>
      )}
    </div>
  );
}

function OverviewStatistics({ markAsDone }) {
  const { data, isFetching, isError } = useGetOverviewStatisticsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    },
  );

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

  const hasData = data?.status === "success" && data.data;

  const stats = hasData ? data.data : null;

  if (isFetching) return <div>Loading statistics...</div>;
  if (isError || !hasData)
    return <div>Something went wrong while fetching statistics.</div>;
  if (hasData && !stats) return <div>No data yet</div>;

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4.5">
      <StatCard
        title="Total Users"
        icon={AiOutlineUser}
        value={stats.users?.total ?? "-"}
        change={stats.users?.change}
        label={stats.users?.label}
      />

      <StatCard
        title="Active Subscriptions"
        icon={CiCreditCard1}
        value={stats.subscriptions?.total ?? "-"}
        change={stats.subscriptions?.change}
        extraContent={
          stats.subscriptions?.breakdown?.length > 0 && (
            <div style={{ marginTop: 5 }}>
              {stats.subscriptions.breakdown.map((b, idx) => (
                <div
                  key={idx}
                  style={{ fontSize: 14 }}
                  className="text-gray-500"
                >
                  {b.name}: {b.count}
                </div>
              ))}
            </div>
          )
        }
      />

      <StatCard
        title="Total Revenue"
        icon={FiDollarSign}
        value={`$${stats.revenue?.totalAllTime ?? "-"}`}
        subValue={`Current Month: $${stats.revenue?.currentMonth ?? "-"}`}
        change={stats.revenue?.change}
        label={stats.revenue?.label}
      />

      <StatCard
        title="Daily Operations"
        icon={TbReport}
        value={stats.operations?.total ?? "-"}
        footerText={stats.operations?.label}
      />
    </div>
  );
}

export default OverviewStatistics;
