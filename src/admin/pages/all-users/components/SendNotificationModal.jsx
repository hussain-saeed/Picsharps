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
  Box,
} from "@mui/material";

const SendNotificationModal = ({ open, onClose, user }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setSubject("");
    setMessage("");
    onClose();
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
        />

        <TextField
          fullWidth
          label="Message"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained">Send</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendNotificationModal;
