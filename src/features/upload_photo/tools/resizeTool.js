import { BACKEND_URL } from "../../../api";
import { toast } from "react-toastify";

export const resizeImage = async ({
  sourceImageId,
  imageUrl,
  width,
  height,
  mode = "fill",
  accessToken,
  customMsg,
  customMsg2,
  generalMsg,
}) => {
  try {
    if (!width && !height) {
      return;
    }

    const res = await fetch(`${BACKEND_URL}/image/resize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
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
    }

    if (data.status === "fail") {
      if (data.data.code === "RUN_LIMIT") {
        toast.error(customMsg);
        return;
      }
      if (data.data.code === "INSUFFICIENT_CREDITS") {
        toast.error(customMsg2);
        return;
      }
    }
    toast.error(generalMsg);
  } catch (err) {
    toast.error(generalMsg);
  }
};
