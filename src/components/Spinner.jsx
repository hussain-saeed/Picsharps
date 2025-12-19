import React from "react";

const Spinner = ({ borderWidth = "4px", size = 35, className = "" }) => {
  const spinnerStyle = {
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size,
    borderWidth: borderWidth,
    borderStyle: "solid",
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderTopColor: "#00b0ff",
    borderRadius: "50%",
  };

  return (
    <div
      className={`animate-spin ${className}`}
      style={spinnerStyle}
      role="status"
      aria-label="جاري التحميل"
    />
  );
};

export default Spinner;
