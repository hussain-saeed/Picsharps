import { BACKEND_URL } from "../../../api";
import { toast } from "react-toastify";

export const grayscalePhoto = async ({
  sourceImageId,
  imageUrl,
  accessToken,
}) => {
  try {
    const res = await fetch(`${BACKEND_URL}/image/grayscale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({ sourceImageId, imageUrl }),
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
      console.log(data);
    }
  } catch (err) {
    toast.error(
      "Unexpected error occurred! Make sure your internet connection is stable."
    );
  }
};
