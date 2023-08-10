import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom'
import PaaSAccordion from '../../common/PaaSAccordion'
import Notification from './Notification'
import DeliverySummary from './DeliverySummary'
import Comments from './Comments'
import AlertInfo from './AlertInfo'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1
    },
    titleBlock: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      paddingBottom: 15,
      paddingLeft: 10,
      fontSize: 26
   },
   
   gridStyle: {
       padding: 5
   }

  }));

export default function OverView({alertDetails, tabsCB}) {
    const history = useHistory()    
    const classes = useStyles();

  
  return (
    <div className={classes.root}>
       <Grid container>
            <Grid item md={6} xs={12} className={classes.gridStyle}>
                <Notification alertDetails={alertDetails} />
                <DeliverySummary alertDetails={alertDetails} tabsCB={tabsCB} />
            </Grid>
            <Grid item md={6} xs={12} className={classes.gridStyle}>
              {/* <Comments /> */} 
              <AlertInfo alertDetails={alertDetails} />
            </Grid>
        </Grid>
    </div>
  )
}