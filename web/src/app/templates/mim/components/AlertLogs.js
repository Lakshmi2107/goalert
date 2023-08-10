import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip'
import { useHistory } from 'react-router-dom'
import DetailedAccordion from '../../common/PaaSAccordion/detailed'
import { getAlertLogs, getDirectAlertLogs } from '../../common/Queries/Services'
import ClientPaginationGrid from '../../common/DataGrid/ClientPaging'
import { convertToTitle } from '../../common/Utils'

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

export default function AlertLogs({alertDetails}) {
    const history = useHistory()  
    const classes = useStyles();
    let alertLogs = []

    const columns = ['time', 'auditMessage', 'status', 'service']
    let columnDefs = []
    columns.map((opt) => {
        const colObj = {
            field: opt,
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            },
            suppressColumnsToolPanel: true,
            floatingFilter: true,
            filter: 'agTextColumnFilter',
            tooltipField: opt,
            headerName: convertToTitle(opt),
            width: 250,
            hide: false,
            renderCell: (params) => (
              <Tooltip title={params.value}>
                <span>{params.value}</span>
              </Tooltip>
            )
        }
        columnDefs.push(colObj)
    })    

    if(alertDetails.notificationInfo) {
        alertDetails.notificationInfo.map((notifyObj, key) => {
            if(notifyObj.goAlertId) {
                let limit = 100
                let logsList = []
                if(notifyObj.notifyType === "GoAlert-DirectPaging") {
                    logsList = getDirectAlertLogs(notifyObj.goAlertId, notifyObj.serviceName, limit)
                } else {
                    logsList = getAlertLogs(notifyObj.goAlertId, notifyObj.serviceName, limit)
                }
                alertLogs = alertLogs.concat(logsList);        
            }
        })
    }

    const sortLogs = (array) => {
        var sortedData= array.sort((function (a, b) { 
            return new Date(b.time) - new Date(a.time) 
        }));
        return sortedData
    }

    
    if(alertLogs.length > 0) {
        sortLogs(alertLogs)
    } 

    const getContent = () => {
        const LogContent = <Grid container>
            <Grid item xs={12} className={classes.gridStyle}>
                {(alertLogs.length > 0) ? (
                    <React.Fragment>
                        <ClientPaginationGrid
                            columnDefs={columnDefs}
                            rowData={alertLogs}
                        />
                    </React.Fragment>
                ) : (
                    <div>Logs not available</div>
                )
                }
            </Grid>
        </Grid>
        return LogContent
    }
  return (
    <React.Fragment>
       <DetailedAccordion
          title = "Event Logs"
          content = {getContent()}
          expandFlag = {false}
      />
    </React.Fragment>
  )
}
