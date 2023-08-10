import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const ResponsiveDialog = ({ dialogOpenStatus, dialogContent, dialogTitle, closeDialogCB }) => {
  const [open, setOpen] = React.useState(dialogOpenStatus);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('l'));

  useEffect(() => {
    setOpen(dialogOpenStatus);
}, [dialogOpenStatus])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    closeDialogCB()
  };

  return (
    <div style={{width: '1000px'}}>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        
      >
        <DialogTitle id="responsive-dialog-title">
            {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResponsiveDialog