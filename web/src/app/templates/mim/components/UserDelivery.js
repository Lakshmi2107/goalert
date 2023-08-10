import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip'
import { useHistory } from 'react-router-dom'
import DetailedAccordion from '../../common/PaaSAccordion/detailed'
import { getAlertLogs } from '../../common/Queries/Services'
import Phone from '@material-ui/icons/Phone';
import Chat from '@material-ui/icons/Chat'
import Email from '@material-ui/icons/Email'
import { convertStampDate, convertToTitle } from '../../common/Utils'
import ClientPaginationGrid from '../../common/DataGrid/ClientPaging'

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
    },
    iconColorGreen: {
        color: 'green'
    },
    iconColorRed: {
        color: 'red'
    }


  }));

export default function UserDelivery({alertDetails}) {
    const history = useHistory()    
    const classes = useStyles();
    let rowData = []
    const columns = ['userName', 'firstDelivered', 'deliveryStatus', 'devices']
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
    
    if(alertDetails && alertDetails.userDeliverySummary) {
        rowData = alertDetails.userDeliverySummary.userDetails
        rowData.map((opt) => {
            opt.id = opt.userId
            let icons = ""
            if(opt.device && opt.device !== null) {
                opt.device.map((deviceObj, key) => {
                    //let curData = ''
                    /*const iconStyle = deviceObj.status === 'Delivered' ? classes.iconColorGreen : classes.iconColorRed
                    switch(deviceObj.deviceName) {
                        case 'Voice':
                            curData = <Phone className={iconStyle} />
                            break;
                        case 'Email':
                            curData = <Email className={iconStyle} />
                            break;
                        case 'SMS':
                            curData = <Chat className={iconStyle} />
                            break;
                        default:
                            curData = ''
                            break;
                    }*/
                    const curData = deviceObj.deviceName+"("+deviceObj.status+")"
                    icons = icons === "" ? curData : icons +", "+ curData
                })
                opt.devices = icons
            }

            if(opt.firstDelivered) {
                opt.firstDelivered = convertStampDate(opt.firstDelivered)
            }

        })
    }

    /*const sortLogs = (array) => {
        var sortedData= array.sort((function (a, b) { 
            return new Date(b.time) - new Date(a.time) 
        }));
        return sortedData
    }

    
    if(alertLogs.length > 0) {
        sortLogs(alertLogs)
    } */

    const getContent = () => {
        const LogContent = <Grid container>
            <Grid item xs={12} className={classes.gridStyle}>
                {(rowData.length > 0) ? (
                    <React.Fragment>
                        <ClientPaginationGrid
                            columnDefs={columnDefs}
                            rowData={rowData}
                        />
                    </React.Fragment>
                ) : (
                    <div>Users not available</div>
                )
                }
            </Grid>
        </Grid>
        return LogContent
    }

    if(rowData.length > 0) {
        rowData.map((rowObj) => {
          if(rowObj.createdAt) {
            rowObj.createdAt = convertStampDate(rowObj.createdAt)
          }
        })
      }

  return (
    <React.Fragment>
       <DetailedAccordion
          title = "User Delivery"
          content = {getContent()}
          expandFlag = {true}
      />
    </React.Fragment>
  )
}
