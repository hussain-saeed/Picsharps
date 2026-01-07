import { useEffect, useRef, useState, useContext } from "react";
import { Slider } from "@mui/material";
import { LanguageContext } from "/src/context/LanguageContext";

export const OptionSlider = ({
  label,
  value,
  min,
  max,
  step,
  disabled,
  onCommitChange,
}) => {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
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
    }, 1200);
  };

  const getDisplayValue = (val) => (isRTL ? max + min - val : val);

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
        <span style={{ fontSize: "13px", color: "#666" }}>{getDisplayValue(tempValue)}</span>
      </div>

      <Slider
        value={getDisplayValue(tempValue)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={handleChange}
        sx={{
          height: 6,
          transform: isRTL ? "rotate(180deg)" : "none",
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
