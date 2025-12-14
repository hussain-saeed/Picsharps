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

    console.log("[Remove Background] Final API Payload:", payload);

    const res = await fetch(
      "https://picsharps-api.onrender.com/api/v1/image/remove-background",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    console.log("[Remove Background] API Response:", data);

    if (data.status === "success") {
      return {
        previewUrl: data.data.previewUrl,
        providerImageId: data.data.providerImageId,
      };
    } else {
      throw new Error(data.message || "Background removal failed");
    }
  } catch (err) {
    console.error("[Remove Background Tool] Error:", err);
    throw err;
  }
};
