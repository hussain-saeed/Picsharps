import { BACKEND_URL } from "../../../api";
import { toast } from "react-toastify";

export const adjustImage = async ({
  sourceImageId,
  imageUrl,
  brightness = 0,
  contrast = 0,
  saturation = 0,
  gamma = 0,
  accessToken,
}) => {
  try {
    const res = await fetch(`${BACKEND_URL}/image/adjust-colors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({
        sourceImageId,
        imageUrl,
        brightness,
        contrast,
        saturation,
        gamma,
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
