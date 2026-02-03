export const LoadingDots = ({
  className = "",
  loadingSize = "1rem",
  loadingWeight = "normal",
  dotsSize = "1.5rem",
  dotsWeight = "bold",
}) => {
  return (
    <div className={className}>
      <style>{`
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .dot {
          animation: blink 0.8s infinite;
          margin: 0 2px;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <span
        style={{
          fontSize: loadingSize,
          fontWeight: loadingWeight,
          verticalAlign: "middle",
        }}
        className="flex items-center gap-2"
      >
        Loading
        <div className="mb-2">
          <span
            className="dot"
            style={{
              fontSize: dotsSize,
              fontWeight: dotsWeight,
            }}
          >
            .
          </span>
          <span
            className="dot"
            style={{
              fontSize: dotsSize,
              fontWeight: dotsWeight,
            }}
          >
            .
          </span>
          <span
            className="dot"
            style={{
              fontSize: dotsSize,
              fontWeight: dotsWeight,
            }}
          >
            .
          </span>
        </div>
      </span>
    </div>
  );
};
