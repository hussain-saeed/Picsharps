import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useReactivateUserMutation } from "../features/core/adminCoreApi";

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
        toast.success("User reactivated successfully");
        onClose();
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
      maxWidth="xs"
    >
      <DialogTitle>
        Reactivate User
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
        <Typography variant="body2">{user?.email}</Typography>
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
          color="success"
          variant="contained"
          onClick={handleReactivate}
          disabled={isLoading}
          sx={{
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "LOADING" : "Reactivate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReactivateUserModal;
