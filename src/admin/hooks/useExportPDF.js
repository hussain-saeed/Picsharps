import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

const useExportPDF = () => {
  const downloadPDF = async (ref) => {
    if (ref.current === null) return;

    try {
      // تحويل الـ HTML لصورة PNG
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        backgroundColor: "#ffffff", // نضمن خلفية بيضاء
      });

      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // إضافة الصورة للـ PDF
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      // فتح في نافذة جديدة
      window.open(pdf.output("bloburl"), "_blank");
    } catch (err) {
      console.error("oops, something went wrong!", err);
    }
  };

  return { downloadPDF };
};

export default useExportPDF;
