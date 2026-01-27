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
import { useSuspendUserMutation } from "../../../features/core/adminCoreApi";

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

    setIsLoading(true);
    try {
      const res = await suspendUser({
        userId: user.id,
        body: { reason, notes },
      }).unwrap();

      if (res.status === "success") {
        toast.success("User suspended successfully");
        handleClose();
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
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
        Suspend User
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
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
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isLoading}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          sx={{ cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          Cancel
        </Button>

        <Button
          color="warning"
          variant="contained"
          onClick={handleSuspend}
          disabled={isLoading}
          sx={{
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "LOADING" : "Suspend"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuspendUserModal;
