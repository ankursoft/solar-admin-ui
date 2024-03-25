import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button
} from "@mui/material";

import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";


export default function ConfirmDialog(props) {
  const { confirmDialog, setConfirmDialog } = props;
  // const classes = useStyles();

  return (
    <Dialog open={confirmDialog.isOpen} style={{ padding: 2, position: "absolute", top: 5 }}>
      <DialogTitle>
        <IconButton disableRipple>
          <NotListedLocationIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
          Cancel
        </Button>

        <Button onClick={confirmDialog.onConfirm}> Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
