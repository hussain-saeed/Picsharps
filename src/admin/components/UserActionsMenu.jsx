import { useState } from "react";
import { Button, Menu, MenuItem, Divider } from "@mui/material";

const UserActionsMenu = ({
  user,
  onDelete,
  onSuspend,
  onReactivate,
  onNotify,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (cb) => {
    handleClose();
    cb?.(user);
  };

  const isActive = user.status === "Active";

  return (
    <>
      <Button size="small" variant="outlined" onClick={handleOpen}>
        Action
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {isActive
          ? [
              <MenuItem key="notify" onClick={() => handleAction(onNotify)}>
                Send notification
              </MenuItem>,

              <MenuItem key="suspend" onClick={() => handleAction(onSuspend)}>
                Suspend
              </MenuItem>,

              <Divider key="d1" />,

              <MenuItem
                key="delete"
                onClick={() => handleAction(onDelete)}
                sx={{ color: "error.main" }}
              >
                Delete
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="reactivate"
                onClick={() => handleAction(onReactivate)}
              >
                Reactivate
              </MenuItem>,

              <Divider key="d2" />,

              <MenuItem
                key="delete"
                onClick={() => handleAction(onDelete)}
                sx={{ color: "error.main" }}
              >
                Delete
              </MenuItem>,
            ]}
      </Menu>
    </>
  );
};

export default UserActionsMenu;
