import { BACKEND_URL } from "../../../api";

export const roundedCornerImage = async ({
  sourceImageId,
  imageUrl,
  radius,
}) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/image/rounded-corners`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceImageId,
          imageUrl,
          radius: Number(radius),
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
      throw new Error(data.message || "Rounding corner failed");
    }
  } catch (err) {
    console.error("[Rounded Corner Tool] Error:", err);
    throw err;
  }
};
