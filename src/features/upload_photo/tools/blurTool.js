import { BACKEND_URL } from "../../../api";
import { toast } from "react-toastify";

export const blurImage = async ({
  sourceImageId,
  imageUrl,
  amount,
  accessToken,
  customMsg,
  customMsg2,
  generalMsg,
}) => {
  try {
    const res = await fetch(`${BACKEND_URL}/image/blur`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
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
