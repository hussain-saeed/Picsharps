import { useState, useEffect, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { LanguageContext } from "/src/context/LanguageContext";

// Import tool functions for image processing
import { enhanceImage } from "../tools/enhanceTool";
import { cartoonPhoto } from "../tools/cartoonTool";
import { resizeImage } from "../tools/resizeTool";
import { sharpenImage } from "../tools/sharpenTool";
import { removeBackground } from "../tools/removeBackgroundTool";
import { blurImage } from "../tools/blurTool";
import { grayscalePhoto } from "../tools/grayscaleTool";
import { roundedCornerImage } from "../tools/roundedCornerTool";
import { oilPaintEffect } from "../tools/oilPaintEffectTool";
import { adjustImage } from "../tools/adjustTool";

// Import configuration and components
import { TOOL_CONFIG } from "../config/toolConfig";
import ImageCompare from "../../../components/ImageCompare";
import { Download, Play, RefreshCw, Rocket } from "lucide-react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
} from "@mui/material";
import { SketchPicker } from "react-color";
import { useAuth } from "../../auth/AuthProvider";
import { OptionSlider } from "./OptionSlider";
import { BACKEND_URL } from "../../../api";
import { useScrollToVH } from "../../../hooks/useScrollToVH";

import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
const translations = { English, Arabic };

const DropZone = () => {
  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

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
    ROUNDED: "rounded-corner-image",
    OILING: "oil-paint-effect",
    ADJUST: "adjust-image",
  };

  const COMPONENT_STATES = {
    IDLE: "idle", // Initial state, waiting for user action
    UPLOADING: "uploading", // Uploading image to server
    PROCESSING: "processing", // Processing image with selected tool
    DONE: "done", // Processing completed successfully
    ERROR: "error", // An error occurred during upload or processing
  };

  // Navigation and routing hooks
  const navigate = useNavigate(); // For programmatic navigation between tools
  const location = useLocation(); // To access current URL path

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
  const [toolKey, setToolKey] = useState(null);
  const [status, setStatus] = useState(COMPONENT_STATES.IDLE); // Current component state
  const [showDropZone, setShowDropZone] = useState(true); // Toggle dropzone visibility
  const [showOptions, setShowOptions] = useState(false); // Toggle tool options panel
  const [options, setOptions] = useState({}); // Tool-specific options
  const [renderedResultBefore, setRenderedResultBefore] = useState(false); // Track if result was shown before
  const { accessToken } = useAuth();
  const scrollToVH = useScrollToVH();
  const [isDownloading, setIsDownloading] = useState(false);

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

        if (parsedResult.tool !== currentTool) {
          // Restore state from stored result
          setUploadedImageUrl(parsedResult.previewUrl);
          setSourceImageId(parsedResult.sourceImageId);
          setShowDropZone(false); // Hide dropzone since we have an image
          setShowOptions(true); // Show options panel for processing
          setStatus(COMPONENT_STATES.DONE); // Set status to done

          // Clean up transition flags after successful restoration
          localStorage.removeItem(FROM_TOOL_KEY);
          localStorage.removeItem(LS_KEY);
        } else {
          // If same tool, reset to initial state
          resetToInitialState();
        }
      } catch (error) {
        toast.error(t["Something Went Wrong!"]);
        resetToInitialState(); // Reset on parsing error
      }
    } else {
      // No stored data, initialize with default state
      resetToInitialState();
    }

    if (toolConfig && toolConfig.hasOptions) {
      const defaultOptions = {};
      // Iterate through each option defined in toolConfig
      Object.keys(toolConfig.options).forEach((key) => {
        defaultOptions[key] = toolConfig.options[key].default;
      });
      setOptions(defaultOptions);
    }
  }, [currentTool]); // Only run when currentTool changes

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

    // Background removal and resize tool requires manual processing due to complexity
    if (currentTool === TOOL_TYPES.REMOVE) return;
    if (currentTool === TOOL_TYPES.RESIZE) return;

    // Check if all options have valid values (not null)
    if (Object.values(options).includes(null)) return;

    // All conditions met, proceed with automatic processing
    processImage();
  }, [options]); // Run whenever options state changes

  const resetToInitialState = () => {
    // Clear all image-related state
    setUploadedFile(null);
    setUploadedImageUrl(null);
    setSourceImageId(null);
    setProcessedImage(null);
    setToolKey(null);

    // Reset component state and UI
    setStatus(COMPONENT_STATES.IDLE);
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

  const resetComponent = () => {
    scrollToVH(5);

    resetToInitialState(); // Reset state
    // Clean up localStorage entries
    localStorage.removeItem(`dropzone_last_result`);
    localStorage.removeItem(`came_from_tool`);
  };

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
      scrollToVH(30);

      try {
        // Set uploading state
        setStatus(COMPONENT_STATES.UPLOADING);

        // Make upload request to image processing API
        const uploadRes = await fetch(`${BACKEND_URL}/image/upload`, {
          method: "POST",
          body: formData, // Send FormData with file
        });

        // Parse response JSON
        const uploadData = await uploadRes.json();

        // Check if upload was successful
        if (uploadData.status !== "success") {
          // Handle upload failure
          setStatus(COMPONENT_STATES.ERROR);
          toast.error(t["Something Went Wrong!"]);
          resetComponent(); // Reset on error
          return;
        }

        // Extract data from successful response
        const { sourceImageId, sourceUrl } = uploadData.data;

        // Update state with uploaded image data
        setSourceImageId(sourceImageId); // Server-generated image ID
        setUploadedImageUrl(sourceUrl); // URL of uploaded image
        setStatus(COMPONENT_STATES.DONE); // Set status to done

        // Show options panel if tool supports configurable options
        if (toolConfig && toolConfig.hasOptions) {
          setShowOptions(true);
        }
      } catch (error) {
        // Handle network or unexpected errors
        setStatus(COMPONENT_STATES.ERROR);
        toast.error(t["Something Went Wrong!"]);
        resetComponent(); // Reset on error
      }
    },
    [toolConfig] // Dependency: toolConfig for option handling
  );

  const processImage = useCallback(async () => {
    scrollToVH(30);

    // Validation: ensure we have required data
    if (!sourceImageId || !uploadedImageUrl) {
      toast.error(t["Something Went Wrong!"]);
      return;
    }

    try {
      // Set processing state
      setStatus(COMPONENT_STATES.PROCESSING);
      setShowOptions(false); // Hide options during processing

      // Variable to store tool processing result
      let toolResult = null;

      // Image enhancement tool
      if (currentTool === TOOL_TYPES.ENHANCE) {
        toolResult = await enhanceImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          upscaleFactor: options.upscaleFactor, // Enhancement level
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        });
      }

      // Cartoon effect tool
      else if (currentTool === TOOL_TYPES.CARTOON) {
        toolResult = await cartoonPhoto({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        });
      }

      // Image resizing tool
      else if (currentTool === TOOL_TYPES.RESIZE) {
        // Validate that at least one dimension is provided
        if (!options.width && !options.height) {
          setStatus(COMPONENT_STATES.ERROR);
          return;
        }

        toolResult = await resizeImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          width: options.width, // Target width in pixels
          height: options.height, // Target height in pixels
          mode: options.mode, // Resize mode (contain, cover, etc.)
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        });
      }

      // Image sharpening tool
      else if (currentTool === TOOL_TYPES.SHARPEN) {
        toolResult = await sharpenImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          strength: options.strength, // Sharpening intensity
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        });
      }

      // Background removal tool
      else if (currentTool === TOOL_TYPES.REMOVE) {
        const payload = {
          sourceImageId,
          imageUrl: uploadedImageUrl,
          outputType: "cutout", // Type of output (cutout image)
          format: "png", // Output format (PNG for transparency)
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        };

        if (options.bgColor && options.bgColor !== "transparent") {
          payload.bgColor = options.bgColor; // Hex color value
        }

        toolResult = await removeBackground(payload);
      }

      // blur tool
      else if (currentTool === TOOL_TYPES.BLUR) {
        toolResult = await blurImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          amount: options.amount, // Enhancement level
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        });
      }

      // grayscale tool
      else if (currentTool === TOOL_TYPES.GRAYSCALE) {
        toolResult = await grayscalePhoto({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        });
      }

      // rounded
      else if (currentTool === TOOL_TYPES.ROUNDED) {
        toolResult = await roundedCornerImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          radius: options.radius,
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        });
      }

      // oiling
      else if (currentTool === TOOL_TYPES.OILING) {
        toolResult = await oilPaintEffect({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          amount: options.amount,
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        });
      }

      // adjust
      else if (currentTool === TOOL_TYPES.ADJUST) {
        toolResult = await adjustImage({
          sourceImageId,
          imageUrl: uploadedImageUrl,
          brightness: options.brightness,
          contrast: options.contrast,
          saturation: options.saturation,
          gamma: options.gamma,
          accessToken,
          customMsg:
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          customMsg2:
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          generalMsg: t["Something Went Wrong!"],
        });
      }

      // Handle successful processing result
      if (toolResult) {
        // Update state with processed image
        setProcessedImage(toolResult.previewUrl);
        setToolKey(toolResult.toolKey);
        setStatus(COMPONENT_STATES.DONE);
        setShowOptions(true); // Show options panel again
        setRenderedResultBefore(true); // Mark that result has been rendered

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
      setStatus(COMPONENT_STATES.ERROR);

      // Restore options panel on error for user to retry
      if (toolConfig && toolConfig.hasOptions) {
        setShowOptions(true);
      }
    }
  }, [sourceImageId, uploadedImageUrl, currentTool, options, toolConfig]);

  const handleOptionChange = (optionKey, value) => {
    const newOptions = { ...options, [optionKey]: value };
    setOptions(newOptions);
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
    setIsDownloading(true);
    const downloadPromise = downloadImage(
      processedImage,
      `${currentTool}-result.png`
    );
    const serverPromise = fetch(`${BACKEND_URL}/image/save-result`, {
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

    const [downloadRes, serverRes] = await Promise.allSettled([
      downloadPromise,
      serverPromise,
    ]);

    const localSuccess = downloadRes.status === "fulfilled";
    const serverSuccess = serverRes.status === "fulfilled";

    if (localSuccess && serverSuccess) {
      toast.success(t["Successfully saved locally and to your downloads!"]);
    } else if (!localSuccess && !serverSuccess) {
      toast.error(t["Failed saving locally and to your downloads!"]);
    } else if (localSuccess && !serverSuccess) {
      toast.warn(
        t["Successfully saved locally but failed saving to your downloads!"]
      );
    } else {
      toast.warn(
        t["Failed saving locally but successfully saved to your downloads!"]
      );
    }
    setIsDownloading(false);
  };

  const goToTool = (toolPath) => {
    // Validate that we have a processed image
    if (!processedImage) {
      return;
    }

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

  const availableTools = Object.keys(TOOL_CONFIG)
    .filter(
      (tool) =>
        tool !== currentTool && tool !== "flip-image" && tool !== "rotate-image"
    )
    .map((tool) => ({
      path: tool,
      label: TOOL_CONFIG[tool].name,
    }));

  // Component render function
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
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
                {t["Drag & Drop or Click to Upload"]}
              </h3>
              <p style={{ color: "#666" }} dir={isRTL ? "rtl" : "ltr"}>
                {t["Supported formats: PNG, JPG, JPEG, WEBP"]}
              </p>
              <p style={{ color: "#999" }}>{t["Max size: 10MB"]}</p>
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
                  ? t["Uploading ..."]
                  : t["Processing ..."]}
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
                  className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] relative"
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
                      left: isRTL ? "unset" : "10px",
                      right: isRTL ? "10px" : "unset",
                      borderRadius: "10px",
                      padding: "2px 8px",
                    }}
                  >
                    {t["ORIGINAL"]}
                  </h3>
                </div>
              </div>

              {((showOptions && toolConfig.hasOptions) ||
                (uploadedImageUrl &&
                  toolConfig &&
                  !processedImage &&
                  status !== COMPONENT_STATES.PROCESSING) ||
                renderedResultBefore === false) && (
                <div className="flex flex-col gap-4">
                  {/* Options panel for tools with configurable settings */}
                  {
                    <div
                      style={{
                        background: "#f8f9fa",
                        padding: "9px 12px 12px 12px",
                        borderRadius: "10px",
                        border: "1px solid #e9ecef",
                      }}
                      className="space-y-12"
                    >
                      {showOptions && toolConfig.hasOptions && (
                        <>
                          <h4
                            style={{
                              marginBottom: "12px",
                              color: "#333",
                              textAlign: "start",
                            }}
                          >
                            {/* Dynamic title based on current tool */}
                            {currentTool === TOOL_TYPES.ENHANCE
                              ? t["Level"]
                              : currentTool === TOOL_TYPES.SHARPEN
                              ? t["Strength"]
                              : currentTool === TOOL_TYPES.BLUR
                              ? t["Amount"]
                              : currentTool === TOOL_TYPES.ROUNDED
                              ? t["Radius"]
                              : currentTool === TOOL_TYPES.OILING
                              ? t["Amount"]
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
                                          width: "120px",
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
                                            status ===
                                            COMPONENT_STATES.PROCESSING
                                          }
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            cursor: "pointer",
                                          }}
                                        />

                                        <span
                                          style={{
                                            fontWeight: 500,
                                            color: "#333",
                                          }}
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
                                    placeholder="e.g. 600"
                                    value={options.width}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        "width",
                                        parseInt(e.target.value) || 5
                                      )
                                    }
                                    disabled={
                                      status === COMPONENT_STATES.PROCESSING
                                    }
                                    InputProps={{ inputProps: { min: 5 } }}
                                    sx={{ marginTop: "5px" }}
                                  />
                                </div>

                                <div
                                  style={{
                                    textAlign: "left",
                                    marginTop: "10px",
                                  }}
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
                                        parseInt(e.target.value) || 5
                                      )
                                    }
                                    disabled={
                                      status === COMPONENT_STATES.PROCESSING
                                    }
                                    InputProps={{ inputProps: { min: 5 } }}
                                  />
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                  }}
                                >
                                  {toolConfig.options.mode.values.map(
                                    (option) => {
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
                                              status ===
                                              COMPONENT_STATES.PROCESSING
                                            }
                                            sx={{
                                              padding: 0,
                                              "& .MuiSvgIcon-root": {
                                                fontSize: 16,
                                              },
                                            }}
                                          />
                                          <span
                                            style={{
                                              fontWeight: 500,
                                              color: "#333",
                                            }}
                                          >
                                            {t[option.label]}
                                          </span>
                                        </label>
                                      );
                                    }
                                  )}
                                </div>

                                <button
                                  onClick={processImage}
                                  disabled={
                                    status === COMPONENT_STATES.PROCESSING
                                  }
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
                                    fontSize: "16px",
                                    width: "fit-content",
                                  }}
                                >
                                  {isRTL ? (
                                    <Play
                                      size={18}
                                      style={{ transform: "rotate(180deg)" }}
                                    />
                                  ) : (
                                    <Play size={18} />
                                  )}
                                  {t["Start Processing"]}
                                </button>
                              </>
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
                                          width: "120px",
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
                                            status ===
                                            COMPONENT_STATES.PROCESSING
                                          }
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            cursor: "pointer",
                                          }}
                                        />

                                        <span
                                          style={{
                                            fontWeight: 500,
                                            color: "#333",
                                          }}
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
                                  {
                                    value: "transparent",
                                    label: t["Transparent"],
                                  },
                                  { value: "color", label: t["Color"] },
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
                                        width: "185px",
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
                                        style={{
                                          fontWeight: 500,
                                          color: "#333",
                                        }}
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
                                          handleOptionChange(
                                            "bgColor",
                                            color.hex
                                          );
                                        }}
                                      />
                                    </div>
                                  )}

                                {/* Manual processing button for background removal */}
                                <button
                                  onClick={processImage}
                                  disabled={
                                    status === COMPONENT_STATES.PROCESSING
                                  }
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
                                  {isRTL ? (
                                    <Play
                                      size={18}
                                      style={{ transform: "rotate(180deg)" }}
                                    />
                                  ) : (
                                    <Play size={18} />
                                  )}
                                  {t["Start Processing"]}
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
                                {toolConfig.options.amount.values.map(
                                  (option) => {
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
                                          width: "120px",
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
                                            status ===
                                            COMPONENT_STATES.PROCESSING
                                          }
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            cursor: "pointer",
                                          }}
                                        />

                                        <span
                                          style={{
                                            fontWeight: 500,
                                            color: "#333",
                                          }}
                                        >
                                          {option.label}
                                        </span>
                                      </label>
                                    );
                                  }
                                )}
                              </div>
                            )}

                            {currentTool === TOOL_TYPES.ROUNDED && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                }}
                              >
                                {toolConfig.options.radius.values.map(
                                  (option) => {
                                    const isSelected =
                                      options.radius === option.value;

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
                                          width: "120px",
                                        }}
                                      >
                                        <input
                                          type="radio"
                                          name="radius"
                                          value={option.value}
                                          checked={isSelected}
                                          onChange={(e) =>
                                            handleOptionChange(
                                              "radius",
                                              parseInt(e.target.value)
                                            )
                                          }
                                          disabled={
                                            status ===
                                            COMPONENT_STATES.PROCESSING
                                          }
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            cursor: "pointer",
                                          }}
                                        />

                                        <span
                                          style={{
                                            fontWeight: 500,
                                            color: "#333",
                                          }}
                                        >
                                          {option.label}
                                        </span>
                                      </label>
                                    );
                                  }
                                )}
                              </div>
                            )}

                            {currentTool === TOOL_TYPES.OILING && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                }}
                              >
                                {toolConfig.options.amount.values.map(
                                  (option) => {
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
                                          width: "120px",
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
                                            status ===
                                            COMPONENT_STATES.PROCESSING
                                          }
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            cursor: "pointer",
                                          }}
                                        />

                                        <span
                                          style={{
                                            fontWeight: 500,
                                            color: "#333",
                                          }}
                                        >
                                          {option.label}
                                        </span>
                                      </label>
                                    );
                                  }
                                )}
                              </div>
                            )}

                            {currentTool === TOOL_TYPES.ADJUST && (
                              <div className="w-[200px]">
                                {Object.entries(toolConfig.options).map(
                                  ([key, config]) => {
                                    const flipValue = (val) =>
                                      isRTL
                                        ? config.max + config.min - val
                                        : val;

                                    return (
                                      <OptionSlider
                                        key={key}
                                        label={t[config.label]}
                                        value={flipValue(options[key])}
                                        min={config.min}
                                        max={config.max}
                                        step={config.step}
                                        disabled={
                                          status === COMPONENT_STATES.PROCESSING
                                        }
                                        onPreviewChange={(val) =>
                                          handleOptionChange(
                                            key,
                                            flipValue(val)
                                          )
                                        }
                                        onCommitChange={(val) => {
                                          handleOptionChange(
                                            key,
                                            flipValue(val)
                                          );
                                        }}
                                      />
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        </>
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
                                disabled={
                                  status === COMPONENT_STATES.PROCESSING
                                }
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
                                  fontSize: "16px",
                                  marginBottom: "10px",
                                }}
                              >
                                {isRTL ? (
                                  <Play
                                    size={18}
                                    style={{ transform: "rotate(180deg)" }}
                                  />
                                ) : (
                                  <Play size={18} />
                                )}
                                {t["Start Processing"]}
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
                              {t["Change Photo"]}
                            </button>
                          )}
                        </div>
                      ) : null}
                    </div>
                  }
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
                            letterSpacing: "2px",
                            position: "absolute",
                            opacity: "0.5",
                            bottom: "10px",
                            left: isRTL ? "unset" : "10px",
                            right: isRTL ? "10px" : "unset",
                            borderRadius: "10px",
                            padding: "2px 8px",
                          }}
                        >
                          {t["PROCESSED"]}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Image comparison component for before/after visualization */}
                  {currentTool === TOOL_TYPES.RESIZE ? (
                    ""
                  ) : (
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
                  )}
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
                width: "100%",
              }}
              className={`items-center`}
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
                {accessToken ? (
                  <button
                    dir={isRTL ? "rtl" : "ltr"}
                    onClick={() => {
                      isDownloading === true ? null : saveResult();
                    }}
                    disabled={isDownloading === true}
                    style={{
                      cursor:
                        isDownloading === true ? "not-allowed" : "pointer",
                      opacity: isDownloading === true ? "0.5" : "1",
                      padding: "10px 18px",
                      background: "var(--gradient-color)",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "15px",
                      fontWeight: 500,
                    }}
                  >
                    <Download size={18} />
                    {isDownloading === true
                      ? t["Loading ..."]
                      : t["Download Result"]}
                  </button>
                ) : (
                  ""
                )}

                {/* Tool selection dropdown for chaining operations */}
                {availableTools.length > 0 ? (
                  <FormControl
                    size="medium"
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "440px",
                      },
                      direction: isRTL ? "rtl" : "ltr",
                      "& *": {
                        fontFamily: "inherit !important",
                      },
                      "& .MuiInputLabel-root": {
                        right: isRTL ? 0 : "auto",
                        left: isRTL ? "auto" : 0,
                        top: isRTL ? -5 : "auto",
                        width: "100%",
                        textAlign: isRTL ? "right" : "left",
                        transformOrigin: isRTL ? "right" : "left",
                        paddingRight: isRTL ? "24px" : "0",
                      },
                      "& .MuiInputLabel-shrink": {
                        transform: isRTL
                          ? "translate(0, -1.5px) scale(0.75)"
                          : "translate(14px, -9px) scale(0.75)",
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
                    <InputLabel id="tool-select-label">
                      {t["Select a tool to process the result with ..."]}
                    </InputLabel>

                    <Select
                      labelId="tool-select-label"
                      defaultValue=""
                      label={t["Select a tool to process the result with ..."]}
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
                  fontSize: "16px",
                  marginLeft: "0",
                }}
              >
                <RefreshCw size={18} />
                {t["Change Photo"]}
              </button>
            </div>
          </div>
        )}

        {/* CSS animation for loading indicator */}
        <style>{`
          @keyframes loading {
            0% {
              transform: ${isRTL ? "translateX(100%)" : "translateX(-100%)"};
            }
            100% {
              transform: ${isRTL ? "translateX(-300%)" : "translateX(300%)"};
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DropZone;
