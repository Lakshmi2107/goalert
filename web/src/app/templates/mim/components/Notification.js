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
    gridBorder: {
        borderRight: '2px solid #ebebeb'
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
    }


  }));

export default function Notification({alertDetails}) {
    const history = useHistory()    
    const classes = useStyles();
    let totalNotofied = 0
    let timeToFirstNotification = 0
    let totalUser = 0
    let notNotifiedUsers = 0
    let notNotifiedUsersPercentage = 0
    if(alertDetails.userDeliverySummary) {
        totalNotofied = alertDetails.userDeliverySummary.delivered + alertDetails.userDeliverySummary.responded
        timeToFirstNotification = alertDetails.userDeliverySummary.timeToFirstNotification
        totalUser = parseInt(alertDetails.userDeliverySummary.totalUsers)
        notNotifiedUsers = parseInt(alertDetails.userDeliverySummary.failed) + parseInt(alertDetails.userDeliverySummary.notNotified)
        notNotifiedUsersPercentage = parseFloat((notNotifiedUsers / totalUser * 100).toFixed(2))
    }

    const sanitise  = (x) => {
        if (isNaN(x)) {
          return 0;
        }
        return x;
    }
      

    const getContent = () => {
        const NotificationContent = <Grid container>
            <Grid item xs={3} className={[classes.gridStyle, classes.gridBorder]}>
                <div className={classes.notifyCount}>{totalNotofied}</div>
                <div className={classes.notifyCountText}>Notified User <br />out of {totalUser}</div>
            </Grid>
            <Grid item xs={9} className={[classes.gridStyle, classes.gridPadding]}>
                <div><span className={classes.notifyTextBlue}>Time to First Notification </span>.................. {timeToFirstNotification}s</div>
                <div><span className={classes.notifyTextBlue}>Notification Failure </span> ............. {sanitise(notNotifiedUsersPercentage)}% ({notNotifiedUsers} users)</div>
            </Grid>
        </Grid>
        return NotificationContent
    }
  
  return (
    <React.Fragment>
       <DetailedAccordion
          title = "Notification Highlights"
          content = {getContent()}
          expandFlag = {false}
      />
    </React.Fragment>
  )
}
