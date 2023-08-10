import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom'
import DetailedAccordion from '../../common/PaaSAccordion/detailed'

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
    gridStyle: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        padding: 5,
        fontSize: 15
    },
    gridPadding: {
        paddingTop: 30
    },
    notifyCount: {
       fontSize: 60,
       color: '#000'
    },
    notifyCountText: {
        color: "#666"
    },
    notifyTextBlue: {
        color: '#0083d7'
    },
    messageBlock: {
        padding: "5px 0px",
        textAlign: 'justify'
    },
    messageRow: {
        paddingBottom: 10
    }


  }));

export default function AlertMessage({alertDetails}) {
    const history = useHistory()    
    const classes = useStyles();     

    const getContent = () => {
        const MessageContent = <Grid container>
            <Grid item xs={12} className={classes.gridStyle}>
                {/*alertDetails.alertData && 
                    <div className={classes.messageBlock}>
                        <div className={classes.messageRow}>{alertDetails.alertInfo.source} has been declared by {alertDetails.alertInfo.typeName}. A conference bridge has been established.</div> 
                        <div className={classes.messageRow}>Your team's assistance is needed to help restore service.</div>
                        <div className={classes.messageRow}>{alertDetails.alertData.summary}</div>
                        <div className={classes.messageRow}>{alertDetails.alertData.att_conference_number}</div>
                    </div>
                */}
                <div className={classes.messageBlock}>
                    {alertDetails.message ? (
                        <div dangerouslySetInnerHTML={{__html: alertDetails.message}}/>
                    ) : (
                        <div>Message not available</div>
                    )}
                    
                </div>
            </Grid>
        </Grid>
        return MessageContent
    }
  
  return (
    <React.Fragment>
       <DetailedAccordion
          title = "Alert Message"
          content = {getContent()}
          expandFlag = {false}
      />
    </React.Fragment>
  )
}
