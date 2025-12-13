import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// Tool imports
import { enhanceImage } from "../tools/enhanceTool";
import { cartoonPhoto } from "../tools/cartoonTool";
import { flipImage } from "../tools/flipTool";
import { resizeImage } from "../tools/resizeTool";
import { TOOL_CONFIG } from "../config/toolConfig";
import ImageCompare from "../../../components/ImageCompare";
import { Download, RefreshCw, Rocket } from "lucide-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
} from "@mui/material";

// Tool type identifiers
const TOOL_TYPES = {
  ENHANCE: "ai-image-enhancer",
  CARTOON: "photo-to-cartoon",
  FLIP: "flip-image",
  RESIZE: "resize-image",
};

// Component lifecycle states
const COMPONENT_STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  PROCESSING: "processing",
  DONE: "done",
  ERROR: "error",
};

const DropZone = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Identify current tool from URL path
  const currentTool =
    location.pathname.split("/").filter(Boolean)[0] ||
    location.pathname.replace("/", "");
  const toolConfig = TOOL_CONFIG[currentTool];

  // Component state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [sourceImageId, setSourceImageId] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [status, setStatus] = useState(COMPONENT_STATES.IDLE);
  const [message, setMessage] = useState("");
  const [showDropZone, setShowDropZone] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({});
  const [renderedResultBefore, setRenderedResultBefore] = useState(false);

  // Initialize component from localStorage or reset to default state
  useEffect(() => {
    const LS_KEY = `dropzone_last_result`;
    const FROM_TOOL_KEY = `came_from_tool`;

    // Clean up previous tool data
    localStorage.removeItem(`dropzone_last_result_${currentTool}`);

    const storedResult = localStorage.getItem(LS_KEY);
    const cameFromTool = localStorage.getItem(FROM_TOOL_KEY);

    if (cameFromTool && storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);

        // Only load if coming from a different tool
        if (parsedResult.tool !== currentTool) {
          setUploadedImageUrl(parsedResult.previewUrl);
          setSourceImageId(parsedResult.sourceImageId);
          setShowDropZone(false);
          setShowOptions(true);
          setStatus(COMPONENT_STATES.DONE);
          setMessage("Loaded from previous tool ✅");
        } else {
          resetToInitialState();
        }

        // Clean up transition flags
        localStorage.removeItem(FROM_TOOL_KEY);
        localStorage.removeItem(LS_KEY);
      } catch (err) {
        console.error("Error parsing stored result:", err);
        resetToInitialState();
      }
    } else {
      resetToInitialState();
    }

    // Initialize tool options with defaults
    if (toolConfig?.hasOptions) {
      const defaultOptions = {};
      Object.keys(toolConfig.options).forEach((key) => {
        defaultOptions[key] = toolConfig.options[key].default;
      });
      setOptions(defaultOptions);
    }
  }, [currentTool]);

  // Auto-process for TYPE_2 tools when options are selected
  useEffect(() => {
    if (!uploadedImageUrl || !sourceImageId) return;
    if (!toolConfig?.hasOptions) return;
    if (currentTool === TOOL_TYPES.RESIZE) return;
    if (Object.values(options).includes(null)) return;

    processImage();
  }, [options]);

  // Reset component to initial state
  const resetToInitialState = () => {
    setUploadedFile(null);
    setUploadedImageUrl(null);
    setSourceImageId(null);
    setProcessedImage(null);
    setStatus(COMPONENT_STATES.IDLE);
    setMessage("");
    setShowDropZone(true);
    setShowOptions(false);
    setRenderedResultBefore(false);

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
    localStorage.removeItem(`dropzone_last_result`);
    localStorage.removeItem(`came_from_tool`);
  };

  // Handle file upload to server
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
        setStatus(COMPONENT_STATES.UPLOADING);
        setMessage("Uploading image... ⏳");

        const uploadRes = await fetch(
          "https://picsharps-api.onrender.com/api/v1/image/upload",
          { method: "POST", body: formData }
        );

        const uploadData = await uploadRes.json();

        if (uploadData.status !== "success") {
          setStatus(COMPONENT_STATES.ERROR);
          setMessage(uploadData.message || "Upload failed ❌");
          toast.error(uploadData.message || "Upload failed");
          resetComponent();
          return;
        }

        const { sourceImageId, sourceUrl } = uploadData.data;

        setSourceImageId(sourceImageId);
        setUploadedImageUrl(sourceUrl);
        setStatus(COMPONENT_STATES.DONE);
        setMessage("Image uploaded successfully! ✅");

        // Show options panel if tool supports them
        if (toolConfig?.hasOptions) {
          setShowOptions(true);
        }
      } catch (err) {
        console.error("[DropZone] Upload Error:", err);
        setStatus(COMPONENT_STATES.ERROR);
        setMessage("Network error occurred ❌");
        toast.error("Network error occurred");
        resetComponent();
      }
    },
    [toolConfig]
  );

  // Main image processing function - routes to appropriate tool
  const processImage = useCallback(async () => {
    if (!sourceImageId || !uploadedImageUrl) {
      toast.error("No image to process");
      return;
    }

    try {
      setStatus(COMPONENT_STATES.PROCESSING);
      setMessage("Processing image... ⏳");
      setShowOptions(false);

      let toolResult = null;

      // Route to specific tool based on currentTool
      if (currentTool === TOOL_TYPES.ENHANCE) {
        toolResult = await enhanceImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          upscaleFactor: options.upscaleFactor,
        });
      } else if (currentTool === TOOL_TYPES.CARTOON) {
        toolResult = await cartoonPhoto({
          sourceImageId,
          imageUrl: uploadedImageUrl,
        });
      } else if (currentTool === TOOL_TYPES.FLIP) {
        toolResult = await flipImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          direction: options.direction,
        });
      } else if (currentTool === TOOL_TYPES.RESIZE) {
        // Validate inputs for resize tool
        if (!options.width && !options.height) {
          toast.error("Please enter at least width or height");
          setStatus(COMPONENT_STATES.ERROR);
          setMessage("Please enter at least width or height ❌");
          return;
        }

        toolResult = await resizeImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          width: options.width,
          height: options.height,
          mode: options.mode,
        });
      }

      // Handle successful processing
      if (toolResult) {
        setProcessedImage(toolResult.previewUrl);
        setStatus(COMPONENT_STATES.DONE);
        setMessage("Image processed successfully! 🎉");
        setShowOptions(true);
        setRenderedResultBefore(true);

        // Save result for tool-to-tool navigation
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
      setStatus(COMPONENT_STATES.ERROR);
      setMessage("Processing failed ❌");
      toast.error("Processing failed");

      // Restore options panel on error
      if (toolConfig?.hasOptions) {
        setShowOptions(true);
      }
    }
  }, [sourceImageId, uploadedImageUrl, currentTool, options, toolConfig]);

  // Handle option changes in tool settings
  const handleOptionChange = (optionKey, value) => {
    const newOptions = { ...options, [optionKey]: value };
    setOptions(newOptions);
  };

  // Navigate to another tool with current processed image
  const goToTool = (toolPath) => {
    if (!processedImage) {
      toast.error("No processed image to use");
      return;
    }

    // Set flag for next component initialization
    localStorage.setItem("came_from_tool", "true");

    // Save current result for next tool
    const resultData = {
      sourceImageId,
      previewUrl: processedImage,
      originalUrl: uploadedImageUrl,
      tool: currentTool,
    };
    localStorage.setItem(`dropzone_last_result`, JSON.stringify(resultData));

    // Navigate to new tool
    navigate(`/${toolPath}`);
  };

  // Dropzone configuration
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

  // Prepare available tools for navigation dropdown
  const availableTools = Object.keys(TOOL_CONFIG)
    .filter((tool) => tool !== currentTool && tool !== "resize-image")
    .map((tool) => ({
      path: tool,
      label: TOOL_CONFIG[tool].name,
    }));

  return (
    <div>
      {/* Dropzone for file upload */}
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
          backgroundColor: "yellow",
        }}
      >
        {/* Uploading/Processing states */}
        {(status === COMPONENT_STATES.UPLOADING ||
          status === COMPONENT_STATES.PROCESSING) && (
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
              className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
            >
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

        {/* After successful upload */}
        {uploadedImageUrl &&
          status !== COMPONENT_STATES.UPLOADING &&
          status !== COMPONENT_STATES.PROCESSING && (
            <>
              {/* Original image display */}
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
                  className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] relative"
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
                  <h3
                    style={{
                      fontWeight: "600",
                      backgroundColor: "red",
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
                    ORIGINAL
                  </h3>
                </div>
              </div>

              {/* Tool-specific options panel */}
              {((showOptions && toolConfig?.hasOptions) ||
                (uploadedImageUrl &&
                  toolConfig &&
                  !toolConfig.hasOptions &&
                  !processedImage &&
                  status !== COMPONENT_STATES.PROCESSING) ||
                renderedResultBefore === false) && (
                <div className="flex flex-col gap-4 bg-amber-300">
                  {/* Options for tools with settings */}
                  {showOptions && toolConfig?.hasOptions && (
                    <div
                      style={{
                        background: "#f8f9fa",
                        padding: "9px 12px 12px 12px",
                        borderRadius: "10px",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <h4
                        style={{
                          marginBottom: "12px",
                          color: "#333",
                          textAlign: "start",
                        }}
                      >
                        {currentTool === TOOL_TYPES.ENHANCE
                          ? "Level"
                          : currentTool === TOOL_TYPES.FLIP
                          ? "Direction"
                          : currentTool === TOOL_TYPES.RESIZE
                          ? "Settings"
                          : ""}
                      </h4>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "15px",
                        }}
                      >
                        {/* Enhance tool options */}
                        {currentTool === TOOL_TYPES.ENHANCE && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            {toolConfig.options.upscaleFactor.values.map(
                              (option) => {
                                const isSelected =
                                  options.upscaleFactor === option.value;

                                return (
                                  <label
                                    key={option.value}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      padding: "10px 14px",
                                      borderRadius: "8px",
                                      border: isSelected
                                        ? "2px solid #00c853"
                                        : "1px solid #ccc",
                                      cursor: "pointer",
                                      userSelect: "none",
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name="upscaleFactor"
                                      value={option.value}
                                      checked={isSelected}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          "upscaleFactor",
                                          parseInt(e.target.value)
                                        )
                                      }
                                      disabled={
                                        status === COMPONENT_STATES.PROCESSING
                                      }
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        cursor: "pointer",
                                      }}
                                    />

                                    <span
                                      style={{ fontWeight: 500, color: "#333" }}
                                    >
                                      {option.label}
                                    </span>
                                  </label>
                                );
                              }
                            )}
                          </div>
                        )}

                        {/* Flip tool options */}
                        {currentTool === TOOL_TYPES.FLIP && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            {toolConfig.options.direction.values.map(
                              (option) => {
                                const isSelected =
                                  options.direction === option.value;

                                return (
                                  <label
                                    key={option.value}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      padding: "10px 14px",
                                      borderRadius: "8px",
                                      border: isSelected
                                        ? "2px solid #00c853"
                                        : "1px solid #ccc",
                                      cursor: "pointer",
                                      userSelect: "none",
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name="direction"
                                      value={option.value}
                                      checked={isSelected}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          "direction",
                                          e.target.value
                                        )
                                      }
                                      disabled={
                                        status === COMPONENT_STATES.PROCESSING
                                      }
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        cursor: "pointer",
                                      }}
                                    />

                                    <span
                                      style={{ fontWeight: 500, color: "#333" }}
                                    >
                                      {option.label}
                                    </span>
                                  </label>
                                );
                              }
                            )}
                          </div>
                        )}

                        {/* Resize tool options */}
                        {currentTool === TOOL_TYPES.RESIZE && (
                          <>
                            <div style={{ textAlign: "left" }}>
                              <TextField
                                label="Width (px)"
                                type="number"
                                size="small"
                                fullWidth
                                placeholder="e.g. 800"
                                value={options.width}
                                onChange={(e) =>
                                  handleOptionChange(
                                    "width",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={
                                  status === COMPONENT_STATES.PROCESSING
                                }
                                InputProps={{ inputProps: { min: 0 } }}
                                sx={{ marginTop: "5px" }}
                              />
                            </div>

                            <div
                              style={{ textAlign: "left", marginTop: "10px" }}
                            >
                              <TextField
                                label="Height (px)"
                                type="number"
                                size="small"
                                fullWidth
                                placeholder="e.g. 600"
                                value={options.height}
                                onChange={(e) =>
                                  handleOptionChange(
                                    "height",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={
                                  status === COMPONENT_STATES.PROCESSING
                                }
                                InputProps={{ inputProps: { min: 0 } }}
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                              }}
                            >
                              {toolConfig.options.mode.values.map((option) => {
                                const isSelected =
                                  options.mode === option.value;

                                return (
                                  <label
                                    key={option.value}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      padding: "10px 14px",
                                      borderRadius: "8px",
                                      border: isSelected
                                        ? "2px solid #00c853"
                                        : "1px solid #ccc",
                                      cursor: "pointer",
                                      userSelect: "none",
                                    }}
                                  >
                                    <Radio
                                      name="mode"
                                      value={option.value}
                                      checked={isSelected}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          "mode",
                                          e.target.value
                                        )
                                      }
                                      disabled={
                                        status === COMPONENT_STATES.PROCESSING
                                      }
                                      sx={{
                                        padding: 0,
                                        "& .MuiSvgIcon-root": { fontSize: 16 },
                                      }}
                                    />
                                    <span
                                      style={{ fontWeight: 500, color: "#333" }}
                                    >
                                      {option.label}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>

                            <button
                              onClick={processImage}
                              disabled={status === COMPONENT_STATES.PROCESSING}
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
                                width: "fit-content",
                              }}
                            >
                              <Rocket size={18} />
                              Start Processing
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {(uploadedImageUrl &&
                    toolConfig &&
                    !toolConfig.hasOptions &&
                    !processedImage &&
                    status !== COMPONENT_STATES.PROCESSING) ||
                  renderedResultBefore === false ? (
                    <div>
                      {/* Start button for tools without options */}
                      {uploadedImageUrl &&
                        toolConfig &&
                        !toolConfig.hasOptions &&
                        !processedImage &&
                        status !== COMPONENT_STATES.PROCESSING && (
                          <button
                            onClick={processImage}
                            disabled={status === COMPONENT_STATES.PROCESSING}
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
                              marginBottom: "10px",
                            }}
                          >
                            <Rocket size={18} />
                            Start Processing
                          </button>
                        )}

                      {/* Reset button before processing */}
                      {renderedResultBefore === false && (
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
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Processed image result */}
              {processedImage && (
                <>
                  <div
                    className={`${
                      toolConfig.hasOptions ? "xl:w-full" : ""
                    }  2xl:w-[500px] 2xl:h-[500px] flex justify-center`}
                  >
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
                        className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] relative"
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

                  <div className="w-[92%] lg:w-[48.5%]">
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
            </>
          )}

        {/* Post-processing actions */}
        {status === COMPONENT_STATES.DONE && processedImage && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
              className="items-center md:items-start"
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                  justifyContent: "center",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <button
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

                {/* Tool navigation dropdown */}
                {availableTools.length > 0 && (
                  <FormControl
                    size="medium"
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "400px",
                      },
                    }}
                  >
                    <InputLabel id="tool-select-label">
                      Select tool to process the result with ...
                    </InputLabel>

                    <Select
                      labelId="tool-select-label"
                      defaultValue=""
                      label="Select tool to process the result with ..."
                      onChange={(e) => goToTool(e.target.value)}
                      sx={{
                        borderRadius: "8px",
                        background: "transparent",
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc",
                        },
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
                )}
              </div>

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
                  marginLeft: "0",
                }}
              >
                <RefreshCw size={18} />
                Change Photo
              </button>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === COMPONENT_STATES.ERROR && (
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
    </div>
  );
};

export default DropZone;
