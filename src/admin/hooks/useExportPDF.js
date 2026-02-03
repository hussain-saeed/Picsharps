import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { useState } from "react";
import { toast } from "react-toastify";

const useExportPDF = () => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadPDF = async (ref) => {
    if (!ref?.current) return;

    try {
      setIsLoading(true);

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
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadPDF, isLoading };
};

export default useExportPDF;
