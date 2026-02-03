import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import { useSuspendUserMutation } from "../../../features/core/adminCoreApi";
import { X, AlertTriangle } from "lucide-react";

const SuspendUserModal = ({ open, onClose, user }) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [suspendUser] = useSuspendUserMutation();

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      setNotes("");
      onClose();
    }
  };

  const handleSuspend = async () => {
    if (!user?.id) return;
    if (!reason) return toast.warning("Please provide a suspension reason");

    setIsLoading(true);
    try {
      const res = await suspendUser({
        userId: user.id,
        body: { reason, notes },
      }).unwrap();

      if (res.status === "success") {
        toast.success("User suspended successfully!");
        handleClose();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: { borderRadius: "18px", padding: "12px 0 16px" },
      }}
    >
      {/* Header */}
      <DialogTitle className="flex justify-between items-start pb-4 gap-12">
        <span className="text-2xl font-medium">Suspend Account</span>
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="p-1.5 rounded-full bg-gray-100 transition-colors"
          style={{
            cursor: isLoading ? "not-allowed" : "pointer",
            border: "1px solid rgb(225, 225, 255)",
          }}
        >
          <X size={20} className="text-gray-500" />
        </button>
      </DialogTitle>

      <DialogContent className="mt-2">
        {/* Warning Message */}
        <div className="flex gap-3 py-4 px-6 mb-6 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7]">
          <p className="text-sm leading-relaxed">
            You are about to suspend <strong>{user?.name}’s</strong> account.
            They will not be able to login until reactivated.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-[#F8F9FA] p-6 rounded-lg mb-8 border border-gray-100 flex gap-4">
          <div
            className="w-10 h-10 flex justify-center items-center rounded-full text-white font-semibold"
            style={{ background: "var(--gradient-color)", marginTop: "-1px" }}
          >
            {user?.name
              .split(" ")
              .slice(0, 2)
              .map((word) => word[0].toUpperCase())
              .join("")}
          </div>
          <div>
            <p className="font-semibold text-gray-800 leading-tight">
              {user?.name}
            </p>
            <p className="text-sm text-gray-500 truncate max-w-[140px] sm:max-w-[420px]">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Suspension Reason Input */}
        <div className="mb-6">
          <label className="font-medium block mb-2 text-gray-700">
            Suspension Reason <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Policy violation, Suspicious activity ..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
            className="w-full p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all disabled:opacity-60"
            style={{ border: "1px solid rgb(225, 225, 225)" }}
          />
        </div>

        {/* Additional Notes Input */}
        <div className="mb-1">
          <label className="font-medium block mb-2 text-gray-700">
            Additional Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Add any additional details ..."
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            className="w-full p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all resize-none disabled:opacity-60"
            style={{ border: "1px solid rgb(225, 225, 225)" }}
          />
        </div>
      </DialogContent>

      <div className="gap-2.5 flex py-2 px-6 justify-end">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="w-[50%] sm:w-fit px-5 py-2 bg-gray-200 rounded-lg font-medium text-gray-600"
          style={{
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleSuspend}
          disabled={isLoading || !reason || !notes}
          className="w-[50%] sm:w-fit px-6 py-2 rounded-lg font-semibold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
          style={{
            background: "orange",
            cursor: isLoading || !reason || !notes ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Suspending ...
            </span>
          ) : (
            "Suspend"
          )}
        </button>
      </div>
    </Dialog>
  );
};

export default SuspendUserModal;
