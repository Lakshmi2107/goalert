import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom'
import PaaSAccordion from '../../common/PaaSAccordion'
import { getActionStore } from '../../action/formActions'
import '../../css/fonts.css'
import PaaSTabs from '../../common/Tabs'
import Message from '@material-ui/icons/Message';
import Apps from '@material-ui/icons/Apps';
import History from '@material-ui/icons/History';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import OverView from './OverView'
import { getPathParams, convertStampDate } from '../../common/Utils'
import { useSelector, useDispatch } from 'react-redux';
import AlertMessage from './AlertMessage'
import AlertLogs from './AlertLogs'
import { FileCopy, Publish, Person } from '@material-ui/icons'
import UserDelivery from './UserDelivery'
import Description from '@material-ui/icons/Description';
import ListAlt from '@material-ui/icons/ListAlt';
import People from '@material-ui/icons/People';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      background: '#fff'
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    linkBlock: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        paddingBottom: 10,
        fontSize: 12,
        color: '#0083d7',
        display: 'flex'
    },
    titleBlock: {
        //fontFamily: "'Roboto Condensed', sans-serif !important",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        paddingBottom: 10,
        paddingLeft: 10,
        fontSize: '1.5rem',
        fontWeight: 400
    },
    subHeading: {
        //fontFamily: "'Roboto Condensed', sans-serif !important",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        paddingBottom: 5,
        paddingLeft: 10,
        fontSize: 14,
        fontWeight: 200,
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
        color: '#000',
        display: 'flex'
    },
    gridContainer: {
        paddingTop: 10
    },
    arrowIcon: {
        fontsize: 21,
        paddingTop: 4,
    },
    linkText: {
        paddingTop: 7,
        fontSize: 16,
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    linkTextAlert: {
        padding: '0px 5px',
        color: '#0283d7',
        fontSize: 16,
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline',
        },
        display: 'inline'
    },
    bgTwo: {
        display: 'flex',
        justifyContent: 'right'
    },
    durationBg: {
        background: '#7cb241',
        width: 175,
        height: 65,
        color: '#fff',
        padding: 8,
        borderRadius: 10,
        textAlign: 'left',
        position: 'relative',
        margin: 5
    },
    statusBg: {
        background: '#fb8c00',
        width: 175,
        height: 65,
        color: '#fff',
        padding: 8,
        borderRadius: 10,
        textAlign: 'right',
        position: 'relative',
        margin: 5
    },    
    infoRow1: {
        paddingTop: 16,
        fontSize: 26
    },
    infoRow2: {
        fontSize: 18
    },
    durationOver: {
        position: 'absolute',
        top: '-5%',
        right: 0,
        width: 135,
        background: '#fb8d00',
        height: 10
    },
    statusOver: {
        position: 'absolute',
        top: '-5%',
        left: 0,
        width: 135,
        background: '#7cb341',
        height: 10
    },
    /*linkBlock: {
        paddingBottom: 15,
        display: 'flex'
    },*/
    linkStyle: {
        paddingRight: 10,
        display: 'flex',
        fontSize: 16,
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    iconStyle: {
        fontSize: 17,
        paddingRight: 5
    },
    typeBlock: {
        display: 'flex',
        fontSize: 14,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        paddingBottom: 5,
        paddingLeft: 10,
    },
    typeRow: {
        display: 'flex',
    },
    iconStyle: {
        fontSize: 15,
        paddingRight: 3,
        color: '#cf142b'
    },
    typeLink: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline',
        },
        paddingRight: 10,
        color: '#0283d7',
        fontWeight: 'bold'
    },
    personIconStyle: {
        fontSize: 15,
        padding: '2px 3px 0px 3px'
    }

  }));

export default function MessagingReports() {
    const history = useHistory()
    const classes = useStyles();
    const dispatch = useDispatch();
    const displayStatusFlag = false

    const pathParams = getPathParams(window.location.pathname)
    let templateId = pathParams[2]

    const [apiCalled, setApiCalled] = useState(false); // integer state
    if(!apiCalled) {
      const getApiUrl = "/api/v1/templates/alerts/"+templateId
      dispatch(getActionStore(getApiUrl, 'ALERT_DETAILS', {}, {}, '', history))
      setApiCalled(true)
    }

    let templatesData = useSelector(state => state.templates);
    
    let alertInfo = {}
    let alertData = {}
    let notificationInfo = []
    if(templatesData.alertDetails) {
        alertInfo = templatesData.alertDetails.alertInfo
        alertData = templatesData.alertDetails.alertData
        notificationInfo = templatesData.alertDetails.notificationInfo
    }

    const [curTab, setCurTab] = useState(0)
    const tabsCB = (tab) => {
        setCurTab(tab)
    }
    
      const TabsInfo = [{
          name: 'Overview',
          icon: <Apps />,
          content: <OverView alertDetails={templatesData.alertDetails} tabsCB={tabsCB} />
      },{
        name: 'User Delivery',
        icon: <People />,
        content: <UserDelivery alertDetails={templatesData.alertDetails} />
    },{
        name: 'Message',
        icon: <Message />,
        content: <AlertMessage alertDetails={templatesData.alertDetails} />
    },{
        name: 'Event Logs',
        icon: <History />,
        content: <AlertLogs alertDetails={templatesData.alertDetails} />
    }]

    const alertLink = (path) => () => {
        history.push(path)
    }

    const handleDuplicate = () => {
        if(templatesData.alertDetails && templatesData.alertDetails.templateMasterId && templatesData.alertDetails.alertInfo) {
            const createPageUrl = "/messaging/create/"+templatesData.alertDetails.templateMasterId+"/"+templatesData.alertDetails.alertInfo.templateId
            history.push(createPageUrl)
        }
    }
  
  return (
    <div className={classes.root}>
        <Grid container className={classes.gridContainer} >
            <Grid item md={7} xs={12} className={classes.bgOne}>
                <div className={classes.linkBlock} onClick={alertLink('/reports')}> 
                    <ChevronLeftIcon className={classes.arrowIcon}/>
                    <span className={classes.linkText}>Reports</span>
                </div>
                {alertInfo && 
                    <React.Fragment>
                        <div className={classes.titleBlock}>{alertInfo.messageSubject}</div>
                        <div className={classes.subHeading}>Started at {convertStampDate(alertInfo.createdAt)} by <Person className={classes.personIconStyle} />{alertInfo.createdBy}</div>
                        <div className={classes.subHeading}>
                            <b>Related Alerts:</b> 
                            {notificationInfo.map((notificationObj) => {
                                if(notificationObj.goAlertId && notificationObj.goAlertId !== null && notificationObj.notifyType !== 'GoAlert-DirectPaging') {
                                    const alLink = '/alerts/'+notificationObj.goAlertId
                                    return (<a href={alLink} target="_blank" className={classes.linkTextAlert}>{notificationObj.goAlertId}</a>)
                                }
                            })}
                        </div>
                        <div className={classes.typeBlock}>
                            <span className={classes.typeRow}><ListAlt className={classes.iconStyle} /><span className={classes.typeLink} onClick={alertLink('/messaging')}>{alertInfo.typeName}</span></span>
                            <span className={classes.typeRow}><Description className={classes.iconStyle} />{alertInfo.source}</span>
                        </div>
                    </React.Fragment>
                }
            </Grid>
            <Grid item md={5} xs={12}>
                
                    <Grid container className={classes.gridContainer} >
                        <Grid item md={12} xs={12} className={classes.bgTwo}>
                            <div className={classes.linkBlock}>
                                <div className={classes.linkStyle} onClick={handleDuplicate}><FileCopy className={classes.iconStyle} />Duplicate</div>
                                {displayStatusFlag && 
                                    <div className={classes.linkStyle}><Publish className={classes.iconStyle} />Export</div>
                                }
                            </div>
                        </Grid>
                        {displayStatusFlag && 
                            <Grid item md={12} xs={12}  className={classes.bgTwo}>
                                <div className={classes.durationBg}>
                                    <div className={classes.infoRow1}>0m</div>
                                    <div className={classes.infoRow2}>Duration</div>
                                    <div className={classes.durationOver}></div>
                                </div>
                                <div className={classes.statusBg}>
                                    <div className={classes.infoRow1}>Terminated</div>
                                    <div className={classes.infoRow2}>Status</div>
                                    <div className={classes.statusOver}></div>
                                </div>
                            </Grid>
                        }                       
                    </Grid>
                
            </Grid>
        </Grid>
        <Grid container className={classes.gridContainer} >
            <Grid item md={12} xs={12}>
                <PaaSTabs tabs={TabsInfo} curTab={curTab} tabsCB={tabsCB} />
            </Grid>
        </Grid>
    </div>
  )
}
