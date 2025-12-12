// src/tools/flipTool.js
export const flipImage = async ({
  sourceImageId,
  imageUrl,
  direction = "horizontal",
}) => {
  try {
    const res = await fetch(
      "https://picsharps-api.onrender.com/api/v1/image/flip",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImageId,
          imageUrl,
          direction,
        }),
      }
    );

    const data = await res.json();

    if (data.status === "success") {
      return {
        previewUrl: data.data.previewUrl,
        providerImageId: data.data.providerImageId,
      };
    } else {
      throw new Error(data.message || "Flip failed");
    }
  } catch (err) {
    console.error("[Flip Tool] Error:", err);
    throw err;
  }
};
