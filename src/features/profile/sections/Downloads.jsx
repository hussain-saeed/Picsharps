import React, { useState } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

const Downloads = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
        <div className="text-gray-500 text-xl font-semibold">No images yet!</div>
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
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 gap-6 mb-8">
        {currentImages.map((image) => (
          <div
            key={image.id}
            className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: "rgba(221, 244, 255, 1)" }}
            onClick={() => window.open(image.resultUrl, "_blank")}
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={image.thumbnailUrl}
                alt={image.tool.name}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(141deg, #00b0ff 0%, #00c853 62.41%)",
                }}
                title={image.tool.name}
              >
                {truncateText(image.tool.name, 15)}
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex flex-col">
                  <span className="text-gray-600 text-xs mb-1">Size</span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {formatSize(image.sizeBytes)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-xs mb-1">
                    Created Date
                  </span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {formatDate(image.createdAt)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-xs mb-1">
                    Expiry Date
                  </span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {formatDate(image.expiresAt)}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(image.resultUrl, `image-${image.id}.jpg`);
                }}
                className="w-full py-2 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{
                  background:
                    "linear-gradient(141deg, #00c853 0%, #00b0ff 62.41%)",
                }}
              >
                <Download size={18} />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{
              background:
                currentPage === 1
                  ? "#ccc"
                  : "linear-gradient(141deg, #00c853 0%, #00b0ff 62.41%)",
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className="w-10 h-10 rounded-lg font-semibold text-white cursor-pointer transition-all"
              style={{
                background:
                  currentPage === idx + 1
                    ? "linear-gradient(141deg, #00c853 0%, #00b0ff 62.41%)"
                    : "linear-gradient(141deg, #00b0ff 0%, #00c853 62.41%)",
                opacity: currentPage === idx + 1 ? 1 : 0.6,
              }}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{
              background:
                currentPage === totalPages
                  ? "#ccc"
                  : "linear-gradient(141deg, #00c853 0%, #00b0ff 62.41%)",
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Downloads;
