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

const ReactivateUserModal = ({ open, onClose, user }) => {
  const handleClose = () => {
    onClose();
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
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          X
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography fontWeight={600}>{user?.name}</Typography>
        <Typography variant="body2">{user?.email}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="success" variant="contained">
          Reactivate
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ReactivateUserModal;
