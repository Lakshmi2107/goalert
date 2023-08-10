import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom'
import PaaSTabs from '../../common/Tabs'
import Email from '@material-ui/icons/Email';
import Sms from '@material-ui/icons/Sms';
import Person from '@material-ui/icons/Person';
import { getDisplayDate } from '@material-ui/pickers/_helpers/text-field-helper';
import { useDispatch, useSelector } from 'react-redux';
import { postActionStore } from '../../action/formActions'

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
    gridContainer: {
        paddingTop: 10
    },
    emailRoot: {
      border: '1px solid #ebebeb'
    },
    emailHeader: {
      height: 60,
      background: '#ebebeb',
      display: 'flex'
    },
    padding10: {
      padding: 10
    },
    padding5: {
      padding: 5,
      fontSize: 15
    },
    userIcon: {
      fontSize: 60
    },
    marginTop5: {
      marginTop: 5
    },
    smsRoot: {
      border: '1px solid #ebebeb',
      padding: 15
    },
    emailSubject: {
      textAlign: 'center',
      fontSize: 16
    }
  }));

export default function TemplatePreviewForm({ page, data }) {
    const history = useHistory()
    const classes = useStyles();
    const dispatch = useDispatch();
    const [apiCalled, setApiCalled] = useState(false)
    
    const templatesData = useSelector(state => state.templates);

    useEffect(() => {
      if(!apiCalled) {
        const postApiUrl = "/api/v1/templates/preview/"+page
        const payload = {
          "priority" : "High",
          "summary" : "test"
        }
        dispatch(postActionStore(data, postApiUrl, 'TEMPLATE_PREVIEW', {}, {}, '', history))
        setApiCalled(true)
      }
    })

    let emailPreviewContent  = <div>Loading...</div>
    let smsPreviewContent  = <div>Loading...</div>
    
    if(!_.isEmpty(templatesData.previewData)) {    
      emailPreviewContent  = <React.Fragment>
        <div className={classes.emailSubject} dangerouslySetInnerHTML={{__html: templatesData.previewData.emailSubject}}></div>
        <div className={classes.emailRoot}>
        <div container className={classes.emailHeader} >
            <div className={classes.padding5}>
              <Person className={classes.userIcon} />
            </div>
            <div className={classes.padding5}>
              <div className={classes.marginTop5}>From: GoAlert</div>
              <div>To: Recipient</div>
            </div>
        </div>
        <div className={classes.padding10} dangerouslySetInnerHTML={{__html: templatesData.previewData.emailBody}}></div>
      </div>
      </React.Fragment>

      smsPreviewContent = <div className={classes.smsRoot}>
        <div dangerouslySetInnerHTML={{__html: templatesData.previewData.smsBody}}></div>
      </div> 
    }

    
    let TabsInfo = []

    if(templatesData.previewData.emailBody) {
      const emailObj = {
        name: 'Email',
        icon: <Email />,
        content: emailPreviewContent
      }
      TabsInfo.push(emailObj)
    }

    if(templatesData.previewData.smsBody) {
      const smsObj = {
        name: 'SMS',
        icon: <Sms />,
        content: smsPreviewContent
    }
      TabsInfo.push(smsObj)
    }
    /*const TabsInfo = [{
          name: 'Email',
          icon: <Email />,
          content: emailPreviewContent
      },{
        name: 'SMS',
        icon: <Sms />,
        content: smsPreviewContent
    }]*/
    
    const [curTab, setCurTab] = useState(0)
    const tabsCB = (tab) => {
        setCurTab(tab)
    }
  
  return (
    <div className={classes.root}>
        <Grid container className={classes.gridContainer} >
            <Grid item md={12} xs={12}>
                <PaaSTabs tabs={TabsInfo} curTab={curTab} tabsCB={tabsCB} />
            </Grid>
        </Grid>
    </div>
  )
}
