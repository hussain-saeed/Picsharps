import { BACKEND_URL } from "../../../api";

export const adjustImage = async ({
  sourceImageId,
  imageUrl,
  brightness = 0,
  contrast = 0,
  saturation = 0,
  gamma = 0,
}) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/image/adjust-colors`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImageId,
          imageUrl,
          brightness,
          contrast,
          saturation,
          gamma,
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
      throw new Error(data.message || "Adjust failed");
    }
  } catch (err) {
    console.error("[Adjust Tool] Error:", err);
    throw err;
  }
};
