import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// Import tool functions for image processing
import { enhanceImage } from "../tools/enhanceTool";
import { cartoonPhoto } from "../tools/cartoonTool";
import { flipImage } from "../tools/flipTool";
import { resizeImage } from "../tools/resizeTool";
import { rotateImage } from "../tools/rotateTool";
import { sharpenImage } from "../tools/sharpenTool";
import { removeBackground } from "../tools/removeBackgroundTool";
import { blurImage } from "../tools/blurTool";
import { grayscalePhoto } from "../tools/grayscaleTool";

// Import configuration and components
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
import { SketchPicker } from "react-color";

// Constants for tool type identifiers
// These values should match the tool paths in the routing configuration
const TOOL_TYPES = {
  ENHANCE: "ai-image-enhancer", // Image enhancement tool
  CARTOON: "photo-to-cartoon", // Cartoon effect tool
  FLIP: "flip-image", // Image flipping tool
  RESIZE: "resize-image", // Image resizing tool
  ROTATE: "rotate-image", // Image rotation tool
  SHARPEN: "sharpen-image", // Image sharpening tool
  REMOVE: "remove-background", // Background removal tool
  BLUR: "blur-image",
  GRAYSCALE: "grayscale-image",
};

// Component lifecycle state constants
// Used to track the current state of the component for UI rendering and logic control
const COMPONENT_STATES = {
  IDLE: "idle", // Initial state, waiting for user action
  UPLOADING: "uploading", // Uploading image to server
  PROCESSING: "processing", // Processing image with selected tool
  DONE: "done", // Processing completed successfully
  ERROR: "error", // An error occurred during upload or processing
};

const DropZone = () => {
  // Navigation and routing hooks
  const navigate = useNavigate(); // For programmatic navigation between tools
  const location = useLocation(); // To access current URL path

  // Extract current tool from URL path
  // The tool identifier is derived from the first non-empty segment of the path
  const currentTool =
    location.pathname.split("/").filter(Boolean)[0] ||
    location.pathname.replace("/", "");

  // Get configuration for the current tool from toolConfig
  const toolConfig = TOOL_CONFIG[currentTool];

  // State declarations for component data management
  const [uploadedFile, setUploadedFile] = useState(null); // Original file object
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // URL of uploaded image
  const [sourceImageId, setSourceImageId] = useState(null); // Server-assigned image ID
  const [processedImage, setProcessedImage] = useState(null); // URL of processed image
  const [status, setStatus] = useState(COMPONENT_STATES.IDLE); // Current component state
  const [message, setMessage] = useState(""); // Status message for user
  const [showDropZone, setShowDropZone] = useState(true); // Toggle dropzone visibility
  const [showOptions, setShowOptions] = useState(false); // Toggle tool options panel
  const [options, setOptions] = useState({}); // Tool-specific options
  const [renderedResultBefore, setRenderedResultBefore] = useState(false); // Track if result was shown before

  // Effect hook for component initialization and state restoration
  // Handles loading data from localStorage when navigating between tools
  useEffect(() => {
    // LocalStorage keys for state persistence
    const LS_KEY = `dropzone_last_result`; // Stores the last processing result
    const FROM_TOOL_KEY = `came_from_tool`; // Flag indicating navigation from another tool

    // Clean up any previous tool-specific data to prevent conflicts
    localStorage.removeItem(`dropzone_last_result_${currentTool}`);

    // Retrieve stored data from localStorage
    const storedResult = localStorage.getItem(LS_KEY);
    const cameFromTool = localStorage.getItem(FROM_TOOL_KEY);

    // Check if we're navigating from another tool with stored results
    if (cameFromTool && storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);

        // Only load the stored result if coming from a different tool
        // This prevents reloading the same result when refreshing the page
        if (parsedResult.tool !== currentTool) {
          // Restore state from stored result
          setUploadedImageUrl(parsedResult.previewUrl);
          setSourceImageId(parsedResult.sourceImageId);
          setShowDropZone(false); // Hide dropzone since we have an image
          setShowOptions(true); // Show options panel for processing
          setStatus(COMPONENT_STATES.DONE); // Set status to done
          setMessage("Loaded from previous tool"); // Inform user

          // Clean up transition flags after successful restoration
          localStorage.removeItem(FROM_TOOL_KEY);
          localStorage.removeItem(LS_KEY);
        } else {
          // If same tool, reset to initial state
          resetToInitialState();
        }
      } catch (error) {
        console.error("Error parsing stored result from localStorage:", error);
        resetToInitialState(); // Reset on parsing error
      }
    } else {
      // No stored data, initialize with default state
      resetToInitialState();
    }

    // Initialize tool-specific options with default values
    // This ensures options are properly set based on tool configuration
    if (toolConfig && toolConfig.hasOptions) {
      const defaultOptions = {};
      // Iterate through each option defined in toolConfig
      Object.keys(toolConfig.options).forEach((key) => {
        defaultOptions[key] = toolConfig.options[key].default;
      });
      setOptions(defaultOptions);
    }
  }, [currentTool]); // Only run when currentTool changes

  // Effect hook for automatic processing of TYPE_2 tools
  // Automatically triggers processing when options change for certain tools
  useEffect(() => {
    // Early return conditions:
    // 1. No uploaded image or source image ID
    // 2. Tool doesn't have configurable options
    // 3. Currently processing (prevents duplicate processing)
    // 4. Background removal tool is excluded from auto-processing
    // 5. Not all required options are selected
    if (!uploadedImageUrl || !sourceImageId) return;
    if (!toolConfig || !toolConfig.hasOptions) return;
    if (status === COMPONENT_STATES.PROCESSING) return;

    // Background removal tool requires manual processing due to complexity
    if (currentTool === TOOL_TYPES.REMOVE) return;

    // Check if all options have valid values (not null)
    if (Object.values(options).includes(null)) return;

    // All conditions met, proceed with automatic processing
    processImage();
  }, [options]); // Run whenever options state changes

  // Function to reset component to initial state
  // Clears all state and reinitializes with defaults
  const resetToInitialState = () => {
    // Clear all image-related state
    setUploadedFile(null);
    setUploadedImageUrl(null);
    setSourceImageId(null);
    setProcessedImage(null);

    // Reset component state and UI
    setStatus(COMPONENT_STATES.IDLE);
    setMessage("");
    setShowDropZone(true); // Show dropzone for new uploads
    setShowOptions(false); // Hide options panel
    setRenderedResultBefore(false); // Reset result rendering flag

    // Reinitialize tool options with defaults if tool has options
    if (toolConfig && toolConfig.hasOptions) {
      const defaultOptions = {};
      Object.keys(toolConfig.options).forEach((key) => {
        defaultOptions[key] = toolConfig.options[key].default;
      });
      setOptions(defaultOptions);
    }
  };

  // Public reset function for component
  // Also cleans up localStorage to prevent stale data
  const resetComponent = () => {
    resetToInitialState(); // Reset state
    // Clean up localStorage entries
    localStorage.removeItem(`dropzone_last_result`);
    localStorage.removeItem(`came_from_tool`);
  };

  // File drop handler for dropzone component
  // Handles file uploads to the server and initial state setup
  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Return early if no files were dropped
      if (acceptedFiles.length === 0) return;

      // Get the first accepted file (single file upload)
      const file = acceptedFiles[0];
      setUploadedFile(file); // Store file object
      setProcessedImage(null); // Clear any previous processed image
      setShowDropZone(false); // Hide dropzone after upload

      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append("image", file); // Append file with key "image"

      try {
        // Set uploading state
        setStatus(COMPONENT_STATES.UPLOADING);
        setMessage("Uploading image to server");

        // Make upload request to image processing API
        const uploadRes = await fetch(
          "https://picsharps-api.onrender.com/api/v1/image/upload",
          {
            method: "POST",
            body: formData, // Send FormData with file
          }
        );

        // Parse response JSON
        const uploadData = await uploadRes.json();

        // Check if upload was successful
        if (uploadData.status !== "success") {
          // Handle upload failure
          setStatus(COMPONENT_STATES.ERROR);
          setMessage(uploadData.message || "Image upload failed");
          toast.error(uploadData.message || "Upload failed");
          resetComponent(); // Reset on error
          return;
        }

        // Extract data from successful response
        const { sourceImageId, sourceUrl } = uploadData.data;

        // Update state with uploaded image data
        setSourceImageId(sourceImageId); // Server-generated image ID
        setUploadedImageUrl(sourceUrl); // URL of uploaded image
        setStatus(COMPONENT_STATES.DONE); // Set status to done
        setMessage("Image uploaded successfully");

        // Show options panel if tool supports configurable options
        if (toolConfig && toolConfig.hasOptions) {
          setShowOptions(true);
        }
      } catch (error) {
        // Handle network or unexpected errors
        console.error("DropZone upload error:", error);
        setStatus(COMPONENT_STATES.ERROR);
        setMessage("Network error occurred during upload");
        toast.error("Network error occurred");
        resetComponent(); // Reset on error
      }
    },
    [toolConfig] // Dependency: toolConfig for option handling
  );

  // Main image processing function
  // Routes to appropriate tool function based on currentTool
  const processImage = useCallback(async () => {
    // Validation: ensure we have required data
    if (!sourceImageId || !uploadedImageUrl) {
      toast.error("No image available for processing");
      return;
    }

    try {
      // Set processing state
      setStatus(COMPONENT_STATES.PROCESSING);
      setMessage("Processing image with selected tool");
      setShowOptions(false); // Hide options during processing

      // Variable to store tool processing result
      let toolResult = null;

      // Route processing based on current tool type
      // Each tool has its own specific parameters and processing logic

      // Image enhancement tool
      if (currentTool === TOOL_TYPES.ENHANCE) {
        toolResult = await enhanceImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          upscaleFactor: options.upscaleFactor, // Enhancement level
        });
      }

      // Cartoon effect tool
      else if (currentTool === TOOL_TYPES.CARTOON) {
        toolResult = await cartoonPhoto({
          sourceImageId,
          imageUrl: uploadedImageUrl,
        });
      }

      // Image flipping tool
      else if (currentTool === TOOL_TYPES.FLIP) {
        toolResult = await flipImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          direction: options.direction, // Horizontal or vertical flip
        });
      }

      // Image resizing tool
      else if (currentTool === TOOL_TYPES.RESIZE) {
        // Validate that at least one dimension is provided
        if (!options.width && !options.height) {
          toast.error("Please specify width or height for resizing");
          setStatus(COMPONENT_STATES.ERROR);
          setMessage("Please enter at least width or height");
          return;
        }

        toolResult = await resizeImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          width: options.width, // Target width in pixels
          height: options.height, // Target height in pixels
          mode: options.mode, // Resize mode (contain, cover, etc.)
        });
      }

      // Image rotation tool
      else if (currentTool === TOOL_TYPES.ROTATE) {
        toolResult = await rotateImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          angle: options.angle, // Rotation angle in degrees
        });
      }

      // Image sharpening tool
      else if (currentTool === TOOL_TYPES.SHARPEN) {
        toolResult = await sharpenImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          strength: options.strength, // Sharpening intensity
        });
      }

      // Background removal tool
      else if (currentTool === TOOL_TYPES.REMOVE) {
        // Construct payload for background removal
        // Background removal has specific output requirements
        const payload = {
          sourceImageId,
          imageUrl: uploadedImageUrl,
          outputType: "cutout", // Type of output (cutout image)
          format: "png", // Output format (PNG for transparency)
        };

        // Add background color only if not transparent
        // Transparent background is the default option
        if (options.bgColor && options.bgColor !== "transparent") {
          payload.bgColor = options.bgColor; // Hex color value
        }

        console.log("Background removal payload:", payload);
        toolResult = await removeBackground(payload);
      }

      // blur tool
      else if (currentTool === TOOL_TYPES.BLUR) {
        toolResult = await blurImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          amount: options.amount, // Enhancement level
        });
      }

      // grayscale tool
      else if (currentTool === TOOL_TYPES.GRAYSCALE) {
        toolResult = await grayscalePhoto({
          sourceImageId,
          imageUrl: uploadedImageUrl,
        });
      }

      // Handle successful processing result
      if (toolResult) {
        // Update state with processed image
        setProcessedImage(toolResult.previewUrl);
        setStatus(COMPONENT_STATES.DONE);
        setMessage("Image processing completed successfully");
        setShowOptions(true); // Show options panel again
        setRenderedResultBefore(true); // Mark that result has been rendered

        // Save result to localStorage for tool-to-tool navigation
        // This enables users to chain multiple tools
        const resultData = {
          sourceImageId,
          previewUrl: toolResult.previewUrl,
          originalUrl: uploadedImageUrl,
          tool: currentTool, // Track which tool created this result
        };
        localStorage.setItem(
          `dropzone_last_result`,
          JSON.stringify(resultData)
        );
      } else {
        // Throw error if processing returned no result
        throw new Error("Tool processing returned no result");
      }
    } catch (error) {
      // Handle processing errors
      console.error("DropZone processing error:", error);
      setStatus(COMPONENT_STATES.ERROR);
      setMessage("Image processing failed");
      toast.error("Processing failed");

      // Restore options panel on error for user to retry
      if (toolConfig && toolConfig.hasOptions) {
        setShowOptions(true);
      }
    }
  }, [sourceImageId, uploadedImageUrl, currentTool, options, toolConfig]);

  // Handler for tool option changes
  // Updates options state and may trigger auto-processing for certain tools
  const handleOptionChange = (optionKey, value) => {
    const newOptions = { ...options, [optionKey]: value };
    setOptions(newOptions);
  };

  // Navigation function for tool chaining
  // Allows user to take processed image to another tool
  const goToTool = (toolPath) => {
    // Validate that we have a processed image
    if (!processedImage) {
      toast.error("No processed image available for tool navigation");
      return;
    }

    // Set flag to indicate navigation from another tool
    // This will be read by the target tool's initialization
    localStorage.setItem("came_from_tool", "true");

    // Save current result for the next tool
    const resultData = {
      sourceImageId,
      previewUrl: processedImage,
      originalUrl: uploadedImageUrl,
      tool: currentTool, // Track source tool for context
    };
    localStorage.setItem(`dropzone_last_result`, JSON.stringify(resultData));

    // Navigate to the selected tool
    navigate(`/${toolPath}`);
  };

  // Dropzone configuration using react-dropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, // File drop handler
    accept: {
      "image/jpeg": [".jpeg", ".jpg"], // JPEG formats
      "image/png": [".png"], // PNG format
      "image/webp": [".webp"], // WebP format
    },
    maxSize: 10 * 1024 * 1024, // 10MB file size limit
    multiple: false, // Single file upload only
    disabled:
      status === COMPONENT_STATES.UPLOADING ||
      status === COMPONENT_STATES.PROCESSING, // Disable during operations
  });

  // Prepare list of available tools for navigation dropdown
  // Filters out current tool to prevent self-navigation
  const availableTools = Object.keys(TOOL_CONFIG)
    .filter((tool) => tool !== currentTool) // استبعاد الأداة الحالية
    .map((tool) => ({
      path: tool,
      label: TOOL_CONFIG[tool].name,
    }));

  // Component render function
  return (
    <div>
      {/* Dropzone area for file upload - only shown when showDropZone is true */}
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

      {/* Main content area for displaying images and options */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
          backgroundColor: "yellow",
        }}
      >
        {/* Loading states: Uploading or Processing */}
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

        {/* After successful upload display */}
        {uploadedImageUrl &&
          status !== COMPONENT_STATES.UPLOADING &&
          status !== COMPONENT_STATES.PROCESSING && (
            <>
              {/* Original image display section */}
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
              {/* Conditional rendering based on tool configuration and state */}
              {((showOptions && toolConfig?.hasOptions) ||
                (uploadedImageUrl &&
                  toolConfig &&
                  !toolConfig.hasOptions &&
                  !processedImage &&
                  status !== COMPONENT_STATES.PROCESSING) ||
                renderedResultBefore === false) && (
                <div className="flex flex-col gap-4 bg-amber-300">
                  {/* Options panel for tools with configurable settings */}
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
                        {/* Dynamic title based on current tool */}
                        {currentTool === TOOL_TYPES.ENHANCE
                          ? "Level"
                          : currentTool === TOOL_TYPES.FLIP
                          ? "Direction"
                          : currentTool === TOOL_TYPES.RESIZE
                          ? "Settings"
                          : currentTool === TOOL_TYPES.ROTATE
                          ? "Angle"
                          : currentTool === TOOL_TYPES.SHARPEN
                          ? "Strength"
                          : currentTool === TOOL_TYPES.REMOVE
                          ? "Bg Color"
                          : currentTool === TOOL_TYPES.BLUR
                          ? "Amount"
                          : ""}
                      </h4>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "15px",
                        }}
                      >
                        {/* Enhancement tool options */}
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

                        {/* Rotate tool options */}
                        {currentTool === TOOL_TYPES.ROTATE && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            {toolConfig.options.angle.values.map((option) => {
                              const isSelected = options.angle === option.value;

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
                                    name="angle"
                                    value={option.value}
                                    checked={isSelected}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "angle",
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
                            })}
                          </div>
                        )}

                        {/* Sharpen tool options */}
                        {currentTool === TOOL_TYPES.SHARPEN && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            {toolConfig.options.strength.values.map(
                              (option) => {
                                const isSelected =
                                  options.strength === option.value;

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
                                      name="strength"
                                      value={option.value}
                                      checked={isSelected}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          "strength",
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

                        {/* Background removal tool options */}
                        {currentTool === TOOL_TYPES.REMOVE && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            {[
                              { value: "transparent", label: "Transparent" },
                              { value: "color", label: "Color" },
                            ].map((option) => {
                              const isSelected =
                                !options.bgColor ||
                                options.bgColor === "transparent"
                                  ? option.value === "transparent"
                                  : option.value === "color";

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
                                    name="bgColorType"
                                    value={option.value}
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      handleOptionChange(
                                        "bgColor",
                                        value === "transparent"
                                          ? "transparent"
                                          : "#ffffff"
                                      );
                                    }}
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
                            })}

                            {/* Color picker for background color selection */}
                            {options.bgColor &&
                              options.bgColor !== "transparent" && (
                                <div style={{ marginTop: "10px" }}>
                                  <SketchPicker
                                    color={options.bgColor}
                                    onChangeComplete={(color) => {
                                      handleOptionChange("bgColor", color.hex);
                                    }}
                                  />
                                </div>
                              )}

                            {/* Manual processing button for background removal */}
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
                                marginTop: "10px",
                              }}
                            >
                              <Rocket size={18} />
                              Start Processing
                            </button>
                          </div>
                        )}

                        {currentTool === TOOL_TYPES.BLUR && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            {toolConfig.options.amount.values.map((option) => {
                              const isSelected =
                                options.amount === option.value;

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
                                    name="amount"
                                    value={option.value}
                                    checked={isSelected}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "amount",
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
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Start and reset buttons for tools without options */}
                  {(uploadedImageUrl &&
                    toolConfig &&
                    !toolConfig.hasOptions &&
                    !processedImage &&
                    status !== COMPONENT_STATES.PROCESSING) ||
                  renderedResultBefore === false ? (
                    <div>
                      {/* Start processing button for tools without configurable options */}
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

                      {/* Reset button to change photo before processing */}
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

              {/* Processed image result display */}
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

                  {/* Image comparison component for before/after visualization */}
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

        {/* Post-processing action buttons */}
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
                backgroundColor: "red",
              }}
              className={`items-center ${"md:items-start"}`}
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
                {/* Download button for processed image */}
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

                {/* Tool selection dropdown for chaining operations */}
                {availableTools.length > 0 ? (
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
                ) : (
                  ""
                )}
              </div>

              {/* Reset button to start over with new photo */}
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

        {/* Error state display */}
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
              Use another photo with this tool
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
    </div>
  );
};

export default DropZone;
