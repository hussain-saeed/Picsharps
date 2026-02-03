import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import { useReactivateUserMutation } from "../features/core/adminCoreApi";
import { X } from "lucide-react";

const ReactivateUserModal = ({ open, onClose, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reactivateUser] = useReactivateUserMutation();

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  const handleReactivate = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const res = await reactivateUser(user.id).unwrap();

      if (res.status === "success") {
        toast.success("User reactivated successfully!");
        onClose();
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
        <span className="text-2xl font-medium text-gray-800">
          Reactivate User
        </span>
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
        {/* Info Message */}
        <div className="p-4 mb-6 rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
          <p className="text-sm leading-relaxed">
            You are about to reactivate <strong>{user?.name}’s</strong> account.
            They will regain full access to their account immediately.
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
            <p className="text-sm text-gray-500 truncate max-w-[140px] sm:max-w-[420px]">{user?.email}</p>
          </div>
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
          onClick={handleReactivate}
          disabled={isLoading}
          className="w-[50%] sm:w-fit px-6 py-2 rounded-lg font-semibold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
          style={{
            background: "var(--gradient-color)",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Reactivating ...
            </span>
          ) : (
            "Reactivate"
          )}
        </button>
      </div>
    </Dialog>
  );
};

export default ReactivateUserModal;
