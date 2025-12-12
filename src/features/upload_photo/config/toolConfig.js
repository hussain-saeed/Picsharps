// src/config/toolConfig.js
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
  // ⚠️ إضافة الـ Flip Tool هنا
  "flip-image": {
    name: "Flip Image",
    apiPath: "flip",
    hasOptions: true,
    options: {
      direction: {
        type: "radio",
        label: "Choose flip direction",
        default: null,
        values: [
          { label: "Horizontal Flip", value: "horizontal" },
          { label: "Vertical Flip", value: "vertical" },
        ],
      },
    },
  },
};
