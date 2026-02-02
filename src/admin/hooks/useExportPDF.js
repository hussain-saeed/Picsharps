import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

const useExportPDF = () => {
  const downloadPDF = async (ref) => {
    if (ref.current === null) return;

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      window.open(pdf.output("bloburl"), "_blank");
    } catch (err) {
      console.error("oops, something went wrong!", err);
    }
  };

  return { downloadPDF };
};

export default useExportPDF;
