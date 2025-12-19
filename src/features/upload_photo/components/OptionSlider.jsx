import { useEffect, useRef, useState } from "react";
import { Slider } from "@mui/material";

export const OptionSlider = ({
  label,
  value,
  min,
  max,
  step,
  disabled,
  onCommitChange,
}) => {
  const [tempValue, setTempValue] = useState(value);
  const lastValueRef = useRef(value);
  const timerRef = useRef(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleChange = (_, newValue) => {
    setTempValue(newValue);

    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Set new timer
    timerRef.current = setTimeout(() => {
      if (lastValueRef.current !== newValue) {
        lastValueRef.current = newValue;
        onCommitChange(newValue); 
      }
    }, 1000);
  };

  return (
    <div style={{ paddingLeft: "14px", paddingRight: "14px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "40px",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "13px", color: "#666" }}>{tempValue}</span>
      </div>

      <Slider
        value={tempValue}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={handleChange}
        sx={{
          height: 6,

          "& .MuiSlider-track": {
            background: "var(--gradient-color)",
            border: "none",
          },

          "& .MuiSlider-thumb": {
            backgroundColor: "#fff",
            border: "2px solid #00b0ff",
          },

          "& .MuiSlider-rail": {
            opacity: 0.3,
            backgroundColor: "#ccc",
          },
        }}
      />
    </div>
  );
};
