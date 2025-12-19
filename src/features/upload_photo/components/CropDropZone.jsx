import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TOOL_CONFIG } from "../config/toolConfig";
import ImageCompare from "../../../components/ImageCompare";
import { Download, Play, RefreshCw } from "lucide-react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAuth } from "../../auth/AuthProvider";
import { BACKEND_URL } from "../../../api";

const COMPONENT_STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  PROCESSING: "processing",
  DONE: "done",
  ERROR: "error",
};

const CropDropZone = () => {
  const navigate = useNavigate();
  const currentTool = "crop-image";
  const { accessToken } = useAuth();

  // State declarations
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [sourceImageId, setSourceImageId] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [toolKey, setToolKey] = useState(null);
  const [status, setStatus] = useState(COMPONENT_STATES.IDLE);
  const [showDropZone, setShowDropZone] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  // Cropper states
  const [cropArea, setCropArea] = useState({
    x: 50,
    y: 50,
    width: 200,
    height: 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState("free");

  useEffect(() => {
    const LS_KEY = `dropzone_last_result`;
    const FROM_TOOL_KEY = `came_from_tool`;

    localStorage.removeItem(`dropzone_last_result_${currentTool}`);

    const storedResult = localStorage.getItem(LS_KEY);
    const cameFromTool = localStorage.getItem(FROM_TOOL_KEY);

    if (cameFromTool && storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        if (parsedResult.tool !== currentTool) {
          setUploadedImageUrl(parsedResult.previewUrl);
          setSourceImageId(parsedResult.sourceImageId);
          setShowDropZone(false);
          setShowOptions(true);
          setStatus(COMPONENT_STATES.DONE);

          localStorage.removeItem(FROM_TOOL_KEY);
          localStorage.removeItem(LS_KEY);
        } else {
          resetToInitialState();
        }
      } catch (error) {
        console.error("Error parsing stored result:", error);
        resetToInitialState();
      }
    } else {
      resetToInitialState();
    }
  }, [currentTool]);

  useEffect(() => {
    if (!imageSize.width) return; // Wait for image to load

    const aspectValue = getAspectRatioValue();

    if (aspectValue) {
      // Apply aspect ratio to current crop
      setCropArea((prev) => {
        const newHeight = prev.width / aspectValue;

        // Make sure new dimensions fit within image
        let finalWidth = prev.width;
        let finalHeight = newHeight;

        if (finalHeight > imageSize.height) {
          finalHeight = imageSize.height;
          finalWidth = finalHeight * aspectValue;
        }

        if (finalWidth > imageSize.width) {
          finalWidth = imageSize.width;
          finalHeight = finalWidth / aspectValue;
        }

        // Adjust position if crop goes outside bounds
        let newX = prev.x;
        let newY = prev.y;

        if (newX + finalWidth > imageSize.width) {
          newX = imageSize.width - finalWidth;
        }

        if (newY + finalHeight > imageSize.height) {
          newY = imageSize.height - finalHeight;
        }

        return {
          x: Math.max(0, newX),
          y: Math.max(0, newY),
          width: finalWidth,
          height: finalHeight,
        };
      });
    }
  }, [aspectRatio, imageSize.width]);

  const resetToInitialState = () => {
    setUploadedFile(null);
    setUploadedImageUrl(null);
    setSourceImageId(null);
    setProcessedImage(null);
    setToolKey(null);
    setStatus(COMPONENT_STATES.IDLE);
    setShowDropZone(true);
    setShowOptions(false);
    setCropArea({ x: 50, y: 50, width: 200, height: 200 });
    setAspectRatio("free");
  };

  const resetComponent = () => {
    resetToInitialState();
    localStorage.removeItem(`dropzone_last_result`);
    localStorage.removeItem(`came_from_tool`);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadedFile(file);
    setProcessedImage(null);
    setShowDropZone(false);

    const formData = new FormData();
    formData.append("image", file);

    try {
      setStatus(COMPONENT_STATES.UPLOADING);

      const uploadRes = await fetch(
        `${BACKEND_URL}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (uploadData.status !== "success") {
        setStatus(COMPONENT_STATES.ERROR);
        toast.error(uploadData.message || "Upload failed");
        resetComponent();
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
      toast.error("Network error occurred");
      resetComponent();
    }
  }, []);

  const handleImageLoad = (e) => {
    const img = e.target;

    // Store both displayed and natural dimensions
    setImageSize({
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      offsetLeft: img.offsetLeft,
      offsetTop: img.offsetTop,
    });

    // Initialize crop in center - 50% of image size
    const cropWidth = img.width * 0.5;
    const cropHeight = img.height * 0.5;

    setCropArea({
      x: (img.width - cropWidth) / 2,
      y: (img.height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    });
  };

  const handleMouseDown = (e, handle = null) => {
    e.preventDefault();
    e.stopPropagation();

    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }

    setDragStart({
      x: e.clientX,
      y: e.clientY,
      cropX: cropArea.x,
      cropY: cropArea.y,
      cropWidth: cropArea.width,
      cropHeight: cropArea.height,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (isDragging) {
      const newX = Math.max(
        0,
        Math.min(imageSize.width - cropArea.width, dragStart.cropX + deltaX)
      );
      const newY = Math.max(
        0,
        Math.min(imageSize.height - cropArea.height, dragStart.cropY + deltaY)
      );

      setCropArea((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    } else if (isResizing) {
      let newCrop = { ...cropArea };
      const aspectValue = getAspectRatioValue();

      switch (resizeHandle) {
        case "tl":
          newCrop.width = Math.max(50, dragStart.cropWidth - deltaX);
          newCrop.height = aspectValue
            ? newCrop.width / aspectValue
            : Math.max(50, dragStart.cropHeight - deltaY);
          newCrop.x = dragStart.cropX + (dragStart.cropWidth - newCrop.width);
          newCrop.y = dragStart.cropY + (dragStart.cropHeight - newCrop.height);
          break;
        case "tr":
          newCrop.width = Math.max(50, dragStart.cropWidth + deltaX);
          newCrop.height = aspectValue
            ? newCrop.width / aspectValue
            : Math.max(50, dragStart.cropHeight - deltaY);
          newCrop.y = dragStart.cropY + (dragStart.cropHeight - newCrop.height);
          break;
        case "bl":
          newCrop.width = Math.max(50, dragStart.cropWidth - deltaX);
          newCrop.height = aspectValue
            ? newCrop.width / aspectValue
            : Math.max(50, dragStart.cropHeight + deltaY);
          newCrop.x = dragStart.cropX + (dragStart.cropWidth - newCrop.width);
          break;
        case "br":
          newCrop.width = Math.max(50, dragStart.cropWidth + deltaX);
          newCrop.height = aspectValue
            ? newCrop.width / aspectValue
            : Math.max(50, dragStart.cropHeight + deltaY);
          break;
        case "t":
          newCrop.height = Math.max(50, dragStart.cropHeight - deltaY);
          newCrop.width = aspectValue
            ? newCrop.height * aspectValue
            : newCrop.width;
          newCrop.y = dragStart.cropY + (dragStart.cropHeight - newCrop.height);
          break;
        case "b":
          newCrop.height = Math.max(50, dragStart.cropHeight + deltaY);
          newCrop.width = aspectValue
            ? newCrop.height * aspectValue
            : newCrop.width;
          break;
        case "l":
          newCrop.width = Math.max(50, dragStart.cropWidth - deltaX);
          newCrop.height = aspectValue
            ? newCrop.width / aspectValue
            : newCrop.height;
          newCrop.x = dragStart.cropX + (dragStart.cropWidth - newCrop.width);
          break;
        case "r":
          newCrop.width = Math.max(50, dragStart.cropWidth + deltaX);
          newCrop.height = aspectValue
            ? newCrop.width / aspectValue
            : newCrop.height;
          break;
      }

      // Boundaries
      if (newCrop.x < 0) newCrop.x = 0;
      if (newCrop.y < 0) newCrop.y = 0;
      if (newCrop.x + newCrop.width > imageSize.width) {
        newCrop.width = imageSize.width - newCrop.x;
        if (aspectValue) newCrop.height = newCrop.width / aspectValue;
      }
      if (newCrop.y + newCrop.height > imageSize.height) {
        newCrop.height = imageSize.height - newCrop.y;
        if (aspectValue) newCrop.width = newCrop.height * aspectValue;
      }

      setCropArea(newCrop);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, cropArea, dragStart, imageSize]);

  const processImage = async () => {
    if (!sourceImageId || !uploadedImageUrl || !cropArea) {
      toast.error("Please select a crop area");
      return;
    }

    try {
      setStatus(COMPONENT_STATES.PROCESSING);
      setShowOptions(false);

      // Get image element to calculate correct coordinates
      const img = document.getElementById("crop-image");

      // Calculate scale between displayed and natural size
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      // Convert crop coordinates from displayed pixels to natural pixels
      const naturalCrop = {
        x: Math.round(cropArea.x * scaleX),
        y: Math.round(cropArea.y * scaleY),
        width: Math.round(cropArea.width * scaleX),
        height: Math.round(cropArea.height * scaleY),
      };

      const requestBody = {
        imageUrl: uploadedImageUrl,
        sourceImageId: sourceImageId,
        width: naturalCrop.width,
        height: naturalCrop.height,
        x: naturalCrop.x,
        y: naturalCrop.y,
        crop: "crop",
      };

      const res = await fetch(
        `${BACKEND_URL}/image/crop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setProcessedImage(data.data.previewUrl);
        setToolKey(data.data.toolKey);
        setStatus(COMPONENT_STATES.DONE);
        setShowOptions(true);

        const resultData = {
          sourceImageId,
          previewUrl: data.data.previewUrl,
          originalUrl: uploadedImageUrl,
          tool: currentTool,
        };
        localStorage.setItem(
          `dropzone_last_result`,
          JSON.stringify(resultData)
        );
      } else {
        throw new Error(data.message || "Crop failed");
      }
    } catch (error) {
      console.error("Processing error:", error);
      setStatus(COMPONENT_STATES.ERROR);
      toast.error("Processing failed");
      setShowOptions(true);
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
      await downloadImage(processedImage, `${currentTool}-result.png`);

      await fetch(
        `${BACKEND_URL}/image/save-result`,
        {
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
        }
      );

    } catch (err) {
      console.error("Download or saving error:", err);
    }
  };

  const goToTool = (toolPath) => {
    if (!processedImage) {
      toast.error("No processed image available");
      return;
    }

    localStorage.setItem("came_from_tool", "true");

    const resultData = {
      sourceImageId,
      previewUrl: processedImage,
      originalUrl: uploadedImageUrl,
      tool: currentTool,
    };
    localStorage.setItem(`dropzone_last_result`, JSON.stringify(resultData));

    navigate(`/${toolPath}`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled:
      status === COMPONENT_STATES.UPLOADING ||
      status === COMPONENT_STATES.PROCESSING,
  });

  const availableTools = Object.keys(TOOL_CONFIG)
    .filter((tool) => tool !== currentTool)
    .map((tool) => ({
      path: tool,
      label: TOOL_CONFIG[tool].name,
    }));

  const getAspectRatioValue = () => {
    switch (aspectRatio) {
      case "1:1":
        return 1;
      case "16:9":
        return 16 / 9;
      case "9:16":
        return 9 / 16;
      case "4:3":
        return 4 / 3;
      case "3:4":
        return 3 / 4;
      case "21:9":
        return 21 / 9;
      case "2:3":
        return 2 / 3;
      case "3:2":
        return 3 / 2;
      case "5:4":
        return 5 / 4;
      case "4:5":
        return 4 / 5;
      case "free":
      default:
        return null;
    }
  };

  return (
    <div>
      {showDropZone && (
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed rgba(0,0,0,0.3)",
            margin: "20px auto",
            padding: "60px",
            borderRadius: "20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "rgba(0,0,0,0.05)" : "transparent",
            transition: "all 0.3s ease",
          }}
          className="flex flex-col items-center w-full md:w-[90%] lg:w-[80%]"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p style={{ fontSize: "18px", color: "#666" }}>
              Drop the image here ...
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

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {status === COMPONENT_STATES.UPLOADING && (
          <>
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
          </>
        )}

        {uploadedImageUrl &&
          status !== COMPONENT_STATES.UPLOADING &&
          status !== COMPONENT_STATES.PROCESSING && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "40px",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <div>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    background: "#000",
                    overflow: "hidden",
                    userSelect: "none",
                  }}
                  className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
                >
                  <img
                    id="crop-image"
                    src={uploadedImageUrl}
                    alt="Original"
                    onLoad={handleImageLoad}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />

                  {/* Crop Overlay */}
                  <div
                    onMouseDown={handleMouseDown}
                    style={{
                      position: "absolute",
                      left: `${cropArea.x}px`,
                      top: `${cropArea.y}px`,
                      width: `${cropArea.width}px`,
                      height: `${cropArea.height}px`,
                      border: "2px solid #1976d2",
                      cursor: "move",
                      boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Resize Handles */}
                    {["tl", "tr", "bl", "br", "t", "b", "l", "r"].map(
                      (handle) => (
                        <div
                          key={handle}
                          onMouseDown={(e) => handleMouseDown(e, handle)}
                          style={{
                            position: "absolute",
                            background: "#1976d2",
                            ...(handle.length === 2
                              ? {
                                  width: "8px",
                                  height: "8px",
                                  [handle.includes("t") ? "top" : "bottom"]:
                                    "-5px",
                                  [handle.includes("l") ? "left" : "right"]:
                                    "-5px",
                                  cursor: `${handle}-resize`,
                                }
                              : {
                                  [handle === "t" || handle === "b"
                                    ? "width"
                                    : "height"]: "100%",
                                  [handle === "t" || handle === "b"
                                    ? "height"
                                    : "width"]: "10px",
                                  [handle === "t"
                                    ? "top"
                                    : handle === "b"
                                    ? "bottom"
                                    : handle === "l"
                                    ? "left"
                                    : "right"]: "-5px",
                                  [handle === "t" || handle === "b"
                                    ? "left"
                                    : "top"]: "0",
                                  cursor: `${
                                    handle === "t" || handle === "b"
                                      ? "ns"
                                      : "ew"
                                  }-resize`,
                                }),
                          }}
                        />
                      )
                    )}

                    {/* Grid Lines */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "33.33%",
                          top: 0,
                          width: "1px",
                          height: "100%",
                          background: "rgba(255,255,255,0.5)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: "66.66%",
                          top: 0,
                          width: "1px",
                          height: "100%",
                          background: "rgba(255,255,255,0.5)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "33.33%",
                          left: 0,
                          height: "1px",
                          width: "100%",
                          background: "rgba(255,255,255,0.5)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "66.66%",
                          left: 0,
                          height: "1px",
                          width: "100%",
                          background: "rgba(255,255,255,0.5)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start">
                {showOptions && (
                  <div
                    style={{
                      background: "#f9f9f9",
                      padding: "25px",
                      borderRadius: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    <Box>
                      <FormControl fullWidth>
                        <InputLabel>Aspect Ratio</InputLabel>
                        <Select
                          value={aspectRatio}
                          label="Aspect Ratio"
                          onChange={(e) => setAspectRatio(e.target.value)}
                        >
                          <MenuItem value="free">Free (Any Size)</MenuItem>
                          <MenuItem value="1:1">Square (1:1)</MenuItem>
                          <MenuItem value="16:9">Widescreen (16:9)</MenuItem>
                          <MenuItem value="9:16">Portrait (9:16)</MenuItem>
                          <MenuItem value="4:3">Standard (4:3)</MenuItem>
                          <MenuItem value="3:4">Portrait (3:4)</MenuItem>
                          <MenuItem value="21:9">Ultrawide (21:9)</MenuItem>
                          <MenuItem value="3:2">Classic (3:2)</MenuItem>
                          <MenuItem value="2:3">Portrait (2:3)</MenuItem>
                          <MenuItem value="5:4">Monitor (5:4)</MenuItem>
                          <MenuItem value="4:5">Portrait (4:5)</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <button
                      onClick={processImage}
                      style={{
                        marginTop: "20px",
                        width: "100%",
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
                )}

                {!processedImage && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={resetComponent}
                      style={{
                        padding: "10px 20px",
                        background: "var(--gradient-color-2)",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <RefreshCw size={18} />
                      Change Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        {status === COMPONENT_STATES.PROCESSING && (
          <div style={{ textAlign: "center", position: "relative" }}>
            {uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="Processing"
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  borderRadius: "10px",
                  opacity: 0.5,
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
                bottom: "10%",
                right: "10%",
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
        )}
      </div>

      {status === COMPONENT_STATES.DONE && processedImage && (
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
              <div>
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

          {availableTools.length > 0 && (
            <Box sx={{ minWidth: "300px" }}>
              <FormControl fullWidth>
                <InputLabel>Continue with another tool</InputLabel>
                <Select
                  label="Continue with another tool"
                  defaultValue=""
                  onChange={(e) => goToTool(e.target.value)}
                  sx={{
                    borderRadius: "8px",
                    background: "transparent",
                    ".MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#aaa",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  {availableTools.map((tool) => (
                    <MenuItem key={tool.path} value={tool.path}>
                      {tool.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <button
            onClick={resetComponent}
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

      {/* CSS animation for loading indicator */}
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

export default CropDropZone;
