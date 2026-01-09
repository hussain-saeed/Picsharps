import { BACKEND_URL } from "../../../api";
import { toast } from "react-toastify";

export const resizeImage = async ({
  sourceImageId,
  imageUrl,
  width,
  height,
  mode = "fill",
}) => {
  try {
    if (!width && !height) {
      toast.error("At least one of width or height must be provided");
      return;
    }

    const res = await fetch(`${BACKEND_URL}/image/resize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceImageId,
        imageUrl,
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        mode,
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
