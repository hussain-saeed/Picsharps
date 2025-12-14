export const grayscalePhoto = async ({ sourceImageId, imageUrl }) => {
  try {
    const res = await fetch(
      "https://picsharps-api.onrender.com/api/v1/image/grayscale",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceImageId, imageUrl }),
      }
    );

    const data = await res.json();

    if (data.status === "success") {
      return {
        previewUrl: data.data.previewUrl,
        providerImageId: data.data.providerImageId,
      };
    } else {
      throw new Error(data.message || "Cartoonify failed");
    }
  } catch (err) {
    console.error("[Cartoon Tool] Error:", err);
    throw err;
  }
};
