export const TOOL_CONFIG = {
  "ai-image-enhancer": {
    name: "AI Image Enhancer",
    apiPath: "enhance",
    hasOptions: true,
    options: {
      upscaleFactor: {
        type: "radio",
        label: "Choose how much to enhance",
        default: null,
        values: [
          { label: "Basic (2x)", value: 2 },
          { label: "High (4x)", value: 4 },
          { label: "Ultra (6x)", value: 6 },
          { label: "Max (8x)", value: 8 },
        ],
      },
    },
  },
  "photo-to-cartoon": {
    name: "Photo to Cartoon",
    apiPath: "cartoonify",
    hasOptions: false,
    options: {},
  },
  "flip-image": {
    name: "Flip Image",
    apiPath: "flip",
    hasOptions: true,
    options: {
      direction: {
        type: "radio",
        label: "Flip direction",
        default: null,
        values: [
          { label: "Horizontal", value: "horizontal" },
          { label: "Vertical", value: "vertical" },
        ],
      },
    },
  },
  "resize-image": {
    name: "Resize Image",
    apiPath: "resize",
    hasOptions: true,
    hasStartButton: true,
    options: {
      width: {
        type: "number",
        label: "Width (px)",
        default: 800,
        min: 1,
        max: 5000,
      },
      height: {
        type: "number",
        label: "Height (px)",
        default: 600,
        min: 1,
        max: 5000,
      },
      mode: {
        type: "radio",
        label: "Resize Mode",
        default: "fill",
        values: [
          {
            label: "Fill",
            value: "fill",
            description:
              "Resizes to fill width/height, may crop parts of the image",
          },
          {
            label: "Scale",
            value: "scale",
            description: "Scales the image ignoring aspect ratio",
          },
        ],
      },
    },
  },
};