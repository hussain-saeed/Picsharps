import { BACKEND_URL } from "../../../api";

export const grayscalePhoto = async ({ sourceImageId, imageUrl }) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/image/grayscale`,
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
        toolKey: data.data.toolKey,
      };
    } else {
      throw new Error(data.message || "Cartoonify failed");
    }
  } catch (err) {
    console.error("[Cartoon Tool] Error:", err);
    throw err;
  }
};
