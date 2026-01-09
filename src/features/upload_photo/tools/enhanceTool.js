import { BACKEND_URL } from "../../../api";
import { toast } from "react-toastify";

export const enhanceImage = async ({
  sourceImageId,
  imageUrl,
  upscaleFactor,
  accessToken,
}) => {
  try {
    const res = await fetch(`${BACKEND_URL}/image/enhance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({
        sourceImageId,
        imageUrl,
        upscaleFactor: Number(upscaleFactor),
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
