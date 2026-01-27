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

const SuspendUserModal = ({ open, onClose, user }) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleClose = () => {
    setReason("");
    setNotes("");
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
        Suspend User
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          X
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography fontWeight={600}>{user?.name}</Typography>
        <Typography variant="body2" mb={2}>
          {user?.email}
        </Typography>

        <TextField
          fullWidth
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="warning" variant="contained">
          Suspend
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuspendUserModal;
