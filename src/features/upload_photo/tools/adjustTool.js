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
  customMsg,
  customMsg2,
  generalMsg,
  openLoginPopup,
  resetComponent,
  navigate,
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
