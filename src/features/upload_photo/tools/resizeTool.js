import { BACKEND_URL } from "../../../api";

export const resizeImage = async ({
  sourceImageId,
  imageUrl,
  width,
  height,
  mode = "fill",
}) => {
  try {
    if (!width && !height) {
      throw new Error("At least one of width or height must be provided");
    }

    const res = await fetch(
      `${BACKEND_URL}/image/resize`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImageId,
          imageUrl,
          width: width ? parseInt(width) : null,
          height: height ? parseInt(height) : null,
          mode,
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
      throw new Error(data.message || "Resize failed");
    }
  } catch (err) {
    console.error("[Resize Tool] Error:", err);
    throw err;
  }
};
