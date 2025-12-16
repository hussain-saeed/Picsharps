export const removeBackground = async ({
  sourceImageId,
  imageUrl,
  outputType = "cutout",
  bgColor = null,
}) => {
  try {
    const payload = {
      sourceImageId,
      imageUrl,
      outputType,
    };

    if (bgColor) {
      payload.bgColor = bgColor;
    }

    const res = await fetch(
      "https://picsharps-api.onrender.com/api/v1/image/remove-background",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (data.status === "success") {
      return {
        previewUrl: data.data.previewUrl,
        providerImageId: data.data.providerImageId,
        toolKey: data.data.toolKey,
      };
    } else {
      throw new Error(data.message || "Background removal failed");
    }
  } catch (err) {
    console.error("[Remove Background Tool] Error:", err);
    throw err;
  }
};
