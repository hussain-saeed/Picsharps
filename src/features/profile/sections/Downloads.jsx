import { useContext, useState } from "react";
import { LanguageContext } from "/src/context/LanguageContext";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import French from "/src/i18n/french.json";
import Portuguese from "/src/i18n/portuguese.json";
import Spanish from "/src/i18n/spanish.json";
import Hindi from "/src/i18n/hindi.json";
import Indonesian from "/src/i18n/indonesian.json";

const translations = {
  English,
  Arabic,
  French,
  Portuguese,
  Spanish,
  Hindi,
  Indonesian,
};

const Downloads = ({ data }) => {
  const { language, direction } = useContext(LanguageContext);
  const t = translations[language] || translations["English"];
  const isRTL = direction === "rtl";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [isDownloading, setIsDownloading] = useState(null);

  const fixScroll = function () {
    window.scrollTo({
      top: 275,
      behavior: "smooth",
    });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const images = data?.data?.profile?.processedImages || [];

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500 text-xl font-semibold">
          No images yet!
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = images.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      toast.error(t["Something Went Wrong!"]);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 gap-6 mb-8">
        {currentImages.map((image) => (
          <div
            key={image.id}
            className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform"
            style={{ backgroundColor: "rgba(221, 244, 255, 1)" }}
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={image.thumbnailUrl}
                alt={image.tool.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.open(image.resultUrl, "_blank")}
              />
              <div
                className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(141deg, #00b0ff 0%, #00c853 62.41%)",
                }}
                dir="ltr"
                title={image.tool.name}
              >
                {truncateText(image.tool.name, 15)}
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex flex-col">
                  <span className="text-gray-600 text-xs mb-1">
                    {t["Size"]}
                  </span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {formatSize(image.sizeBytes)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-xs mb-1">
                    {t["Created Date"]}
                  </span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {formatDate(image.createdAt)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-xs mb-1">
                    {t["Expiry Date"]}
                  </span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {formatDate(image.expiresAt)}
                  </span>
                </div>
              </div>

              <button
                key={image.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDownloading) return;

                  setIsDownloading(image.id);
                  handleDownload(image.resultUrl, `image-${image.id}.jpg`);
                }}
                className="w-full py-2 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-opacity"
                style={{
                  background:
                    "linear-gradient(141deg, #00c853 0%, #00b0ff 62.41%)",
                  cursor: isDownloading ? "not-allowed" : "pointer",
                  opacity: isDownloading === image.id ? 0.5 : 1,
                }}
                disabled={!!isDownloading === image.id}
              >
                {isDownloading === image.id ? (
                  t["Loading ..."]
                ) : (
                  <>
                    <Download size={18} />
                    <span>{t["Download"]}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
              fixScroll();
            }}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{
              background: "var(--gradient-color)",
              opacity: currentPage === 1 ? "0.5" : "1",
            }}
          >
            {isRTL ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>

          <button
            onClick={() => {
              setCurrentPage((prev) => Math.min(totalPages, prev + 1));
              fixScroll();
            }}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{
              background: "var(--gradient-color-2)",
              opacity: currentPage === totalPages ? "0.5" : "1",
            }}
          >
            {isRTL ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default Downloads;
