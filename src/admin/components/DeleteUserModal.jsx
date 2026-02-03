import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDeleteUserMutation } from "../features/core/adminCoreApi";
import { X } from "lucide-react";

const DeleteUserModal = ({ open, onClose, user }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [confirm, setConfirm] = useState("");
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleClose = () => {
    setReason("");
    setDetails("");
    onClose();
  };

  const handleDelete = async () => {
    try {
      const res = await deleteUser({
        userId: user.id,
        body: { reason, details },
      }).unwrap();

      if (res.status === "success") {
        toast.success("User deleted successfully!");
        handleClose();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
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
        style: { borderRadius: "18px", padding: "0 0 10px" },
      }}
    >
      {/* Header */}
      <DialogTitle className="flex justify-between items-start pb-4 gap-12">
        <span className="text-2xl font-medium text-gray-800">
          Delete Account
        </span>
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="p-1 rounded-full bg-gray-100 transition-colors"
          style={{
            cursor: isLoading ? "not-allowed" : "pointer",
            border: "1px solid rgb(225, 225, 255)",
          }}
        >
          <X size={20} className="text-gray-500" />
        </button>
      </DialogTitle>

      <DialogContent>
        {/* Warning Message */}
        <div className="flex gap-3 p-4 mb-4 rounded-xl bg-[#FFF2F2] border border-[#FF6666] text-[#D32F2F]">
          <p className="text-sm font-medium leading-relaxed">
            WARNING: This action cannot be undone. All user data, images, and
            history will be permanently deleted.
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

        {/* Reason Input */}
        <div className="mb-6">
          <label className="font-medium block mb-2 text-gray-700">
            Deletion Reason <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter deletion reason ..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
            className="w-full p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all disabled:opacity-60"
            style={{ border: "1px solid rgb(225, 225, 225)" }}
          />
        </div>

        {/* Details Input */}
        <div className="mb-4">
          <label className="font-medium block mb-2 text-gray-700">
            Deletion Details <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Add any additional details ..."
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            disabled={isLoading}
            className="w-full p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all resize-none disabled:opacity-60"
            style={{ border: "1px solid rgb(225, 225, 225)" }}
          />
        </div>

        <div className="mb-1">
          <label className="font-medium block mb-2 text-gray-700">
            Type DELETE in capital letters to confirm{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
            }}
            disabled={isLoading}
            className="w-full p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all disabled:opacity-60"
            style={{ border: "1px solid rgb(225, 225, 225)" }}
          />
        </div>
      </DialogContent>

      <div className="gap-2.5 flex py-2 px-6 justify-end">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="w-[50%] sm:w-fit px-5 py-2 bg-gray-200 rounded-lg font-medium text-gray-600"
          style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading || !reason || !details || confirm !== "DELETE"}
          className="w-[50%] sm:w-fit px-6 py-2 rounded-lg font-semibold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
          style={{
            background: "red",
            cursor:
              isLoading || !reason || !details || confirm !== "DELETE"
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Deleting ...
            </span>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </Dialog>
  );
};

export default DeleteUserModal;
