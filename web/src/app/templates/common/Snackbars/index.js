import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function PaasSnackbar({openStatus, severity, message, closeCB}) {
  const classes = useStyles();
  /*const [open, setOpen] = React.useState(openStatus);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };*/

  return (
    <div className={classes.root}>
      {/*<Button variant="outlined" onClick={handleClick}>
        Open success snackbar
    </Button>*/}
      <Snackbar open={openStatus} autoHideDuration={6000} onClose={closeCB}>
        <Alert onClose={closeCB} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      {/*<Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
        <Alert severity="success">This is a success message!</Alert>*/}
    </div>
  );
}
