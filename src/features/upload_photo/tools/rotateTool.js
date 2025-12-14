export const rotateImage = async ({ sourceImageId, imageUrl, angle }) => {
  try {
    const res = await fetch(
      "https://picsharps-api.onrender.com/api/v1/image/rotate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImageId,
          imageUrl,
          angle: Number(angle),
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
      throw new Error(data.message || "Rotate failed");
    }
  } catch (err) {
    console.error("[Rotate Tool] Error:", err);
    throw err;
  }
};
