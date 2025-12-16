export const enhanceImage = async ({
  sourceImageId,
  imageUrl,
  upscaleFactor,
}) => {
  try {
    const res = await fetch(
      "https://picsharps-api.onrender.com/api/v1/image/enhance",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImageId,
          imageUrl,
          upscaleFactor: Number(upscaleFactor),
        }),
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
      throw new Error(data.message || "Enhancement failed");
    }
  } catch (err) {
    console.error("[Enhance Tool] Error:", err);
    throw err;
  }
};
