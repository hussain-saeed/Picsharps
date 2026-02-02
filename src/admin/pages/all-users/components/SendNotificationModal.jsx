import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNotifyUserMutation } from "../../../features/core/adminCoreApi";
import { X } from "lucide-react"; // تأكد من تنزيل lucide-react أو استخدم حرف X عادي

const SendNotificationModal = ({ open, onClose, user }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notifyUser, { isLoading }] = useNotifyUserMutation();

  const MAX_CHARACTERS = 500;

  const handleClose = () => {
    setSubject("");
    setMessage("");
    onClose();
  };

  const handleSend = async () => {
    if (!subject || !message) {
      return toast.warning("Please fill in all required fields");
    }

    try {
      const res = await notifyUser({
        userId: user.id,
        body: { subject, message },
      }).unwrap();

      if (res.status === "success") {
        toast.success("Notification sent successfully");
        handleClose();
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
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
        style: { borderRadius: "18px", padding: "12px" },
      }}
    >
      {/* Header */}
      <DialogTitle className="flex justify-between items-start pb-4 gap-12">
        <span className="text-2xl font-medium">
          Send Notification to {user?.name}
        </span>
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </DialogTitle>

      <DialogContent className="mt-4">
        {/* User Info Card */}
        <div className="bg-[#F8F9FA] p-6 rounded-lg mb-8 border border-gray-100">
          <p className="font-semibold text-gray-800 leading-tight">
            {user?.name}
          </p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Subject Input */}
        <div className="mb-6">
          <label className="font-medium block mb-2">
            Notification Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter notification title ..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isLoading}
            className="w-full p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all disabled:opacity-60"
            style={{ border: "1px solid rgb(225, 225, 225)" }}
          />
        </div>

        {/* Message Input */}
        <div className="mb-1">
          <label className="font-medium block mb-2">
            Message Body <span className="text-red-500">*</span>
          </label>
          <textarea
            resize
            placeholder="Write your message here ..."
            rows={6}
            maxLength={MAX_CHARACTERS}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            className="w-full  p-[10px_12px] rounded-lg outline-none focus:ring-2 focus:ring-[#00B0FF] transition-all resize-none disabled:opacity-60"
            style={{ border: "1px solid rgb(225, 225, 225)" }}
          />
          {/* Character Counter */}
          <div className="flex justify-end mt-1">
            <span
              className={`text-xs ${message.length >= MAX_CHARACTERS ? "text-red-500" : "text-gray-400"}`}
            >
              {message.length}/{MAX_CHARACTERS}
            </span>
          </div>
        </div>
      </DialogContent>

      <DialogActions className="gap-1 flex">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="w-[50%] sm:w-fit px-5 py-2 bg-gray-200 rounded-lg font-medium text-gray-600 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSend}
          disabled={isLoading || !subject || !message}
          className="w-[50%] sm:w-fit px-6 py-2 rounded-lg font-semibold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          style={{ background: "var(--gradient-color)" }}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Sending...
            </span>
          ) : (
            "Send"
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default SendNotificationModal;
