import React, { useState, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Play } from "lucide-react";
import Spinner from "../../../components/Spinner";
import { BACKEND_URL } from "../../../api";
import { useAuth } from "../../auth/AuthProvider";
import { Download } from "lucide-react";
import { LanguageContext } from "/src/context/LanguageContext";
import { toast } from "react-toastify";

import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
const translations = { English, Arabic };

const templates = [
  {
    slotCount: 3,
    entities: [
      { id: "sidebar-3", preview: "/images/3-1.png" },
      { id: "columns-3", preview: "/images/3-2.png" },
    ],
  },
  {
    slotCount: 4,
    entities: [
      { id: "grid-4", preview: "/images/4-1.png" },
      { id: "header-4", preview: "/images/4-2.png" },
    ],
  },
  {
    slotCount: 5,
    entities: [
      { id: "classic-5", preview: "/images/5-1.png" },
      { id: "center-focus-5", preview: "/images/5-2.png" },
    ],
  },
  { slotCount: 6, entities: [{ id: "grid-6", preview: "/images/6-1.png" }] },
];

const CollageMaker = () => {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  const [selectedSlotCount, setSelectedSlotCount] = useState(
    templates[0].slotCount
  );
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const { accessToken } = useAuth();

  const currentTemplates = templates.find(
    (t) => t.slotCount === selectedSlotCount
  );

  const handleSlotCountChange = (e) => {
    const newCount = parseInt(e.target.value);
    setSelectedSlotCount(newCount);
    setSelectedTemplate(null);
    setUploadedImages([]);
    setResultImage(null);
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setUploadedImages([]);
    setResultImage(null);
  };

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0].code === "file-too-large") {
          return;
        }
        if (rejection.errors[0].code === "file-invalid-type") {
          return;
        }
      }

      const remainingSlots = selectedSlotCount - uploadedImages.length;

      if (acceptedFiles.length > remainingSlots) {
        return;
      }

      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
      }));

      setUploadedImages((prev) => [...prev, ...newImages]);
    },
    [uploadedImages, selectedSlotCount]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024,
    disabled:
      !selectedTemplate ||
      uploadedImages.length >= selectedSlotCount ||
      isProcessing,
  });

  const removeImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleStartProcess = async () => {
    if (uploadedImages.length !== selectedSlotCount) {
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      uploadedImages.forEach((img, index) => {
        formData.append(`image${index + 1}`, img.file);
      });

      const res = await fetch(
        `${BACKEND_URL}/image/collage/${selectedTemplate}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setResultImage(data.data.result.collageUrl);
      } else {
        toast.error(data.message || "Unexpected error occurred!");
      }
    } catch (err) {
      toast.error(
        "Unexpected error occurred! Make sure your internet connection is stable."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const canUpload =
    selectedTemplate && uploadedImages.length < selectedSlotCount;
  const canProcess =
    uploadedImages.length === selectedSlotCount && !isProcessing;

  const downloadImage = async (url, filename = "processed-image.png") => {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  };

  const saveResult = async () => {
    try {
      // Download locally
      await downloadImage(resultImage, `create-collage-result.png`);
    } catch (err) {
      console.error("Download or saving error:", err);
    }
  };

  return (
    <div className="">
      {/* Slot Count Dropdown */}
      <FormControl
        size="small"
        disabled={isProcessing}
        sx={{
          minWidth: 260,
          marginBottom: "50px",
          direction: isRTL ? "rtl" : "ltr",
          "& *": {
            fontFamily: "inherit !important",
          },
          "& .MuiInputLabel-root": {
            right: isRTL ? -65 : "auto",
            transformOrigin: isRTL ? "right" : "left",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            textAlign: isRTL ? "right" : "left",
          },
          "& .MuiSelect-icon": {
            right: isRTL ? "unset" : "7px",
            left: isRTL ? "7px" : "unset",
          },
        }}
      >
        <InputLabel id="slot-count-label">{t["Number of Photos"]}</InputLabel>
        <Select
          labelId="slot-count-label"
          value={selectedSlotCount}
          label={t["Number of Photos"]}
          onChange={handleSlotCountChange}
          MenuProps={{
            dir: isRTL ? "rtl" : "ltr",
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root": {
                  fontFamily: "inherit",
                },
              },
            },
          }}
        >
          {templates.map((temp) => (
            <MenuItem key={temp.slotCount} value={temp.slotCount}>
              {temp.slotCount} {t["Photos"]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Template Previews */}
      <div className="mb-12">
        <h2
          className="text-lg font-semibold mb-6 text-gray-700"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t["Choose the template you want!"]}
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {currentTemplates?.entities.map((entity) => (
            <div
              key={entity.id}
              onClick={() => !isProcessing && handleTemplateSelect(entity.id)}
              className={`relative overflow-hidden rounded-xl border transition-all cursor-pointer
                ${
                  selectedTemplate === entity.id
                    ? "border-blue-400 ring-4 ring-blue-200"
                    : "border-gray-200 hover:shadow-md"
                }
              `}
              style={{
                aspectRatio: "1240 / 940",
                width: "calc(100% / 1 - 20px)",
                maxWidth: "420px",
                flex: "1 1 300px",
              }}
            >
              <img
                src={entity.preview}
                alt={`template-${entity.id}`}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />

              <div
                className={`${isProcessing ? "cursor-not-allowed" : ""}
                  absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity`}
              />

              {selectedTemplate === entity.id ? (
                <div
                  className="absolute inset-0 opacity-100 transition-opacity"
                  style={{ background: "oklch(0.88 0.06 254.13 / 0.4)" }}
                />
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload Button */}
      {selectedTemplate && (
        <div className="mb-10">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-14 text-center transition-all w-full md:w-[90%] lg:w-[80%] mx-auto ${
              canUpload && !isProcessing
                ? isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white hover:border-blue-400 cursor-pointer"
                : "border-gray-300 cursor-not-allowed opacity-80"
            }`}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center">
              <div
                style={{
                  backgroundColor: "rgba(195, 231, 249, 1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "15px",
                  padding: "15px",
                  borderRadius: "50%",
                }}
              >
                <img src="/images/upload.png" alt="Upload icon" />
              </div>
              <div className="text-gray-600">
                {uploadedImages.length >= selectedSlotCount ? (
                  <p>{t["All Required Images Have Been Uploaded"]}</p>
                ) : (
                  <>
                    <h3 style={{ marginBottom: "10px", color: "#333" }}>
                      {t["Drag & Drop or Click to Upload"]}
                    </h3>
                    <p style={{ color: "#666" }} dir={isRTL ? "rtl" : "ltr"}>
                      {t["Supported formats: PNG, JPG, JPEG, WEBP"]}
                    </p>
                    <p style={{ color: "#999", marginBottom: "20px" }}>
                      {t["Max size: 10MB"]}
                    </p>
                    <p style={{ color: "#666" }}>
                      {t["Uploaded"]} {uploadedImages.length} {t["Photos of"]}{" "}
                      {selectedSlotCount}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="mb-10">
          <div
            className="flex flex-wrap gap-4 justify-center"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {uploadedImages.map((img) => (
              <div
                key={img.id}
                className="relative w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(25%-1rem)] lg:w-[calc(20%-1rem)] aspect-square"
              >
                <div className="w-full h-full rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={img.preview}
                    alt="uploaded"
                    className="w-full h-full object-cover"
                  />
                </div>
                {!isProcessing ? (
                  <button
                    onClick={() => removeImage(img.id)}
                    className="cursor-pointer absolute -top-2 -right-2 w-8 h-8 text-white rounded-full flex items-center justify-center shadow-lg text-sm"
                    style={{ backgroundColor: "#ff2828", opacity: "0.95" }}
                  >
                    X
                  </button>
                ) : (
                  <button
                    className="cursor-not-allowed absolute -top-2 -right-2 w-8 h-8 text-white rounded-full flex items-center justify-center shadow-lg text-sm"
                    style={{ backgroundColor: "#ff2828", opacity: "0.95" }}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Process Button */}
      {selectedTemplate && (
        <div
          className="mb-14 flex justify-center items-center gap-3"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <button
            onClick={handleStartProcess}
            disabled={!canProcess}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium text-white transition-all flex gap-2 ${
              canProcess
                ? "bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {!isProcessing && isRTL ? (
              <Play style={{ transform: "rotate(180deg)" }} />
            ) : !isProcessing && !isRTL ? (
              <Play />
            ) : (
              ""
            )}
            {isProcessing ? t["Processing ..."] : t["Start"]}
          </button>
          {isProcessing && <Spinner />}
        </div>
      )}

      {/* Result */}
      {resultImage && !isProcessing && (
        <div>
          <div className="bg-white rounded-2xl p-1 inline-block overflow-hidden">
            <img
              src={resultImage}
              alt="collage result"
              className="max-w-full h-auto"
              style={{ maxHeight: "500px" }}
            />
          </div>
          {accessToken ? (
            <button
              dir={isRTL ? "rtl" : "ltr"}
              onClick={() => saveResult()}
              style={{
                padding: "10px 18px",
                background: "var(--gradient-color)",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "15px",
                fontWeight: 500,
              }}
              className="mt-8 mx-auto"
            >
              <Download size={18} />
              {t["Download Result"]}
            </button>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default CollageMaker;
