import { useState, useEffect, useRef } from "react";
import { Download, RefreshCw, Eraser } from "lucide-react";

const COMPONENT_STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  PROCESSING: "processing",
  DONE: "done",
  ERROR: "error",
};

const ObjectRemovalTool = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  // State declarations
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [sourceImageId, setSourceImageId] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [toolKey, setToolKey] = useState(null);
  const [status, setStatus] = useState(COMPONENT_STATES.IDLE);
  const [showOptions, setShowOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  });


  const resetToInitialState = () => {
    setUploadedFile(null);
    setUploadedImageUrl(null);
    setSourceImageId(null);
    setProcessedImage(null);
    setToolKey(null);
    setStatus(COMPONENT_STATES.IDLE);
    setShowOptions(false);
    setBrushSize(20);
    setErrorMessage("");

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size must be less than 10MB");
      return;
    }

    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploadedFile(file);
    setProcessedImage(null);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setStatus(COMPONENT_STATES.UPLOADING);

      const uploadRes = await fetch(
        "https://picsharps-api.onrender.com/api/v1/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (uploadData.status !== "success") {
        setStatus(COMPONENT_STATES.ERROR);
        setErrorMessage(uploadData.message || "Upload failed");
        return;
      }

      const { sourceImageId, sourceUrl } = uploadData.data;

      setSourceImageId(sourceImageId);
      setUploadedImageUrl(sourceUrl);
      setStatus(COMPONENT_STATES.DONE);
      setShowOptions(true);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus(COMPONENT_STATES.ERROR);
      setErrorMessage("Network error occurred");
    }
  };

  const handleImageLoad = (e) => {
    const img = e.target;

    setImageSize({
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    });

    if (canvasRef.current) {
      canvasRef.current.width = img.width;
      canvasRef.current.height = img.height;

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, img.width, img.height);
    }
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    drawCircle(pos.x, pos.y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    drawCircle(pos.x, pos.y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawCircle = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const processImage = async () => {
    if (!sourceImageId || !uploadedImageUrl) {
      setErrorMessage("Please upload an image first");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasDrawing = imageData.data.some(
      (pixel, i) => pixel !== 0 && (i + 1) % 4 !== 0
    ); // Ignore alpha

    if (!hasDrawing) {
      setErrorMessage("Please mark the object you want to remove");
      return;
    }

    try {
      setStatus(COMPONENT_STATES.PROCESSING);
      setShowOptions(false);
      setErrorMessage("");

      // Create mask blob from current canvas
      const maskBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      // Scale mask to original image size
      const img = imageRef.current;
      const scaleX = imageSize.naturalWidth / imageSize.width;
      const scaleY = imageSize.naturalHeight / imageSize.height;

      const scaledCanvas = document.createElement("canvas");
      scaledCanvas.width = imageSize.naturalWidth;
      scaledCanvas.height = imageSize.naturalHeight;
      const scaledCtx = scaledCanvas.getContext("2d");

      scaledCtx.scale(scaleX, scaleY);
      scaledCtx.drawImage(canvas, 0, 0);

      const scaledMaskBlob = await new Promise((resolve) => {
        scaledCanvas.toBlob(resolve, "image/png");
      });

      const formData = new FormData();
      formData.append("mask", scaledMaskBlob, "mask.png");
      formData.append("sourceImageId", sourceImageId);
      formData.append("imageUrl", uploadedImageUrl);

      const res = await fetch(
        `https://picsharps-api.onrender.com/api/v1/image/object-removal`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Object removal failed");
      }

      setProcessedImage(data.data.previewUrl);
      setToolKey(data.data.toolKey);
      setStatus(COMPONENT_STATES.DONE);
      setShowOptions(true);
    } catch (error) {
      console.error("Processing error:", error);
      setStatus(COMPONENT_STATES.ERROR);
      setErrorMessage(error.message || "Processing failed. Please try again.");
      setShowOptions(true);
    }
  };

  const downloadImage = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "object-removal-result.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
      setErrorMessage("Failed to download image");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        Object Removal Tool
      </h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
        Mark objects you want to remove and AI will fill in the background
        naturally
      </p>

      {errorMessage && (
        <div
          style={{
            background: "#fee",
            border: "1px solid #fcc",
            color: "#c33",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* باقي الـ UI بدون تغيير كبير */}
      {status === COMPONENT_STATES.IDLE && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed #ccc",
              borderRadius: "10px",
              padding: "60px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: "#fafafa",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f8ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fafafa")}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>📁</div>
            <p
              style={{
                fontSize: "18px",
                fontWeight: "500",
                marginBottom: "10px",
              }}
            >
              Click to Upload Image
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Supported formats: PNG, JPG, JPEG, WEBP
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>Max size: 10MB</p>
          </div>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        {/* ... باقي الـ JSX كما هو (Uploading, Drawing, Processing, Result) ... */}
        {/* لم أعدل الجزء البصري لأنه يعمل بشكل جيد، لكن المنطق الرئيسي تم إصلاحه أعلاه */}

        {uploadedImageUrl &&
          status !== COMPONENT_STATES.UPLOADING &&
          status !== COMPONENT_STATES.PROCESSING && (
            <>
              <div style={{ marginBottom: "30px" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "15px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  MARK OBJECT TO REMOVE (Draw with mouse)
                </h3>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    display: "inline-block",
                    background: "#000",
                    borderRadius: "10px",
                    overflow: "hidden",
                    userSelect: "none",
                  }}
                >
                  <img
                    ref={imageRef}
                    src={uploadedImageUrl}
                    alt="Original"
                    onLoad={handleImageLoad}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "600px",
                      width: "auto",
                      height: "auto",
                      display: "block",
                      pointerEvents: "none",
                    }}
                  />

                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      cursor: "crosshair",
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    gap: "15px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flex: "1",
                      minWidth: "250px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Brush Size:
                    </span>
                    <input
                      type="range"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      min={5}
                      max={100}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: "14px", minWidth: "40px" }}>
                      {brushSize}px
                    </span>
                  </div>
                  <button
                    onClick={clearCanvas}
                    style={{
                      padding: "8px 16px",
                      background: "#ff9800",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    <Eraser size={18} />
                    Clear Mask
                  </button>
                </div>
              </div>

              {showOptions && (
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "25px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <button
                    onClick={processImage}
                    style={{
                      marginTop: "20px",
                      width: "100%",
                      padding: "12px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    🚀 Start Processing
                  </button>
                </div>
              )}

              {/* باقي الأزرار والنتيجة كما هي */}
              {/* ... */}
            </>
          )}

        {/* حالات Uploading و Processing و Result كما في الكود الأصلي */}
        {/* لتوفير المساحة، لم أكررها هنا، لكنها تبقى كما هي تمامًا */}

        {processedImage && (
          <>
            <div style={{ marginBottom: "30px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#666",
                  marginBottom: "15px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                RESULT
              </h3>
              <img
                src={processedImage}
                alt="Processed"
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={downloadImage}
                style={{
                  padding: "10px 18px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              >
                <Download size={18} />
                Download Result
              </button>

              <button
                onClick={resetToInitialState}
                style={{
                  padding: "10px 18px",
                  background: "#f44336",
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
              >
                <RefreshCw size={18} />
                Process New Image
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ObjectRemovalTool;
