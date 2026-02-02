import React from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

const GeneralModal = ({ isOpen, onClose, children }) => (
  <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
    <DialogContent>{children}</DialogContent>
    <DialogActions>
      <button
        onClick={onClose}
        style={{ background: "var(--gradient-color)" }}
        className="px-4 py-2 text-white text-lg font-semibold rounded-xl mr-4 mb-3.5 cursor-pointer"
      >
        OK
      </button>
    </DialogActions>
  </Dialog>
);

export default GeneralModal;
