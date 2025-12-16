export const TOOL_CONFIG = {
  "ai-image-enhancer": {
    name: "AI Image Enhancer",
    apiPath: "enhance",
    hasOptions: true,
    options: {
      upscaleFactor: {
        type: "radio",
        label: "Level",
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
  "rotate-image": {
    name: "Rotate Image",
    apiPath: "rotate",
    hasOptions: true,
    options: {
      angle: {
        type: "radio",
        label: "Angle",
        default: null,
        values: [
          { label: "90 degree", value: 90 },
          { label: "-90 degree", value: -90 },
          { label: "180 degree", value: 180 },
        ],
      },
    },
  },
  "sharpen-image": {
    name: "Sharpen Image",
    apiPath: "sharpen",
    hasOptions: true,
    options: {
      strength: {
        type: "radio",
        label: "Strength",
        default: null,
        values: [
          { label: "Basic (2x)", value: 500 },
          { label: "High (4x)", value: 1000 },
          { label: "Ultra (6x)", value: 1500 },
          { label: "Max (8x)", value: 2000 },
        ],
      },
    },
  },
  "remove-background": {
    name: "Remove Background",
    apiPath: "remove-background",
    hasOptions: true,
    options: {},
  },
  "blur-image": {
    name: "Blur Image",
    apiPath: "blur",
    hasOptions: true,
    options: {
      amount: {
        type: "radio",
        label: "Amount",
        default: null,
        values: [
          { label: "Basic (2x)", value: 250 },
          { label: "High (4x)", value: 500 },
          { label: "Ultra (6x)", value: 750 },
          { label: "Max (8x)", value: 1000 },
        ],
      },
    },
  },
  "grayscale-image": {
    name: "Grayscale Image",
    apiPath: "grayscale",
    hasOptions: false,
    options: {},
  },
  "rounded-corner-image": {
    name: "Rounded Corner Image",
    apiPath: "rounded-corners",
    hasOptions: true,
    options: {
      radius: {
        type: "radio",
        label: "Radius",
        default: null,
        values: [
          { label: "Small", value: 250 },
          { label: "Medium", value: 500 },
          { label: "Large", value: 750 },
          { label: "Max", value: 999 },
        ],
      },
    },
  },
  "oil-paint-effect": {
    name: "Oil Paint Effect",
    apiPath: "oil-paint",
    hasOptions: true,
    options: {
      amount: {
        type: "radio",
        label: "Amount",
        default: null,
        values: [
          { label: "Basic", value: 25 },
          { label: "High", value: 50 },
          { label: "Ultra", value: 75 },
          { label: "Max", value: 100 },
        ],
      },
    },
  },
  "adjust-image": {
    name: "Image Adjust",
    apiPath: "adjust",
    hasOptions: true,
    hasStartButton: true,
    options: {
      brightness: {
        type: "slider",
        label: "Brightness",
        default: 0,
        min: -100,
        max: 100,
        step: 1,
      },
      contrast: {
        type: "slider",
        label: "Contrast",
        default: 0,
        min: -100,
        max: 100,
        step: 1,
      },
      saturation: {
        type: "slider",
        label: "Saturation",
        default: 0,
        min: -100,
        max: 100,
        step: 1,
      },
      gamma: {
        type: "slider",
        label: "Gamma",
        default: 0,
        min: 0,
        max: 200,
        step: 1,
      },
    },
  },
};
