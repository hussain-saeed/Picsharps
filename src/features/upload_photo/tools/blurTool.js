import { BACKEND_URL } from "../../../api";

export const blurImage = async ({ sourceImageId, imageUrl, amount }) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/image/blur`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImageId,
          imageUrl,
          amount: Number(amount),
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
