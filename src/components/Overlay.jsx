import { useOverlay } from "../context/OverlayContext";

export default function Overlay() {
  const { setIsVisible } = useOverlay();

  return (
    <div
      onClick={() => setIsVisible(false)}
      className="fixed inset-y-[78px] bottom-0 left-0 right-0 bg-black/50 backdrop-blur-xs z-100"
    />
  );
}
