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
    alertTitle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      paddingBottom: 15,
      fontSize: 15,
      fontWeight: 'bold'
   },
    alertRow: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 13
    },
    rowContent: {
        wordBreak: 'break-all'
    }
  }));

export default function AlertInfo({alertDetails}) {
    const history = useHistory()    
    const classes = useStyles();

    let alertInfo = {}
    if(alertDetails.alertData) {
        alertInfo = {
            "Alert Information": alertDetails.alertData
        }
    }
    const getContent = () => {
        const AlertContent = <Grid container>
            {alertInfo && 
                <Grid item xs={12} className={[classes.gridStyle, classes.gridBorder]}>
                    {Object.keys(alertInfo).map((alertObj) => {
                        return (<Grid container>
                            <Grid item xs={12} className={classes.alertTitle}>{alertObj}</Grid>
                            <Grid item xs={12}> 
                                {Object.keys(alertInfo[alertObj]).map((alertRow) => {
                                    let dispLink = alertInfo[alertObj][alertRow]
                                    if(alertInfo[alertObj][alertRow] && alertRow === "MS Teams Chat Link") {
                                        dispLink = <a href={alertInfo[alertObj][alertRow]} target="_blank">Click here to join meeting</a>
                                    }
                                    return (<Grid container  className={classes.alertRow}>
                                        <Grid item xs={6}>{alertRow}</Grid>
                                        <Grid item xs={6} className={classes.rowContent}>{dispLink}</Grid>
                                    </Grid>)
                                })}
                            </Grid>
                        </Grid>)
                    })}
                </Grid>
            }
        </Grid>
        return AlertContent
    }
  
  return (
    <React.Fragment>
       <DetailedAccordion
          title = "Alert Details"
          content = {getContent()}
          expandFlag = {false}
      />
    </React.Fragment>
  )
}
