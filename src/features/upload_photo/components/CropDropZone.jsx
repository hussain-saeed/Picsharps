import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { TOOL_CONFIG } from "../config/toolConfig";
import ImageCompare from "../../../components/ImageCompare";
import { Download, Play, RefreshCw } from "lucide-react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAuth } from "../../auth/AuthProvider";
import { BACKEND_URL } from "../../../api";
import { useScrollToVH } from "../../../hooks/useScrollToVH";
import { LanguageContext } from "/src/context/LanguageContext";
import { useNavigate } from "react-router-dom";

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

const CropDropZone = () => {
  const navigate = useNavigate();

  const { language, direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";
  const t = translations[language] || translations["English"];

  const COMPONENT_STATES = {
    IDLE: "idle",
    UPLOADING: "uploading",
    PROCESSING: "processing",
    DONE: "done",
    ERROR: "error",
  };

  const currentTool = "crop-image";
  const { accessToken, openLoginPopup } = useAuth();

  // State declarations
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [sourceImageId, setSourceImageId] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [toolKey, setToolKey] = useState(null);
  const [status, setStatus] = useState(COMPONENT_STATES.IDLE);
  const [showDropZone, setShowDropZone] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Cropper states - start with all zeros so first load logic can detect it
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState("free");
  const [imageScale, setImageScale] = useState(1);
  const [containerSize, setContainerSize] = useState({
    width: 300,
    height: 300,
  });
  const scrollToVH = useScrollToVH();
  
  // Ref to track if this is the first image load (not returning from processing)
  const isFirstLoadRef = useRef(true);
  const hasUserAdjustedCropRef = useRef(false);

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
      } catch {
        toast.error(t["Something Went Wrong!"]);
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
      // Mark that user has adjusted the crop (via aspect ratio change)
      hasUserAdjustedCropRef.current = true;
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
    scrollToVH(0);

    setUploadedFile(null);
    setUploadedImageUrl(null);
    setSourceImageId(null);
    setProcessedImage(null);
    setToolKey(null);
    setStatus(COMPONENT_STATES.IDLE);
    setShowDropZone(true);
    setShowOptions(false);
    // Reset to empty state so first load logic will set default rectangle
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    setAspectRatio("free");
    setImageScale(1);
    
    // Reset refs to allow first load logic to run again
    isFirstLoadRef.current = true;
    hasUserAdjustedCropRef.current = false;

    // Reset image element styles if it exists
    const img = document.getElementById("crop-image");
    if (img) {
      img.style.width = "";
      img.style.height = "";
      img.style.position = "";
      img.style.left = "";
      img.style.top = "";
      img.style.imageRendering = "";
    }
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
        toast.error(t["Something Went Wrong!"]);
        resetComponent();
        return;
      }

      const { sourceImageId, sourceUrl } = uploadData.data;

      setSourceImageId(sourceImageId);
      setUploadedImageUrl(sourceUrl);
      setStatus(COMPONENT_STATES.DONE);
      setShowOptions(true);
    } catch {
      setStatus(COMPONENT_STATES.ERROR);
      toast.error(t["Something Went Wrong!"]);
      resetComponent();
    }
  }, []);

  const handleImageLoad = (e) => {
    const img = e.target;
    const { naturalWidth, naturalHeight } = img;

    // Get container dimensions
    const container = img.parentElement;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    setContainerSize({ width: containerWidth, height: containerHeight });

    // Calculate how image fits with object-fit: contain (base size)
    const containerAspect = containerWidth / containerHeight;
    const imageAspect = naturalWidth / naturalHeight;

    let baseRenderedWidth, baseRenderedHeight;
    if (imageAspect > containerAspect) {
      // Image is wider - fit to width
      baseRenderedWidth = containerWidth;
      baseRenderedHeight = containerWidth / imageAspect;
    } else {
      // Image is taller - fit to height
      baseRenderedHeight = containerHeight;
      baseRenderedWidth = containerHeight * imageAspect;
    }

    // Calculate scale for small images (if naturalWidth < 300px)
    // This determines the actual rendered size the image will be displayed at
    let scale = 1;
    let renderedWidth = baseRenderedWidth;
    let renderedHeight = baseRenderedHeight;

    if (naturalWidth < 300) {
      // Calculate the scale needed to make the image at least 300px wide
      // while maintaining aspect ratio and fitting in container
      const minDisplayWidth = Math.min(300, containerWidth * 0.9);
      const scaleByWidth = minDisplayWidth / baseRenderedWidth;

      // Also check height constraint
      const scaledHeight = baseRenderedHeight * scaleByWidth;
      const scaleByHeight =
        scaledHeight > containerHeight * 0.9
          ? (containerHeight * 0.9) / baseRenderedHeight
          : scaleByWidth;

      scale = Math.min(scaleByWidth, scaleByHeight);

      // Calculate actual rendered dimensions (the image will be displayed at this size)
      renderedWidth = baseRenderedWidth * scale;
      renderedHeight = baseRenderedHeight * scale;
    }

    setImageScale(scale);

    // Calculate offset (centered position)
    // The image will be positioned at these offsets and sized to renderedWidth x renderedHeight
    const offsetLeft = (containerWidth - renderedWidth) / 2;
    const offsetTop = (containerHeight - renderedHeight) / 2;

    // Set the image element's actual dimensions to match the rendered size
    // This ensures the image fills the same area as the crop overlay
    img.style.width = `${renderedWidth}px`;
    img.style.height = `${renderedHeight}px`;
    img.style.position = "absolute";
    img.style.left = `${offsetLeft}px`;
    img.style.top = `${offsetTop}px`;

    // Use pixelated rendering for small images to keep pixels sharp when zoomed
    if (naturalWidth < 300) {
      img.style.imageRendering = "pixelated";
    } else {
      img.style.imageRendering = "auto";
    }

    setImageSize({
      width: renderedWidth,
      height: renderedHeight,
      naturalWidth,
      naturalHeight,
      offsetTop,
      offsetLeft,
    });

    // Initialize crop area only on the very first load (all zeros and first load flag)
    // Check if cropArea is completely empty (all zeros) AND this is the first load
    const isCropAreaEmpty = 
      cropArea.x === 0 && 
      cropArea.y === 0 && 
      cropArea.width === 0 && 
      cropArea.height === 0;
    
    if (isCropAreaEmpty && isFirstLoadRef.current && !hasUserAdjustedCropRef.current) {
      // First load: Set default small centered rectangle (150x100)
      const defaultWidth = 200;
      const defaultHeight = 300;
      const centerX = (renderedWidth - defaultWidth) / 2;
      const centerY = (renderedHeight - defaultHeight) / 2;
      
      setCropArea({
        x: Math.max(0, centerX),
        y: Math.max(0, centerY),
        width: Math.min(defaultWidth, renderedWidth),
        height: Math.min(defaultHeight, renderedHeight),
      });
      
      // Mark that we've done the first load
      isFirstLoadRef.current = false;
    } else if (!isCropAreaEmpty) {
      // User has adjusted crop or returning from processing: preserve and clamp to boundaries
      setCropArea((prev) => ({
        x: Math.max(
          0,
          Math.min(prev.x, renderedWidth - Math.min(prev.width, renderedWidth)),
        ),
        y: Math.max(
          0,
          Math.min(
            prev.y,
            renderedHeight - Math.min(prev.height, renderedHeight),
          ),
        ),
        width: Math.min(prev.width, renderedWidth),
        height: Math.min(prev.height, renderedHeight),
      }));
    }
  };

  // Helper function to get coordinates from mouse or touch event
  const getEventCoordinates = useCallback((e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }, []);

  // Unified handler for mouse and touch start events
  const handleStart = useCallback(
    (e, handle = null) => {
      e.preventDefault();
      e.stopPropagation();

      const coords = getEventCoordinates(e);

      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
      } else {
        setIsDragging(true);
      }

      setDragStart({
        x: coords.x,
        y: coords.y,
        cropX: cropArea.x,
        cropY: cropArea.y,
        cropWidth: cropArea.width,
        cropHeight: cropArea.height,
      });
    },
    [cropArea, getEventCoordinates],
  );

  // Get aspect ratio value helper
  const getAspectRatioValue = useCallback(() => {
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
  }, [aspectRatio]);

  // Unified handler for mouse and touch move events
  const handleMove = useCallback(
    (e) => {
      if (!isDragging && !isResizing) return;
      if (!imageSize.width || !imageSize.height) return;

      const coords = getEventCoordinates(e);
      const deltaX = coords.x - dragStart.x;
      const deltaY = coords.y - dragStart.y;

      if (isDragging) {
        // Strict boundary clamping - ensure cropArea stays within visible image
        const maxX = imageSize.width - cropArea.width;
        const maxY = imageSize.height - cropArea.height;

        const newX = Math.max(0, Math.min(maxX, dragStart.cropX + deltaX));
        const newY = Math.max(0, Math.min(maxY, dragStart.cropY + deltaY));

      setCropArea((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
      // Mark that user has adjusted the crop
      hasUserAdjustedCropRef.current = true;
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
            newCrop.y =
              dragStart.cropY + (dragStart.cropHeight - newCrop.height);
            break;
          case "tr":
            newCrop.width = Math.max(50, dragStart.cropWidth + deltaX);
            newCrop.height = aspectValue
              ? newCrop.width / aspectValue
              : Math.max(50, dragStart.cropHeight - deltaY);
            newCrop.y =
              dragStart.cropY + (dragStart.cropHeight - newCrop.height);
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
            newCrop.y =
              dragStart.cropY + (dragStart.cropHeight - newCrop.height);
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

        // Strict boundary clamping - ensure cropArea stays within visible image boundaries
        // Clamp position first
        if (newCrop.x < 0) {
          const adjustX = -newCrop.x;
          newCrop.x = 0;
          if (resizeHandle?.includes("l")) {
            newCrop.width = Math.max(50, newCrop.width - adjustX);
            if (aspectValue) newCrop.height = newCrop.width / aspectValue;
          }
        }
        if (newCrop.y < 0) {
          const adjustY = -newCrop.y;
          newCrop.y = 0;
          if (resizeHandle?.includes("t")) {
            newCrop.height = Math.max(50, newCrop.height - adjustY);
            if (aspectValue) newCrop.width = newCrop.height * aspectValue;
          }
        }

        // Clamp dimensions to stay within image boundaries
        if (newCrop.x + newCrop.width > imageSize.width) {
          newCrop.width = Math.max(50, imageSize.width - newCrop.x);
          if (aspectValue) {
            newCrop.height = newCrop.width / aspectValue;
            // Re-check height constraint
            if (newCrop.y + newCrop.height > imageSize.height) {
              newCrop.height = Math.max(50, imageSize.height - newCrop.y);
              newCrop.width = newCrop.height * aspectValue;
            }
          }
        }
        if (newCrop.y + newCrop.height > imageSize.height) {
          newCrop.height = Math.max(50, imageSize.height - newCrop.y);
          if (aspectValue) {
            newCrop.width = newCrop.height * aspectValue;
            // Re-check width constraint
            if (newCrop.x + newCrop.width > imageSize.width) {
              newCrop.width = Math.max(50, imageSize.width - newCrop.x);
              newCrop.height = newCrop.width / aspectValue;
            }
          }
        }

        // Final boundary check - ensure minimum size and within bounds
        newCrop.width = Math.max(
          50,
          Math.min(newCrop.width, imageSize.width - newCrop.x),
        );
        newCrop.height = Math.max(
          50,
          Math.min(newCrop.height, imageSize.height - newCrop.y),
        );

        // If aspect ratio is locked, maintain it after clamping
        if (aspectValue) {
          const currentRatio = newCrop.width / newCrop.height;
          if (Math.abs(currentRatio - aspectValue) > 0.01) {
            // Adjust to maintain aspect ratio
            if (newCrop.width / aspectValue <= imageSize.height - newCrop.y) {
              newCrop.height = newCrop.width / aspectValue;
            } else {
              newCrop.width = (imageSize.height - newCrop.y) * aspectValue;
              newCrop.height = imageSize.height - newCrop.y;
              // Adjust position if needed
              if (newCrop.x + newCrop.width > imageSize.width) {
                newCrop.x = imageSize.width - newCrop.width;
              }
            }
          }
        }

        setCropArea(newCrop);
        // Mark that user has adjusted the crop (via resize)
        hasUserAdjustedCropRef.current = true;
      }
    },
    [
      isDragging,
      isResizing,
      imageSize,
      dragStart,
      cropArea,
      resizeHandle,
      getAspectRatioValue,
      getEventCoordinates,
    ],
  );

  // Unified handler for mouse and touch end events
  const handleEnd = useCallback((e) => {
    if (e) {
      e.preventDefault();
    }
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  // Event listeners for both mouse and touch events
  useEffect(() => {
    if (isDragging || isResizing) {
      // Mouse events
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      // Touch events - prevent default to avoid scrolling
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd, { passive: false });
      document.addEventListener("touchcancel", handleEnd, { passive: false });

      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
        document.removeEventListener("touchcancel", handleEnd);
      };
    }
  }, [isDragging, isResizing, handleMove, handleEnd]);

  const processImage = async () => {
    scrollToVH(30);

    if (!sourceImageId || !uploadedImageUrl || !cropArea) {
      return;
    }

    // Declare requestBody outside try block so it's accessible in catch
    let requestBody = null;
    let hasRetried = false; // Safety lock to prevent infinite loops

    try {
      setStatus(COMPONENT_STATES.PROCESSING);
      setShowOptions(false);

      // Get image element to calculate correct coordinates
      const img = document.getElementById("crop-image");

      if (!img) {
        toast.error(t["Something Went Wrong!"]);
        setStatus(COMPONENT_STATES.ERROR);
        setShowOptions(true);
        return;
      }

      // Calculate scale between rendered size and natural size
      // imageSize.width/height represent the rendered dimensions on screen
      const scaleX = img.naturalWidth / imageSize.width;
      const scaleY = img.naturalHeight / imageSize.height;

      // Convert crop coordinates from rendered pixels to natural pixels
      // ActualCropX = CropAreaX * (NaturalWidth / RenderedWidth)
      const naturalCrop = {
        x: Math.round(cropArea.x * scaleX),
        y: Math.round(cropArea.y * scaleY),
        width: Math.round(cropArea.width * scaleX),
        height: Math.round(cropArea.height * scaleY),
      };

      requestBody = {
        imageUrl: uploadedImageUrl,
        sourceImageId: sourceImageId,
        width: naturalCrop.width,
        height: naturalCrop.height,
        x: naturalCrop.x,
        y: naturalCrop.y,
        crop: "crop",
      };

      const res = await fetch(`${BACKEND_URL}/image/crop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      const data = await res.json();

      // Check for 404 "Source image not found" error and attempt self-healing
      if (
        (res.status === 404 || data.status === "fail") &&
        (data?.message === "Source image not found" ||
          data?.message?.includes("Source image not found") ||
          data?.data?.message === "Source image not found")
      ) {
        // Self-healing: silently re-upload if file is available
        if (uploadedFile && !hasRetried) {
          hasRetried = true;

          try {
            // Silent re-upload
            const formData = new FormData();
            formData.append("image", uploadedFile);

            const uploadRes = await fetch(`${BACKEND_URL}/image/upload`, {
              method: "POST",
              body: formData,
            });

            const uploadData = await uploadRes.json();

            if (uploadData.status === "success") {
              // Update state with new IDs
              const { sourceImageId: newSourceImageId, sourceUrl: newSourceUrl } =
                uploadData.data;
              setSourceImageId(newSourceImageId);
              setUploadedImageUrl(newSourceUrl);

              // Retry the original crop request with new IDs
              const retryRequestBody = {
                imageUrl: newSourceUrl,
                sourceImageId: newSourceImageId,
                width: naturalCrop.width,
                height: naturalCrop.height,
                x: naturalCrop.x,
                y: naturalCrop.y,
                crop: "crop",
              };

              const retryRes = await fetch(`${BACKEND_URL}/image/crop`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                },
                body: JSON.stringify(retryRequestBody),
                credentials: "include",
              });

              const retryData = await retryRes.json();

              if (retryData.status === "success") {
                setProcessedImage(retryData.data.previewUrl);
                setToolKey(retryData.data.toolKey);
                setStatus(COMPONENT_STATES.DONE);
                setShowOptions(true);

                const resultData = {
                  sourceImageId: newSourceImageId,
                  previewUrl: retryData.data.previewUrl,
                  originalUrl: newSourceUrl,
                  tool: currentTool,
                };
                localStorage.setItem(
                  `dropzone_last_result`,
                  JSON.stringify(resultData),
                );
                return;
              } else {
                // Retry also failed, log and show error
                console.error("=== CROP RETRY FAILED ===");
                console.error("Response Status Code:", retryRes.status);
                console.error("Response Data:", JSON.stringify(retryData, null, 2));
                console.error("=========================");
                throw new Error("Retry failed");
              }
            } else {
              // Re-upload failed, log and show error
              console.error("=== RE-UPLOAD FAILED ===");
              console.error("Upload Response:", JSON.stringify(uploadData, null, 2));
              console.error("=========================");
              throw new Error("Re-upload failed");
            }
          } catch (reuploadError) {
            // Re-upload or retry failed, show error
            console.error("=== SELF-HEALING FAILED ===");
            console.error("Error:", reuploadError);
            console.error("===========================");
            toast.error(t["Something Went Wrong!"]);
            setStatus(COMPONENT_STATES.ERROR);
            setShowOptions(true);
            return;
          }
        } else {
          // No file available or already retried, show error
          console.error("=== SOURCE IMAGE NOT FOUND ===");
          console.error("Response Status Code:", res.status);
          console.error("Error Message:", data?.message);
          console.error("Has uploadedFile:", !!uploadedFile);
          console.error("Has retried:", hasRetried);
          console.error("==============================");
          toast.error(t["Something Went Wrong!"]);
          setStatus(COMPONENT_STATES.ERROR);
          setShowOptions(true);
          return;
        }
      }

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
          JSON.stringify(resultData),
        );
        return;
      }

      if (data.status === "fail") {
        if (
          data?.data?.code === "RUN_LIMIT" ||
          data?.message ===
            "Guest trial limit reached. Please sign up to continue."
        ) {
          toast.error(
            t[
              "You have used up your free attempts! Please log in to continue."
            ],
          );
          openLoginPopup();
          resetComponent();
          navigate("/");
          return;
        }
        if (data?.data?.code === "INSUFFICIENT_CREDITS") {
          toast.error(
            t[
              "Your points are insufficient or your subscription has expired! Please check the subscriptions section."
            ],
          );
          setStatus(COMPONENT_STATES.ERROR);
          setShowOptions(true);
          return;
        }
      }

      // Log generic failure
      console.error("=== CROP REQUEST FAILED ===");
      console.error("Response Status Code:", res.status);
      console.error("Response Data:", JSON.stringify(data, null, 2));
      console.error("===========================");

      toast.error(t["Something Went Wrong!"]);
      setStatus(COMPONENT_STATES.ERROR);
      setShowOptions(true);
    } catch (error) {
      // Enhanced error logging for exceptions
      console.error("=== CROP REQUEST EXCEPTION ===");
      console.error("Error:", error);
      console.error("Error Message:", error?.message);
      console.error("Error Stack:", error?.stack);
      console.error("Request Payload:", JSON.stringify(requestBody, null, 2));
      console.error("=============================");

      toast.error(t["Something Went Wrong!"]);
      setStatus(COMPONENT_STATES.ERROR);
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

  const saveResultTwice = async () => {
    // Log state before download to check if anything changes
    console.log("=== BEFORE DOWNLOAD ===");
    console.log("sourceImageId:", sourceImageId);
    console.log("uploadedImageUrl:", uploadedImageUrl);
    console.log("processedImage:", processedImage);
    console.log("toolKey:", toolKey);
    console.log("hasAccessToken:", !!accessToken);
    console.log("======================");

    setIsDownloading(true);
    
    try {
      const downloadPromise = downloadImage(
        processedImage,
        `${currentTool}-result.png`,
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

      // Log download results
      console.log("=== DOWNLOAD RESULTS ===");
      console.log("Local Download Success:", downloadRes.status === "fulfilled");
      if (downloadRes.status === "rejected") {
        console.error("Local Download Error:", downloadRes.reason);
      }
      console.log("Server Save Success:", serverRes.status === "fulfilled");
      if (serverRes.status === "rejected") {
        console.error("Server Save Error:", serverRes.reason);
      }
      if (serverRes.status === "fulfilled") {
        try {
          const serverResponse = serverRes.value;
          console.log("Server Response Status:", serverResponse.status);
          console.log("Server Response Status Text:", serverResponse.statusText);
          const serverData = await serverResponse.json();
          console.log("Server Response Data:", JSON.stringify(serverData, null, 2));
          if (serverResponse.status !== 200) {
            console.error("Server Save Failed with Status:", serverResponse.status);
            console.error("Server Error Response:", JSON.stringify(serverData, null, 2));
          }
        } catch (parseError) {
          console.error("Failed to parse server response:", parseError);
          console.error("Server Response Text:", await serverRes.value.text());
        }
      }
      console.log("=======================");

      // Log state after download to check if anything changed
      console.log("=== AFTER DOWNLOAD ===");
      console.log("sourceImageId:", sourceImageId);
      console.log("uploadedImageUrl:", uploadedImageUrl);
      console.log("processedImage:", processedImage);
      console.log("toolKey:", toolKey);
      console.log("hasAccessToken:", !!accessToken);
      console.log("=====================");

      const localSuccess = downloadRes.status === "fulfilled";
      const serverSuccess = serverRes.status === "fulfilled";

      if (localSuccess && serverSuccess) {
        toast.success(t["Successfully saved locally and to your downloads!"]);
      } else if (!localSuccess && !serverSuccess) {
        toast.error(t["Failed saving locally and to your downloads!"]);
      } else if (localSuccess && !serverSuccess) {
        toast.warn(
          t["Successfully saved locally but failed saving to your downloads!"],
        );
      } else {
        toast.warn(
          t["Failed saving locally but successfully saved to your downloads!"],
        );
      }
    } catch (error) {
      console.error("=== DOWNLOAD EXCEPTION ===");
      console.error("Error:", error);
      console.error("Error Message:", error?.message);
      console.error("Error Stack:", error?.stack);
      console.error("Current State:", {
        sourceImageId,
        uploadedImageUrl,
        processedImage,
        toolKey,
        hasAccessToken: !!accessToken,
      });
      console.error("=========================");
      toast.error(t["Something Went Wrong!"]);
    } finally {
      setIsDownloading(false);
    }
  };

  const saveResultLocally = async () => {
    // Log state before download to check if anything changes
    console.log("=== BEFORE LOCAL DOWNLOAD ===");
    console.log("sourceImageId:", sourceImageId);
    console.log("uploadedImageUrl:", uploadedImageUrl);
    console.log("processedImage:", processedImage);
    console.log("============================");

    setIsDownloading(true);
    try {
      await downloadImage(processedImage, `${currentTool}-result.png`);
      
      // Log state after download to check if anything changed
      console.log("=== AFTER LOCAL DOWNLOAD ===");
      console.log("sourceImageId:", sourceImageId);
      console.log("uploadedImageUrl:", uploadedImageUrl);
      console.log("processedImage:", processedImage);
      console.log("===========================");
    } catch (error) {
      console.error("=== LOCAL DOWNLOAD EXCEPTION ===");
      console.error("Error:", error);
      console.error("Error Message:", error?.message);
      console.error("Error Stack:", error?.stack);
      console.error("Current State:", {
        sourceImageId,
        uploadedImageUrl,
        processedImage,
      });
      console.error("===============================");
      toast.error(t["Something Went Wrong!"]);
    } finally {
      setIsDownloading(false);
    }
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

  // Calculate available tools for chaining operations (exclude current tool, flip, and rotate)
  const availableTools = Object.keys(TOOL_CONFIG)
    .filter(
      (tool) =>
        tool !== currentTool &&
        tool !== "flip-image" &&
        tool !== "rotate-image",
    )
    .map((tool) => ({
      path: tool,
      label: TOOL_CONFIG[tool].name,
    }));

  // Navigate to selected tool with processed image
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

  useEffect(() => {
    if (imageSize.width > 0 && aspectRatio !== "free") {
      const [aspectW, aspectH] = aspectRatio.split(":").map(Number);
      const targetRatio = aspectW / aspectH;

      setCropArea((prev) => {
        let newWidth = prev.width;
        let newHeight = newWidth / targetRatio;

        // If height exceeds image bounds, reduce width
        if (newHeight > imageSize.height) {
          newHeight = imageSize.height;
          newWidth = newHeight * targetRatio;
        }

        // If width exceeds image bounds, reduce height
        if (newWidth > imageSize.width) {
          newWidth = imageSize.width;
          newHeight = newWidth / targetRatio;
        }

        return {
          ...prev,
          width: newWidth,
          height: newHeight,
          // Keep X and Y within allowed bounds
          x: Math.min(prev.x, imageSize.width - newWidth),
          y: Math.min(prev.y, imageSize.height - newHeight),
        };
      });
    }
  }, [aspectRatio, imageSize.width, imageSize.height]);

  // Recalculate image dimensions on window resize
  useEffect(() => {
    if (!uploadedImageUrl || !imageSize.naturalWidth) return;

    const handleResize = () => {
      const img = document.getElementById("crop-image");
      if (!img) return;

      const container = img.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      setContainerSize({ width: containerWidth, height: containerHeight });

      // Recalculate with same logic as handleImageLoad
      const containerAspect = containerWidth / containerHeight;
      const imageAspect = imageSize.naturalWidth / imageSize.naturalHeight;

      let baseRenderedWidth, baseRenderedHeight;
      if (imageAspect > containerAspect) {
        baseRenderedWidth = containerWidth;
        baseRenderedHeight = containerWidth / imageAspect;
      } else {
        baseRenderedHeight = containerHeight;
        baseRenderedWidth = containerHeight * imageAspect;
      }

      let scale = 1;
      let renderedWidth = baseRenderedWidth;
      let renderedHeight = baseRenderedHeight;

      if (imageSize.naturalWidth < 300) {
        const minDisplayWidth = Math.min(300, containerWidth * 0.9);
        const scaleByWidth = minDisplayWidth / baseRenderedWidth;
        const scaledHeight = baseRenderedHeight * scaleByWidth;
        const scaleByHeight =
          scaledHeight > containerHeight * 0.9
            ? (containerHeight * 0.9) / baseRenderedHeight
            : scaleByWidth;
        scale = Math.min(scaleByWidth, scaleByHeight);

        renderedWidth = baseRenderedWidth * scale;
        renderedHeight = baseRenderedHeight * scale;
      }

      setImageScale(scale);

      const offsetLeft = (containerWidth - renderedWidth) / 2;
      const offsetTop = (containerHeight - renderedHeight) / 2;

      // Update image element's actual dimensions to match
      if (img) {
        img.style.width = `${renderedWidth}px`;
        img.style.height = `${renderedHeight}px`;
        img.style.position = "absolute";
        img.style.left = `${offsetLeft}px`;
        img.style.top = `${offsetTop}px`;

        if (imageSize.naturalWidth < 300) {
          img.style.imageRendering = "pixelated";
        } else {
          img.style.imageRendering = "auto";
        }
      }

      setImageSize((prev) => ({
        ...prev,
        width: renderedWidth,
        height: renderedHeight,
        offsetTop,
        offsetLeft,
      }));

      // Clamp cropArea to new boundaries
      setCropArea((prev) => ({
        x: Math.max(
          0,
          Math.min(prev.x, renderedWidth - Math.min(prev.width, renderedWidth)),
        ),
        y: Math.max(
          0,
          Math.min(
            prev.y,
            renderedHeight - Math.min(prev.height, renderedHeight),
          ),
        ),
        width: Math.min(prev.width, renderedWidth),
        height: Math.min(prev.height, renderedHeight),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [uploadedImageUrl, imageSize.naturalWidth]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
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
                {t["Drag & Drop or Click to Upload"]}
              </h3>
              <p style={{ color: "#666" }} dir={isRTL ? "rtl" : "ltr"}>
                {t["Supported formats: PNG, JPG, JPEG, WEBP"]}
              </p>
              <p style={{ color: "#999" }}> {t["Max size: 10MB"]}</p>
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
              <div className="relative">
                <div
                  style={{
                    position: "absolute",
                    zIndex: "100",
                    top: "-30px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "8px 8px 0 0",
                    fontSize: "14px",
                    fontWeight: "bold",
                    width: "fit-content",
                    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  {imageSize.width > 0
                    ? `${Math.round(cropArea.width * (imageSize.naturalWidth / imageSize.width))}px × 
       ${Math.round(cropArea.height * (imageSize.naturalHeight / imageSize.height))}px`
                    : t["Loading ..."]}
                </div>

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
                    id="crop-image"
                    src={uploadedImageUrl}
                    alt="Original"
                    onLoad={handleImageLoad}
                    style={{
                      display: "block",
                      userSelect: "none",
                      WebkitUserDrag: "none",
                      // Dimensions and position will be set by handleImageLoad
                      // to ensure pixel-perfect matching with crop overlay
                    }}
                  />

                  {/* Crop Overlay */}
                  {/* Border is 2px, so we adjust position and size to ensure cropArea represents inner content */}
                  <div
                    onMouseDown={handleStart}
                    onTouchStart={handleStart}
                    style={{
                      position: "absolute",
                      // Position accounts for border: move left/top by border width so inner area starts at cropArea.x/y
                      left: `${imageSize.offsetLeft + cropArea.x - 2}px`,
                      top: `${imageSize.offsetTop + cropArea.y - 2}px`,
                      // Size includes border: add 4px (2px on each side) so inner area equals cropArea.width/height
                      width: `${cropArea.width + 4}px`,
                      height: `${cropArea.height + 4}px`,
                      border: "2px solid #1976d2",
                      boxSizing: "border-box",
                      cursor: "move",
                      boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Resize Handles */}
                    {["tl", "tr", "bl", "br", "t", "b", "l", "r"].map(
                      (handle) => (
                        <div
                          key={handle}
                          onMouseDown={(e) => handleStart(e, handle)}
                          onTouchStart={(e) => handleStart(e, handle)}
                          style={{
                            position: "absolute",
                            background: "#1976d2",
                            ...(handle.length === 2
                              ? {
                                  width: "6px",
                                  height: "6px",
                                  [handle.includes("t") ? "top" : "bottom"]:
                                    "-4px",
                                  [handle.includes("l") ? "left" : "right"]:
                                    "-4px",
                                  cursor: `${handle}-resize`,
                                  borderRadius: "1px",
                                }
                              : {
                                  [handle === "t" || handle === "b"
                                    ? "width"
                                    : "height"]: "100%",
                                  [handle === "t" || handle === "b"
                                    ? "height"
                                    : "width"]: "8px",
                                  [handle === "t"
                                    ? "top"
                                    : handle === "b"
                                      ? "bottom"
                                      : handle === "l"
                                        ? "left"
                                        : "right"]: "-4px",
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
                      ),
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
                    className="space-y-6"
                  >
                    <>
                      <Box>
                        <FormControl fullWidth>
                          <InputLabel>Aspect Ratio</InputLabel>
                          <Select
                            value={aspectRatio}
                            label="Aspect Ratio"
                            onChange={(e) => {
                              setAspectRatio(e.target.value);
                              // Mark that user has adjusted the crop (via aspect ratio)
                              hasUserAdjustedCropRef.current = true;
                              // Aspect ratio change will trigger useEffect to recalculate cropArea
                            }}
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
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
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
                            marginTop: "30px",
                          }}
                        >
                          <RefreshCw size={18} />
                          {t["Change Photo"]}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {status === COMPONENT_STATES.PROCESSING && (
          <div style={{ textAlign: "center", position: "relative" }}>
            {uploadedImageUrl && (
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
              </div>
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

          {/* Post-processing action buttons */}
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
                <button
                  dir={isRTL ? "rtl" : "ltr"}
                  onClick={() => {
                    isDownloading === true
                      ? null
                      : accessToken
                        ? saveResultTwice()
                        : saveResultLocally();
                  }}
                  disabled={isDownloading === true}
                  style={{
                    cursor: isDownloading === true ? "not-allowed" : "pointer",
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
        </div>
      )}

      {/* CSS animation for loading indicator */}
      <style jsx>{`
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
  );
};

export default CropDropZone;
