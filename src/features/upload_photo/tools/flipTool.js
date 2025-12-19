import { BACKEND_URL } from "../../../api";

export const flipImage = async ({
  sourceImageId,
  imageUrl,
  direction = "horizontal",
}) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/image/flip`,
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
        toolKey: data.data.toolKey,
      };
    } else {
      throw new Error(data.message || "Flip failed");
    }
  } catch (err) {
    console.error("[Flip Tool] Error:", err);
    throw err;
  }
};
