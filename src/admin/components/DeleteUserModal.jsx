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
import { useDeleteUserMutation } from "../features/core/adminCoreApi";

const DeleteUserModal = ({ open, onClose, user }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
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
        toast.success("User deleted successfully");
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
        Delete User
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
          label="Details"
          multiline
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          disabled={isLoading}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;
