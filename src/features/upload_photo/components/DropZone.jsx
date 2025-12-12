import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// Tools
import { enhanceImage } from "../tools/enhanceTool";
import { cartoonPhoto } from "../tools/cartoonTool";
import { flipImage } from "../tools/flipTool"; // ⚠️ إضافة هذا الاستيراد
import { TOOL_CONFIG } from "../config/toolConfig";

const DropZone = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // الحصول على اسم الأداة الحالية من المسار
  const currentTool =
    location.pathname.split("/").filter(Boolean)[0] ||
    location.pathname.replace("/", "");
  const toolConfig = TOOL_CONFIG[currentTool];

  // ================================
  // State
  // ================================
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [sourceImageId, setSourceImageId] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [status, setStatus] = useState(""); // "idle" | "uploading" | "processing" | "done" | "error"
  const [message, setMessage] = useState("");
  const [showDropZone, setShowDropZone] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({});

  // ================================
  // Initialize من localStorage
  // ================================
  useEffect(() => {
    const LS_KEY = `dropzone_last_result`;
    const FROM_TOOL_KEY = `came_from_tool`;

    // تنظيف أي بيانات قديمة للأداة الحالية
    localStorage.removeItem(`dropzone_last_result_${currentTool}`);

    const storedResult = localStorage.getItem(LS_KEY);
    const cameFromTool = localStorage.getItem(FROM_TOOL_KEY);

    console.log("Initialization:", { storedResult, cameFromTool, currentTool });

    if (cameFromTool && storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);

        // تأكد أننا جئنا من أداة مختلفة
        if (parsedResult.tool !== currentTool) {
          console.log("Loading from other tool:", parsedResult);

          // تعيين حالة كما لو تم رفع الصورة بنجاح
          setUploadedImageUrl(parsedResult.previewUrl);
          setSourceImageId(parsedResult.sourceImageId);
          setShowDropZone(false);
          setShowOptions(true);
          setStatus("done");
          setMessage("Loaded from previous tool ✅");
        } else {
          // إذا كنا في نفس الأداة، أعد التعيين العادي
          resetToInitialState();
        }

        // تنظيف المفاتيح بعد استخدامها
        localStorage.removeItem(FROM_TOOL_KEY);
        localStorage.removeItem(LS_KEY);
      } catch (err) {
        console.error("Error parsing stored result:", err);
        resetToInitialState();
      }
    } else {
      // حالة عادية - إعادة الضبط
      resetToInitialState();
    }

    // تهيئة الأوبشنز بالأعدادات الافتراضية
    if (toolConfig?.hasOptions) {
      const defaultOptions = {};
      Object.keys(toolConfig.options).forEach((key) => {
        defaultOptions[key] = toolConfig.options[key].default;
      });
      setOptions(defaultOptions);
    }
  }, [currentTool]);

  useEffect(() => {
    // ممنوع يشتغل لو مفيش صورة مرفوعة
    if (!uploadedImageUrl || !sourceImageId) return;

    // لو الأداة مفيهاش أوبشنز، يبقا مالناش دعوة
    if (!toolConfig?.hasOptions) return;

    // لو لسه مختارش قيمة
    if (Object.values(options).includes(null)) return;

    // ابدأ البروسيسنج بعد اختيار أوبشن
    processImage();
  }, [options]);

  // ================================
  // Reset functions
  // ================================
  const resetToInitialState = () => {
    setUploadedFile(null);
    setUploadedImageUrl(null);
    setSourceImageId(null);
    setProcessedImage(null);
    setStatus("");
    setMessage("");
    setShowDropZone(true);
    setShowOptions(false);

    if (toolConfig?.hasOptions) {
      const defaultOptions = {};
      Object.keys(toolConfig.options).forEach((key) => {
        defaultOptions[key] = toolConfig.options[key].default;
      });
      setOptions(defaultOptions);
    }
  };

  const resetComponent = () => {
    resetToInitialState();
    // تنظيف localStorage لهذه الأداة
    localStorage.removeItem(`dropzone_last_result`);
    localStorage.removeItem(`came_from_tool`);
  };

  // ================================
  // Handle dropped files - الرفع فقط
  // ================================
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploadedFile(file);
      setProcessedImage(null);
      setShowDropZone(false);

      const formData = new FormData();
      formData.append("image", file);

      try {
        setStatus("uploading");
        setMessage("Uploading image... ⏳");

        const uploadRes = await fetch(
          "https://picsharps-api.onrender.com/api/v1/image/upload",
          { method: "POST", body: formData }
        );

        const uploadData = await uploadRes.json();

        if (uploadData.status !== "success") {
          setStatus("error");
          setMessage(uploadData.message || "Upload failed ❌");
          toast.error(uploadData.message || "Upload failed");
          resetComponent();
          return;
        }

        const { sourceImageId, sourceUrl } = uploadData.data;

        setSourceImageId(sourceImageId);
        setUploadedImageUrl(sourceUrl);
        setStatus("done");
        setMessage("Image uploaded successfully! ✅");

        // إظهار الأوبشنز إذا كانت الأداة تحتوي عليها
        if (toolConfig?.hasOptions) {
          setShowOptions(true);
        }

        // إذا كانت الأداة بدون أوبشنز، لا تظهر زر START هنا
        // سنعتمد على الزر اليدوي
      } catch (err) {
        console.error("[DropZone] Upload Error:", err);
        setStatus("error");
        setMessage("Network error occurred ❌");
        toast.error("Network error occurred");
        resetComponent();
      }
    },
    [toolConfig]
  );

  // ================================
  // Process Image - المعالجة بعد الرفع
  // ================================
  const processImage = useCallback(async () => {
    if (!sourceImageId || !uploadedImageUrl) {
      toast.error("No image to process");
      return;
    }

    try {
      setStatus("processing");
      setMessage("Processing image... ⏳");
      setShowOptions(false);

      let toolResult = null;

      if (currentTool === "ai-image-enhancer") {
        // إرسال بدون format
        toolResult = await enhanceImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          upscaleFactor: options.upscaleFactor,
        });
      } else if (currentTool === "photo-to-cartoon") {
        toolResult = await cartoonPhoto({
          sourceImageId,
          imageUrl: uploadedImageUrl,
        });
      } else if (currentTool === "flip-image") {
        // ⚠️ إضافة هذا الشرط
        toolResult = await flipImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          direction: options.direction,
        });
      }

      if (toolResult) {
        setProcessedImage(toolResult.previewUrl);
        setStatus("done");
        setMessage("Image processed successfully! 🎉");
        setShowOptions(true);

        // حفظ النتيجة للانتقال لأدوات أخرى
        const resultData = {
          sourceImageId,
          previewUrl: toolResult.previewUrl,
          originalUrl: uploadedImageUrl,
          tool: currentTool,
        };
        localStorage.setItem(
          `dropzone_last_result`,
          JSON.stringify(resultData)
        );
      } else {
        throw new Error("Processing failed");
      }
    } catch (err) {
      console.error("[DropZone] Processing Error:", err);
      setStatus("error");
      setMessage("Processing failed ❌");
      toast.error("Processing failed");

      // إعادة إظهار الأوبشنز في حالة الخطأ
      if (toolConfig?.hasOptions) {
        setShowOptions(true);
      }
    }
  }, [sourceImageId, uploadedImageUrl, currentTool, options, toolConfig]);

  // ================================
  // Handle option change
  // ================================
  const handleOptionChange = (optionKey, value) => {
    const newOptions = { ...options, [optionKey]: value };
    setOptions(newOptions);
  };

  // ================================
  // Go to another tool
  // ================================
  const goToTool = (toolPath) => {
    if (!processedImage) {
      toast.error("No processed image to use");
      return;
    }

    console.log("Going to tool:", toolPath, "from:", currentTool);

    // حفظ flag للدخول التالي
    localStorage.setItem("came_from_tool", "true");

    // حفظ النتيجة للاستخدام في الأداة التالية
    const resultData = {
      sourceImageId,
      previewUrl: processedImage,
      originalUrl: uploadedImageUrl,
      tool: currentTool,
    };
    localStorage.setItem(`dropzone_last_result`, JSON.stringify(resultData));

    // الانتقال للأداة الجديدة
    navigate(`/${toolPath}`);
  };

  // ================================
  // Dropzone setup
  // ================================
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: status === "uploading" || status === "processing",
  });

  // ================================
  // Available Tools للانتقال
  // ================================
  const availableTools = Object.keys(TOOL_CONFIG)
    .filter((tool) => tool !== currentTool)
    .map((tool) => ({
      path: tool,
      label: TOOL_CONFIG[tool].name,
    }));

  // ================================
  // Render
  // ================================
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* DropZone - تظهر فقط في الحالة الأولى */}
      {showDropZone && (
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed rgba(0,0,0,0.3)",
            borderRadius: "20px",
            padding: "60px",
            textAlign: "center",
            cursor: "pointer",
            margin: "20px auto",
            backgroundColor: isDragActive ? "rgba(0,0,0,0.05)" : "transparent",
            transition: "all 0.3s ease",
          }}
          className="flex flex-col items-center w-full md:w-[90%] lg:w-[80%]"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p style={{ fontSize: "18px", color: "#666" }}>
              Drop the image here...
            </p>
          ) : (
            <>
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

              <h3 style={{ marginBottom: "10px", color: "#333" }}>
                Drag & Drop or Click to Upload
              </h3>
              <p style={{ color: "#666" }}>
                Supported formats: PNG, JPG, JPEG, WEBP
              </p>
              <p style={{ color: "#999" }}>Max size: 10MB</p>
            </>
          )}
        </div>
      )}

      {/* Uploading/Processing Status */}
      {(status === "uploading" || status === "processing") && (
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <div
            style={{
              width: "300px",
              height: "300px",
              margin: "0 auto",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            {status === "uploading" && uploadedFile && (
              <img
                src={URL.createObjectURL(uploadedFile)}
                alt="Uploading"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            )}
            {status === "processing" && uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="Processing"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  filter: "blur(2px)",
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "20px",
              }}
            >
              {status === "uploading" ? "Uploading..." : "Processing..."}
              <div
                style={{
                  marginTop: "10px",
                  width: "100%",
                  height: "3px",
                  background: "#ccc",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    height: "100%",
                    background: "#4CAF50",
                    animation: "loading 1.5s infinite",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <p style={{ marginTop: "15px", color: "#666" }}>{message}</p>
        </div>
      )}

      {/* Image Preview بعد الرفع */}
      {uploadedImageUrl &&
        status !== "uploading" &&
        status !== "processing" && (
          <div style={{ margin: "30px 0" }}>
            <div
              style={{
                display: "flex",
                gap: "30px",
                justifyContent: "center",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              {/* الصورة الأصلية */}
              <div style={{ textAlign: "center" }}>
                <h4 style={{ marginBottom: "10px", color: "#333" }}>
                  Original 🖼️
                </h4>
                <div
                  style={{
                    width: "300px",
                    height: "300px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={uploadedImageUrl}
                    alt="Original"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>

              {/* الصورة المعالجة */}
              {processedImage && (
                <div style={{ textAlign: "center" }}>
                  <h4 style={{ marginBottom: "10px", color: "#333" }}>
                    Processed ✅
                  </h4>
                  <div
                    style={{
                      width: "300px",
                      height: "300px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={processedImage}
                      alt="Processed"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Options للأدوات التي تحتويها */}
      {/* Options للأدوات التي تحتويها */}

      {/* Options للأدوات التي تحتويها - Radio Buttons */}
      {showOptions && toolConfig?.hasOptions && (
        <div
          style={{
            background: "#f8f9fa",
            padding: "30px",
            borderRadius: "10px",
            margin: "20px 0",
            border: "1px solid #e9ecef",
            textAlign: "center",
          }}
        >
          <h4 style={{ marginBottom: "20px", color: "#333" }}>
            {currentTool === "ai-image-enhancer"
              ? "Choose enhancement level"
              : "Choose flip direction"}
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            {currentTool === "ai-image-enhancer"
              ? /* Options for Enhance */
                toolConfig.options.upscaleFactor.values.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="upscaleFactor"
                      value={option.value}
                      checked={options.upscaleFactor === option.value}
                      onChange={(e) =>
                        handleOptionChange(
                          "upscaleFactor",
                          parseInt(e.target.value)
                        )
                      }
                      disabled={status === "processing"}
                      style={{ marginRight: "10px", cursor: "pointer" }}
                    />
                    <span style={{ fontWeight: "500", color: "#333" }}>
                      {option.label}
                    </span>
                  </label>
                ))
              : /* Options for Flip */
                toolConfig.options.direction.values.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="direction"
                      value={option.value}
                      checked={options.direction === option.value}
                      onChange={(e) =>
                        handleOptionChange("direction", e.target.value)
                      }
                      disabled={status === "processing"}
                      style={{ marginRight: "10px", cursor: "pointer" }}
                    />
                    <span style={{ fontWeight: "500", color: "#333" }}>
                      {option.label}
                    </span>
                  </label>
                ))}
          </div>
          <p style={{ marginTop: "15px", color: "#666", fontSize: "14px" }}>
            Select an option to start processing
          </p>
        </div>
      )}

      {/* زر Start للأدوات بدون أوبشنز - يظهر فقط بعد الرفع وقبل المعالجة */}
      {uploadedImageUrl &&
        toolConfig &&
        !toolConfig.hasOptions &&
        !processedImage &&
        status !== "processing" && (
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <button
              onClick={processImage}
              disabled={status === "processing"}
              style={{
                padding: "12px 30px",
                fontSize: "16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            >
              Start Processing
            </button>
          </div>
        )}

      {/* Status Message */}
      {status && status !== "uploading" && status !== "processing" && (
        <div
          style={{
            textAlign: "center",
            margin: "20px 0",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: status === "error" ? "#f8d7da" : "#d4edda",
            color: status === "error" ? "#721c24" : "#155724",
            border: `1px solid ${status === "error" ? "#f5c6cb" : "#c3e6cb"}`,
          }}
        >
          {message}
        </div>
      )}

      {/* Actions بعد المعالجة فقط - المشكلة 1 */}
      {status === "done" && processedImage && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          {/* Dropdown للانتقال لأدوات أخرى */}
          {availableTools.length > 0 && (
            <div style={{ textAlign: "center" }}>
              <p style={{ marginBottom: "10px", color: "#666" }}>
                Process this result with another tool:
              </p>
              <select
                onChange={(e) => goToTool(e.target.value)}
                defaultValue=""
                style={{
                  padding: "8px 15px",
                  borderRadius: "5px",
                  border: "1px solid #ced4da",
                  minWidth: "250px",
                }}
              >
                <option value="" disabled>
                  Select tool...
                </option>
                {availableTools.map((tool) => (
                  <option key={tool.path} value={tool.path}>
                    {tool.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* زر إعادة الاستخدام - يظهر في كل الحالات */}
          <div>
            <button
              onClick={resetComponent}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Use another photo with this tool 🔄
            </button>
          </div>
        </div>
      )}

      {/* زر Use another photo يظهر في حالة الخطأ */}
      {status === "error" && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={resetComponent}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Use another photo with this tool 🔄
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
};

export default DropZone;
