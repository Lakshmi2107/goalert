import React, { useEffect } from 'react';
import { makeStyles } from '@mui/core/styles';
import Button from '@mui/core/Button';
import Dialog from '@mui/core/Dialog';
import ListItemText from '@mui/core/ListItemText';
import ListItem from '@mui/core/ListItem';
import List from '@mui/core/List';
import Divider from '@mui/core/Divider';
import AppBar from '@mui/core/AppBar';
import Toolbar from '@mui/core/Toolbar';
import IconButton from '@mui/core/IconButton';
import Typography from '@mui/core/Typography';
import CloseIcon from '@mui/icons/Close';
import Slide from '@mui/core/Slide';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background: "#005d96"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const FullScreenDialog = ({ dialogOpenStatus, dialogContent, closeDialogCB, dialogTitle }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    closeDialogCB()
  };

  useEffect(() => {
    setOpen(dialogOpenStatus);
 }, [dialogOpenStatus])

  const title = dialogTitle ? dialogTitle : "DbaaS Privisioning Details"

  return (
    <div>
      
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
            {/*<Button autoFocus color="inherit" onClick={handleClose}>
              Close
            </Button>*/}
          </Toolbar>
        </AppBar>
        {dialogContent}
      </Dialog>
    </div>
  );
}

export default FullScreenDialog