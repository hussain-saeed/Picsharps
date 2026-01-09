import { BACKEND_URL } from "../../../api";
import { toast } from "react-toastify";

export const blurImage = async ({ sourceImageId, imageUrl, amount }) => {
  try {
    const res = await fetch(`${BACKEND_URL}/image/blur`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceImageId,
        imageUrl,
        amount: Number(amount),
      }),
      credentials: "include",
    });

    const data = await res.json();

    if (data.status === "success") {
      return {
        previewUrl: data.data.previewUrl,
        providerImageId: data.data.providerImageId,
        toolKey: data.data.toolKey,
      };
    } else {
      toast.error(data.message || "Unexpected error occurred!");
    }
  } catch (err) {
    toast.error(
      "Unexpected error occurred! Make sure your internet connection is stable."
    );
  }
};
