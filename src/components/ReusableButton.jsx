import React from "react";

const ReusableButton = ({
  text,
  onClick,
  position = "right",
  type = "button",
  customStyles = {},
}) => {
  const getContainerStyle = () => {
    switch (position) {
      case "left":
        return { textAlign: "left", display: "block" };
      case "center":
        return { textAlign: "center", display: "block" };
      case "right":
      default:
        return { textAlign: "right", display: "block" };
    }
  };

  const buttonStyle = {
    display: "inline-block",
    padding: "12px 24px",
    background: "var(--gradient-color-2)",
    color: "white",
    border: "none",
    borderRadius: "15px",
    fontWeight: "600",
    cursor: "pointer",
    ...customStyles,
  };

  return (
    <div style={getContainerStyle()}>
      <button
        type={type}
        onClick={onClick}
        style={buttonStyle}
      >
        {text}
      </button>
    </div>
  );
};

export default ReusableButton;
