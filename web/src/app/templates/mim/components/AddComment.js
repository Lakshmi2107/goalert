import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom'
import { Button as MuiBtn } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { getPathParams } from '../../common/Utils'
import { useSelector, useDispatch } from 'react-redux';
import { postActionRedirect } from '../../action/formActions'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    titleBlock: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      paddingBottom: 15,
      paddingLeft: 10,
      fontSize: 26
   },
    textField: {
        width: 500
    },
    btnBlock: {
        display: 'block',

        textAlign: 'left'
    }


  }));

export default function AddComment({closeDialogCB}) {
    const history = useHistory()    
    const classes = useStyles();
    const dispatch = useDispatch();
    const [userComment, setUserComment] = useState(''); 

    const pathParams = getPathParams(window.location.pathname)
    let alertId = pathParams[2]

    const handleSubmit = () => {
        const payload = {
          comment: userComment
        }
        const postApiUrl = "/api/v1/templates/alerts/"+alertId+"/comment"
        dispatch(postActionRedirect(payload, postApiUrl, history, {}, {}))
        closeDialogCB(true)
    }
    
    const handleClose = () => {
        closeDialogCB(false)
    }

  return (
    <React.Fragment>
       <TextField
          id="outlined-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          variant="outlined"
          className={classes.textField}
          onChange={(event) => {
            setUserComment(event.target.value)
          }
          }
        />
        <div className={classes.btnBlock}>
            <MuiBtn  variant="contained" color="primary"  onClick={handleSubmit} style={{margin: '5px'}}>
                Submit
            </MuiBtn>
            <MuiBtn  variant="outlined" color="primary"  onClick={handleClose} style={{margin: '5px'}}>
                Cancel
            </MuiBtn>
        </div>
    </React.Fragment>
  )
}
