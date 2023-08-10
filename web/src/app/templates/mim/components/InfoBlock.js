import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close'

const useStyles = makeStyles((theme) => ({
    
    infoBlockStyle: {
      borderRight:'1px solid #0283d736',
      borderTop:'1px solid #0283d736',
      borderBottom:'1px solid #0283d736',
      borderLeft:'4px solid #0083d7',
      height: 25,
      borderRadius: 5,
      padding: '10px 5px 5px 5px',
      marginBottom: 10,
      marginLeft: 5,
      display: 'flex'
    },
    textStyle: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 15,
        paddingLeft: 5,
        color: '#616161cc'
    },
    iconStyle: {
        fontSize: 15
    },
    closeStyle: {
        paddingRight: 10,
        marginLeft: 'auto',
        cursor: 'pointer'
    },
    iconStyle: {
        fontSize: 15,
        color: '#999'
    }
    
  }));

export default function InfoBlock({icon, text}) {
    const classes = useStyles();
    const [closeStatus, setCloseStatus] = useState(true) 

    const handleClose = () => {
        setCloseStatus(false)
    }
  
  return (
    <React.Fragment>
        {closeStatus && 
            <div className={classes.infoBlockStyle}>
                {icon && 
                    <span className={classes.iconStyle}>{icon}</span>
                }
                <span className={classes.textStyle}>{text}</span>
                <span className={classes.closeStyle} onClick={handleClose}><Close className={classes.iconStyle} /></span>
            </div>
        }
    </React.Fragment>
  )
}
