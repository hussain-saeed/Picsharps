import { BACKEND_URL } from "../../../api";
import { toast } from "react-toastify";

export const enhanceImage = async ({
  sourceImageId,
  imageUrl,
  upscaleFactor,
  accessToken,
  customMsg,
  customMsg2,
  generalMsg,
  openLoginPopup,
  resetComponent,
  navigate,
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
    }

    if (data.status === "fail") {
      // Check for 404 "Source image not found" error
      if (
        (res.status === 404 || res.status === 400) &&
        (data?.message === "Source image not found" ||
          data?.message?.includes("Source image not found") ||
          data?.data?.message === "Source image not found")
      ) {
        // Throw specific error for self-healing mechanism
        const error = new Error("SOURCE_IMAGE_NOT_FOUND");
        error.status = res.status;
        error.data = data;
        throw error;
      }

      if (
        data?.data?.code === "RUN_LIMIT" ||
        data?.message ===
          "Guest trial limit reached. Please sign up to continue."
      ) {
        toast.error(customMsg);
        openLoginPopup();
        resetComponent();
        navigate("/");
        return;
      }
      if (data?.data?.code === "INSUFFICIENT_CREDITS") {
        toast.error(customMsg2);
        return;
      }
    }
    toast.error(generalMsg);
  } catch (err) {
    // Re-throw SOURCE_IMAGE_NOT_FOUND error for self-healing mechanism
    if (err.message === "SOURCE_IMAGE_NOT_FOUND") {
      throw err;
    }
    toast.error(generalMsg);
  }
};
