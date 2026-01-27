import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNotifyUserMutation } from "../../../features/core/adminCoreApi";

const SendNotificationModal = ({ open, onClose, user }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notifyUser, { isLoading }] = useNotifyUserMutation();

  const handleClose = () => {
    setSubject("");
    setMessage("");
    onClose();
  };

  const handleSend = async () => {
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
      onClose={() => {}}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Send Notification
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          X
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography fontWeight={600}>{user?.name}</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {user?.email}
        </Typography>

        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Message"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendNotificationModal;
