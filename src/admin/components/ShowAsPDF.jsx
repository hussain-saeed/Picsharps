import { ImFilePdf } from "react-icons/im";

function ShowAsPDF({ onClick, breakP = "sm" }) {
  return (
    <>
      <button
        style={{ background: "var(--gradient-color)" }}
        onClick={onClick}
        className={`text-white absolute bottom-7 font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 z-21 ${breakP}:hidden`}
      >
        <span>Show as PDF</span>
        <ImFilePdf style={{ fontSize: "24px" }} />
      </button>
      <div
        className={`block ${breakP}:hidden absolute min-w-[2000px] h-full z-20 -left-10 bg-black/50 backdrop-blur-sm border-white/10`}
      ></div>
    </>
  );
}

export default ShowAsPDF;
