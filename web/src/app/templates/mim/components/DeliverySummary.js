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
    summaryStyle: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    summaryBlock: {
        width: 92,
        paddingRight: 9,
        paddingBottom: 9,
        cursor: 'pointer'
    },
    summaryDarkGrey: {
        height: 50,
        color: "#fff",
        margin: 'auto',
        background: "#666666f5",
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 25,
        borderRadius: '5px 5px 0px 0px'
    },
    summaryGrey: {
        height: 50,
        color: "#fff",
        margin: 'auto',
        background: "#999999",
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 25,
        borderRadius: '5px 5px 0px 0px'
    },
    summaryBlue: {
        height: 50,
        color: "#fff",
        margin: 'auto',
        background: "#0083d7",
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 25,
        borderRadius: '5px 5px 0px 0px'
    },
    summaryGreen: {
        height: 50,
        color: "#fff",
        margin: 'auto',
        background: "#7aa108",
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 25,
        borderRadius: '5px 5px 0px 0px'
    },
    summaryRed: {
        height: 50,
        color: "#fff",
        margin: 'auto',
        background: "#d80000",
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 25,
        borderRadius: '5px 5px 0px 0px'
    },
    summaryRow2: {
        height: '30px !iumportant'
    },
    summaryTextLink: {
        color: "#0083d7",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 14,
        textAlign: 'center',
        border: '1px solid #bbbaba',
        borderRadius: '0px 0px 5px 5px'
    },
    summaryText: {
        color: "#666",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 12,
        display: 'block'
    }


  }));

export default function DeliverySummary({alertDetails, tabsCB}) {
    const history = useHistory()    
    const classes = useStyles();

    let totalUser = 0
    let notNotified = 0
    let notNotifiedPercentage = 0
    let delivered = 0
    let deliveredPercentage = 0
    let responded = 0
    let respondedPercentage = 0
    let failed = 0
    let failedPercentage = 0

    if(alertDetails.userDeliverySummary) {
        totalUser = parseInt(alertDetails.userDeliverySummary.totalUsers)
        notNotified = parseInt(alertDetails.userDeliverySummary.notNotified)
        notNotifiedPercentage = parseFloat((notNotified / totalUser * 100).toFixed(2))
        delivered = parseInt(alertDetails.userDeliverySummary.delivered)
        deliveredPercentage = parseFloat((delivered / totalUser * 100).toFixed(2))
        responded = parseInt(alertDetails.userDeliverySummary.responded)
        respondedPercentage = parseFloat((responded / totalUser * 100).toFixed(2))
        failed = parseInt(alertDetails.userDeliverySummary.failed)
        failedPercentage = parseFloat((failed / totalUser * 100).toFixed(2))
    }

    const sanitise  = (x) => {
        if (isNaN(x)) {
          return 0;
        }
        return x;
    }

    const getContent = () => {
        const SummaryContent = <div className={classes.summaryStyle}>
            <div className={classes.summaryBlock} onClick={() => tabsCB(1)}>
                <div className={classes.summaryDarkGrey}>
                    {totalUser}
                </div>
                <div className={classes.summaryRow2}>
                    <div className={classes.summaryTextLink}>Total Users</div>
                </div>
            </div>
            <div className={classes.summaryBlock} onClick={() => tabsCB(1)}>
                <div className={classes.summaryGrey}>
                    {notNotified}
                </div>
                <div className={classes.summaryRow2}>
                    <div className={classes.summaryTextLink}>Not Notified
                        <span className={classes.summaryText}>{sanitise(notNotifiedPercentage)}% of total</span>
                    </div>
                </div>
            </div>
            <div className={classes.summaryBlock} onClick={() => tabsCB(1)}>
                <div className={classes.summaryBlue}>
                    {delivered}
                </div>
                <div className={classes.summaryRow2}>
                    <div className={classes.summaryTextLink}>Delivered
                        <span className={classes.summaryText}>{sanitise(deliveredPercentage)}% of total</span>
                    </div>
                </div>
            </div>
            <div className={classes.summaryBlock} onClick={() => tabsCB(1)}>
                <div className={classes.summaryGreen}>
                    {responded}
                </div>
                <div className={classes.summaryRow2}>
                    <div className={classes.summaryTextLink}>Responded
                        <span className={classes.summaryText}>{sanitise(respondedPercentage)}% of total</span>
                    </div>
                </div>
            </div>
            <div className={classes.summaryBlock} onClick={() => tabsCB(1)}>
                <div className={classes.summaryRed}>
                    {failed}
                </div>
                <div className={classes.summaryRow2}>
                    <div className={classes.summaryTextLink}>Failed
                        <span className={classes.summaryText}>{sanitise(failedPercentage)}% of total</span>
                    </div>
                </div>
            </div>

        </div>
        return SummaryContent
    }
  
  return (
    <React.Fragment>
       <DetailedAccordion
          title = "User Delivery Summary"
          content = {getContent()}
          expandFlag = {false}
      />
    </React.Fragment>
  )
}