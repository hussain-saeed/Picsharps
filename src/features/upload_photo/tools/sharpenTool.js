import { BACKEND_URL } from "../../../api";

export const sharpenImage = async ({ sourceImageId, imageUrl, strength }) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/image/sharpen`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImageId,
          imageUrl,
          strength: Number(strength),
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
      throw new Error(data.message || "Sharpen failed");
    }
  } catch (err) {
    console.error("[Sharpen Tool] Error:", err);
    throw err;
  }
};
