export default function Loader({ className, style }) {
  return (
    <div
      className={`w-full flex items-center justify-center ${className}`}
      style={{ minHeight: "400px", ...style }}
    >
      <style>{`
        .loader-wrapper {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-container {
          position: relative;
          width: 200px;
          height: 200px;
          filter: url("#goo");
          animation: rotate-move 2s ease-in-out infinite;
        }

        .loader-dot {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -35px;
          margin-left: -35px;
        }

        .loader-dot-3 {
  background: linear-gradient(45deg, #00b0ff, #00c853);
          animation: dot-3-move 2s ease infinite, index 6s ease infinite;
        }

        .loader-dot-2 {
  background: linear-gradient(45deg, #00c853, #00b0ff);
          animation: dot-2-move 2s ease infinite, index 6s -4s ease infinite;
        }

        .loader-dot-1 {
  background: linear-gradient(45deg, #00b0ff, #00c853);
          animation: dot-1-move 2s ease infinite, index 6s -2s ease infinite;
        }

        @keyframes dot-3-move {
          20% { transform: scale(1); }
          45% { transform: translateY(-18px) scale(.45); }
          60% { transform: translateY(-90px) scale(.45); }
          80% { transform: translateY(-90px) scale(.45); }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes dot-2-move {
          20% { transform: scale(1); }
          45% { transform: translate(-16px, 12px) scale(.45); }
          60% { transform: translate(-80px, 60px) scale(.45); }
          80% { transform: translate(-80px, 60px) scale(.45); }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes dot-1-move {
          20% { transform: scale(1); }
          45% { transform: translate(16px, 12px) scale(.45); }
          60% { transform: translate(80px, 60px) scale(.45); }
          80% { transform: translate(80px, 60px) scale(.45); }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes rotate-move {
          55% { transform: rotate(0deg); }
          80% { transform: rotate(360deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes index {
          0%, 100% { z-index: 3; }
          33.3% { z-index: 2; }
          66.6% { z-index: 1; }
        }
      `}</style>

      <div className="loader-wrapper">
        <div className="loader-container">
          <div className="loader-dot loader-dot-1"></div>
          <div className="loader-dot loader-dot-2"></div>
          <div className="loader-dot loader-dot-3"></div>
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 21 -7"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
