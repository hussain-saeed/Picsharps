import { useEffect, useRef, useState } from "react";

export default function ImageCompare({
  hasBorder,
  before,
  after,
  autoAnimate = true,
  allowDragOnHover = true,
  containerClassName = "",
  aspectRatio = "16/9",
  fit = "contain",
  beforeClassName = "",
  afterClassName = "",
  loading,
}) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(20);
  const [, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const animRef = useRef(null);
  const directionRef = useRef(1);

  const animate = () => {
    setPos((prev) => {
      let next = prev + 0.4 * directionRef.current;
      if (next >= 100) directionRef.current = -1;
      if (next <= 0) directionRef.current = 1;
      return next;
    });
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (autoAnimate) animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [autoAnimate]);

  const handleHoverStart = () => {
    if (allowDragOnHover) {
      cancelAnimationFrame(animRef.current);
      setIsHover(true);
    }
  };

  const handleHoverEnd = () => {
    if (allowDragOnHover) {
      setIsHover(false);
      if (autoAnimate && !isDragging)
        animRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    let percent = ((x - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setPos(percent);
  };

  const startDrag = () => {
    setIsDragging(true);
    cancelAnimationFrame(animRef.current);
  };

  const stopDrag = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none rounded-[25px] ${containerClassName}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      onTouchStart={handleHoverStart}
      onTouchEnd={handleHoverEnd}
      style={{
        aspectRatio: aspectRatio,
        border: hasBorder === true ? "5px solid white" : "",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <img
        src={before}
        className={`w-full h-full bg-[#f9f9f9] object-${fit} ${beforeClassName}`}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={after}
          className={`absolute inset-0 w-full h-full bg-[#f9f9f9] object-${fit} ${afterClassName}`}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 left-0 w-1 bg-[#f9f9f9] border border-gray-300"
        style={{
          left: `${pos}%`,
          transform: "translateX(-50%)",
          cursor: loading ? "default" : "col-resize",
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ border: "2px solid white" }}
        >
          <span className="text-white font-bold text-lg">↔</span>
        </div>
      </div>
    </div>
  );
}
