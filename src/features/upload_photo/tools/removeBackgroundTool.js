import { BACKEND_URL } from "../../../api";
import { toast } from "react-toastify";

export const removeBackground = async ({
  sourceImageId,
  imageUrl,
  outputType = "cutout",
  bgColor = null,
  accessToken,
  customMsg,
  customMsg2,
  generalMsg,
  openLoginPopup,
  resetComponent,
  navigate,
}) => {
  try {
    const payload = {
      sourceImageId,
      imageUrl,
      outputType,
    };

    if (bgColor) {
      payload.bgColor = bgColor;
    }

    const res = await fetch(`${BACKEND_URL}/image/remove-background`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(payload),
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
    toast.error(generalMsg);
  }
};
