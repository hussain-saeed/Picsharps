import { useState, useRef, useEffect } from "react";
import { Download, RefreshCw, Eraser, Play, Box } from "lucide-react";
import { OptionSlider } from "./OptionSlider";
import ImageCompare from "../../../components/ImageCompare";
import { useAuth } from "../../auth/AuthProvider";
import { TOOL_CONFIG } from "../config/toolConfig";
import { BACKEND_URL } from "../../../api";
import { useScrollToVH } from "../../../hooks/useScrollToVH";

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
  const { accessToken } = useAuth();

  // State declarations
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [sourceImageId, setSourceImageId] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [toolKey, setToolKey] = useState(null);
  const [status, setStatus] = useState(COMPONENT_STATES.IDLE);
  const scrollToVH = useScrollToVH();

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
    scrollToVH(5);

    setUploadedFile(null);
    setUploadedImageUrl(null);
    setSourceImageId(null);
    setProcessedImage(null);
    setToolKey(null);
    setStatus(COMPONENT_STATES.IDLE);
    setBrushSize(20);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploadedFile(file);
    setProcessedImage(null);

    const formData = new FormData();
    formData.append("image", file);
    scrollToVH(30);

    try {
      setStatus(COMPONENT_STATES.UPLOADING);

      const uploadRes = await fetch(`${BACKEND_URL}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (uploadData.status !== "success") {
        setStatus(COMPONENT_STATES.ERROR);
        return;
      }

      const { sourceImageId, sourceUrl } = uploadData.data;

      setSourceImageId(sourceImageId);
      setUploadedImageUrl(sourceUrl);
      setStatus(COMPONENT_STATES.DONE);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus(COMPONENT_STATES.ERROR);
    }
  };

  const updateBrushCursor = () => {
    if (!canvasRef.current) return;

    const size = brushSize;

    const cursorSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle
        cx="${size / 2}"
        cy="${size / 2}"
        r="${size / 2 - 1}"
        fill="rgba(0, 136, 255, 0.25)"
        stroke="white"
        stroke-width="2"
      />
    </svg>
  `;

    const encoded = encodeURIComponent(cursorSvg);

    canvasRef.current.style.cursor = `url("data:image/svg+xml,${encoded}") ${
      size / 2
    } ${size / 2}, crosshair`;
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const imgRect = img.getBoundingClientRect();
    const parentRect = img.parentElement.getBoundingClientRect();

    canvas.width = imgRect.width;
    canvas.height = imgRect.height;

    canvas.style.left = `${imgRect.left - parentRect.left}px`;
    canvas.style.top = `${imgRect.top - parentRect.top}px`;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setImageSize({
      width: imgRect.width,
      height: imgRect.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    });

    updateBrushCursor();
  };

  useEffect(() => {
    updateBrushCursor();
  }, [brushSize]);

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
    scrollToVH(30);

    if (!sourceImageId || !uploadedImageUrl) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasDrawing = imageData.data.some(
      (pixel, i) => pixel !== 0 && (i + 1) % 4 !== 0
    ); // Ignore alpha

    if (!hasDrawing) {
      return;
    }

    try {
      setStatus(COMPONENT_STATES.PROCESSING);

      // Scale mask to original image size
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

      const res = await fetch(`${BACKEND_URL}/image/object-removal`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Object removal failed");
      }

      setProcessedImage(data.data.previewUrl);
      setToolKey(data.data.toolKey);
      setStatus(COMPONENT_STATES.DONE);
    } catch (error) {
      console.error("Processing error:", error);
      setStatus(COMPONENT_STATES.ERROR);
    }
  };

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
      await downloadImage(processedImage, `object-removal-result.png`);

      await fetch(`${BACKEND_URL}/image/save-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          sourceImageId,
          resultUrl: processedImage,
          toolKey,
        }),
      });
    } catch (err) {
      console.error("Download or saving error:", err);
    }
  };

  return (
    <div>
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
              border: "2px dashed rgba(0,0,0,0.3)",
              borderRadius: "20px",
              padding: "60px",
              textAlign: "center",
              cursor: "pointer",
              margin: "20px auto",
              transition: "all 0.3s ease",
              backgroundColor: "transparent",
            }}
            className="flex flex-col items-center w-full md:w-[90%] lg:w-[80%]"
          >
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
          </div>
        </div>
      )}

      {/* Loading states: Uploading or Processing */}
      {(status === COMPONENT_STATES.UPLOADING ||
        status === COMPONENT_STATES.PROCESSING) && (
        <div className="flex justify-center items-center">
          <div
            style={{
              border: "3px solid #ccc",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f9f9f9",
              overflow: "hidden",
            }}
            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
          >
            {/* Show uploaded file preview during upload */}
            {status === COMPONENT_STATES.UPLOADING && uploadedFile && (
              <img
                src={URL.createObjectURL(uploadedFile)}
                alt="Uploading"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  filter: "opacity(0.7)",
                }}
              />
            )}
            {/* Show uploaded image during processing */}
            {status === COMPONENT_STATES.PROCESSING && uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="Processing"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  filter: "opacity(0.7)",
                }}
              />
            )}
            {/* Loading overlay with progress indicator */}
            <div
              style={{
                position: "absolute",
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "20px",
              }}
            >
              {status === COMPONENT_STATES.UPLOADING
                ? "Uploading ..."
                : "Processing ..."}
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
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        {uploadedImageUrl &&
          status !== COMPONENT_STATES.UPLOADING &&
          status !== COMPONENT_STATES.PROCESSING && (
            <>
              <div style={{ marginBottom: "30px" }}>
                <h3 className="mb-6 text-lg font-semibold">
                  Select the object to remove!
                </h3>

                <div className="flex justify-center gap-8 items-start flex-wrap">
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      userSelect: "none",
                      backgroundColor: "black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] excluded"
                  >
                    <img
                      ref={imageRef}
                      src={uploadedImageUrl}
                      alt="Original"
                      onLoad={handleImageLoad}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />

                    <canvas
                      ref={canvasRef}
                      onMouseEnter={updateBrushCursor}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={{
                        position: "absolute",
                        pointerEvents: "auto",
                      }}
                    />
                  </div>

                  <div className="bg-white p-4 rounded-3xl">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flex: "1",
                        minWidth: "250px",
                        marginBottom: "20px",
                      }}
                    >
                      <OptionSlider
                        label="Brush Size"
                        value={brushSize}
                        min={5}
                        max={30}
                        step={1}
                        disabled={status === COMPONENT_STATES.PROCESSING}
                        onPreviewChange={(val) => {
                          setBrushSize(val);
                        }}
                        onCommitChange={(val) => {
                          setBrushSize(val);
                        }}
                      />
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
                        marginLeft: "10px",
                      }}
                    >
                      <Eraser size={18} />
                      Clear Mask
                    </button>
                    <button
                      onClick={processImage}
                      style={{
                        marginLeft: "10px",
                        marginTop: "20px",
                        padding: "12px",
                        background: "var(--gradient-color)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Play size={18} />
                      Start Processing
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        {processedImage && (
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {processedImage && (
              <>
                <div className="mb-2">
                  <div>
                    <div
                      style={{
                        border: "3px solid #ccc",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        overflow: "hidden",
                      }}
                      className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] relative"
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
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          backgroundColor: "green",
                          marginTop: "8px",
                          letterSpacing: "2px",
                          position: "absolute",
                          opacity: "0.5",
                          bottom: "10px",
                          left: "10px",
                          borderRadius: "10px",
                          padding: "2px 8px",
                        }}
                      >
                        PROCESSED
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Image comparison component for before/after visualization */}
                <div className="w-[92%] lg:w-[48.5%] mb-8">
                  <ImageCompare
                    hasBorder={true}
                    before={uploadedImageUrl}
                    after={processedImage}
                    background={uploadedImageUrl}
                    aspectRatio={12 / 8}
                    fit={"contain"}
                  />
                </div>
              </>
            )}

            <button
              onClick={saveResult}
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
            >
              <Download size={18} />
              Download Result
            </button>

            <button
              onClick={resetToInitialState}
              style={{
                padding: "10px 18px",
                background: "var(--gradient-color-2)",
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
              Change Photo
            </button>
          </div>
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

export default ObjectRemovalTool;
