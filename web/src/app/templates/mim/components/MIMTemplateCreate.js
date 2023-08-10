import React, { useEffect, useState } from 'react';
import _ from 'lodash'
import { gql, useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
//import { templateData } from '../data/templatesList'
import GenerateForm from '../../common/Forms/generateForm'
import { useHistory } from 'react-router-dom'
import { postActionRedirect } from '../../action/formActions'
import { CircularProgress } from '@material-ui/core'
import { getAllServices, getAllLabels, getAppSystems } from '../../common/Queries/Services'
import { getPathParams } from '../../common/Utils'
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core'
import { getActionStore, postActionStore } from '../../action/formActions'
import { removeMsteamData } from '../../action/commonActions'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import InfoBlock from './InfoBlock'
import Help from '@material-ui/icons/Help'
import TemplatePreviewForm from './TemplatePreviewForm';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding:10,
        marginTop: 10
    },
    titleBlock: {
        //fontFamily: "'Roboto Condensed', sans-serif !important",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        paddingBottom: 15,
        paddingLeft: 10,
        fontSize: 26,
        textAlign: 'left'
    },
    linkBlock: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        paddingBottom: 10,
        fontSize: 12,
        color: '#0083d7',
        display: 'flex'
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
    reqStyle: {
        color: '#cc2408',
        paddingTop: 4,
        paddingRight: 5,
        fontSize: 17
    }
}));
export default function MIMTemplateCreate() {
    const classes = useStyles();
    //List service start 
    let serviceItems = getAllServices()
    
    const pathParams = getPathParams(window.location.pathname)
    //List service ends
    const dispatch = useDispatch();
    const history = useHistory()
    let componentsList = []
    const [apiCalled, setApiCalled] = useState(false); // integer state
    const [reloadCalled, setReloadCalled] = useState(false)
    const [alertsCalled, setAlertsCalled] = useState(false)
    const [sendPayload, setSendPayload] = useState({})
    const [updatedPayload, setUpdatedPayload] = useState({})

    let dashboardUrl = "/messaging"
    let page = pathParams[3]
    let alertId = pathParams[4]
    let platformKind = ''
    let originalData = {}
    let formFields = []

    const templatesData = useSelector(state => state.templates);
    const commonData = useSelector(state => state.common);
    
    let templateData = {}
    if(!_.isEmpty(templatesData.templatesList)) {
        Object.keys(templatesData.templatesList).map((tempObj) => {
            const templateObj = _.find(templatesData.templatesList[tempObj], (n) => { return n.id === page})
            if(templateObj) {
                templateData = templateObj
                templateData.fields.map((obj) => {
                    //obj.options = []
                    if(obj.field === 'TextArea') {
                        obj.maxRows = 3
                    }
                })
            }
        })
    } else if(!reloadCalled) {
        const getApiUrl = "/api/v1/templates/"
        dispatch(getActionStore(getApiUrl, 'TEMPLATES_LIST', {}, {}, '', history))
        setReloadCalled(true)
    }


    useEffect(() => {
            //Trigger API Calls
            if(!apiCalled && !_.isEmpty(templateData)) {
                templateData.fields.map((tempObj) => {
                    if(tempObj.apiUrl && tempObj.apiUrl !== null && tempObj.name !== 'support_group') {
                        const passObj = _.find(commonData.paasOptions, (n) => { return n.name === tempObj.name})
                        if(!passObj) {
                            const refFields = {
                                name: tempObj.name
                            }
                            dispatch(getActionStore(tempObj.apiUrl, 'PAAS_OPTIONS', refFields, {}, '', history))
                        }
                    } 
                })
                setApiCalled(true)
            }
    },[templateData])
    let tokenObj = []
    
    const getUpdatedPayload = (payload) => {
        const updatedPayload = {}
        if(!_.isEmpty(templateData) && templateData.fields.length > 0) {
            templateData.fields.map((tempObj) => {
                if(!_.isEmpty(payload[tempObj.name])) {
                    if(tempObj.name === 'send_communication_to' || tempObj.name === 'itfsd_site') {
                        const obj = {
                            name: payload[tempObj.name].label,
                            value: payload[tempObj.name].values
                        }
                        updatedPayload[tempObj.label] = obj
                    }
                    else if(tempObj.name === 'support_group') {
                        const serviceArr = []
                        payload[tempObj.name].map((payloadObj) => {
                            const serviceObj = {
                                serviceId: payloadObj.value,
                                serviceName: payloadObj.label,
                                integrationToken: payloadObj.integrationToken
                            }
                            serviceArr.push(serviceObj)
                        })
                        updatedPayload[tempObj.label] = serviceArr
                    } else if(tempObj.field === 'AutoCompleteMultiple') {
                        const tempArr = []
                        payload[tempObj.name].map((payloadObj) => {
                            tempArr.push(payloadObj.label)
                        })
                        updatedPayload[tempObj.label] = tempArr
                    } else if(tempObj.field === 'AutoComplete') {
                        updatedPayload[tempObj.label] = payload[tempObj.name].label
                    } else {
                        updatedPayload[tempObj.label] = payload[tempObj.name]
                    }
                }
            })
        }
        return updatedPayload
    }
    
    const makeSubmitCall = (payloadData) => {
        const updatedPayloadData = getUpdatedPayload(payloadData)
        const sendPayloadData = {
            templateId: templateData.id,
            templateType: templateData.templateType,
            //data: updatedPayloadData,
            alertData: updatedPayloadData
            //type: templateData.type
        }
        //const submitUrl = "/api/v1/templates/create-template"
        const submitUrl = "/api/v1/templates/data"
        const redirectUrl = "/reports"
        dispatch(postActionRedirect(sendPayloadData, submitUrl, history, redirectUrl, tokenObj))
        setSendPayload({})
    }
    

    useEffect(() => {
        if(!_.isEmpty(templatesData.msTeamData)) {
            const updatedsendPayload = JSON.parse(JSON.stringify(updatedPayload));
            //updatedsendPayload[6] = templatesData.msTeamData.joinWebUrl // 6: MS Teams Chat Link
            // updatedsendPayload.ms_teams_link = templatesData.msTeamData.joinWebUrl // 6: MS Teams Chat Link
            updatedsendPayload.ms_teams_link = templatesData.msTeamData.webUrl // 6: MS Teams Chat Link
            setSendPayload(updatedsendPayload)
            makeSubmitCall(updatedsendPayload)
            dispatch(removeMsteamData())
        }
    }, [templatesData.msTeamData])
    
    
    const handleSubmit = (payload) => {
        //const updatedPayload = getUpdatedPayload(payload)
        setSendPayload(payload) 
        //if(updatedPayload[8] === 114) { // 8: Create Microsoft Teams Channel, 114: include
        if(payload.create_ms_teams_link && payload.create_ms_teams_link.label === "Include") {
            //if(alertId && templatesData.alertDetails && templatesData.alertDetails.alertData) { // Check include is selected in Duplicate scenario
            //if(alertId && templatesData.alertDetails && templatesData.alertDetails.alertData && templatesData.alertDetails.alertData['Incident Number'] === payload.incident_number) { // Check include is selected in Duplicate scenario
            if(alertId && templatesData.alertDetails && templatesData.alertDetails.alertData && templatesData.alertDetails.alertData['Incident Number'] === payload.incident_number && (templatesData.alertDetails.alertData['MS Teams Chat Link'] && templatesData.alertDetails.alertData['MS Teams Chat Link'] !== null)) { // Check include is selected in Duplicate scenario
                //const updatedsendPayload = JSON.parse(JSON.stringify(sendPayload));
                payload.ms_teams_link = templatesData.alertDetails.alertData['MS Teams Chat Link']
                setSendPayload(payload)
                makeSubmitCall(payload)
            } else {
                //const msteamUrl = "/api/v1/integration/onlinemeeting?incidentNumber="+updatedPayload[4] // 4: incident_numbe
                //const msteamUrl = "/api/v1/integration/onlinemeeting?incidentNumber="+payload.incident_number // 4: incident_numbe
                setUpdatedPayload(payload)
                const msteamUrl = "/api/v1/azureadutils/channel?displayName="+payload.incident_number
                dispatch(postActionStore({}, msteamUrl, 'MSTEAM_DATA', {}, {}, '', history))
                // const msteamUrl = "/api/v1/azureadutils/onlinemeeting?incidentNumber="+payload.incident_number
                // dispatch(getActionStore(msteamUrl, 'MSTEAM_DATA', {}, {}, '', history))
            }
        } else {
            makeSubmitCall(payload)
        }
    }

    const handleChange = (payload) => {
        console.log("'handle change >> ", payload)
        setSendPayload(payload) 
        //pleaceholder if any change required
    }

    const alertLink = () => {
        history.push('/messaging')
    }

    //Duplicate form from details page - start
    if(alertId) {
        if(!_.isEmpty(templatesData.alertDetails)) {
            Object.keys(templatesData.templatesList).map((tempObj) => {
                const templateObj = _.find(templatesData.templatesList[tempObj], (n) => { return n.id === page})
                if(templateObj) {
                    templateData = templateObj
                    templateData.fields.map((obj) => {
                        //Checkbox preselected 
                        if(obj.field === 'CheckBox' && templatesData.alertDetails.alertData[obj.label]) {
                            /* //revisit for multiple options
                            let checkBoxArr = []
                            if(obj.options.length >0) {
                                obj.options.map((checkObj) => {
                                    let selectedCheck = ''
                                    selectedCheck = templatesData.alertDetails.alertData[obj.label]
                                    checkBoxArr.push(selectedCheck)
                                })
                            }
                            obj.preSelected = checkBoxArr*/
                            // for single option
                            let selectedCheck = ''
                            selectedCheck = templatesData.alertDetails.alertData[obj.label]
                            obj.preSelected = {[selectedCheck]: true}
                        } else {
                            let selectedOne = ''
                            selectedOne = templatesData.alertDetails.alertData[obj.label]
                            obj.preSelected = selectedOne
                        }
                    })
                    //Check MS team include or not - start
                    /*const linkOptionsObj = _.find(templateData.fields, (n) => { return n.name === 'create_ms_teams_link'})
                    if(linkOptionsObj) {
                        const teamLinkObj = _.find(templateData.fields, (n) => { return n.name === 'ms_teams_link'})
                        if(teamLinkObj) {
                            teamLinkObj.preSelected = ''
                        }
                    }*/
                    //Check MS team include or not - end
                }
            })
        } else if(!alertsCalled) {
            const getApiUrl = "/api/v1/templates/alerts/"+alertId
            dispatch(getActionStore(getApiUrl, 'ALERT_DETAILS', {}, {}, '', history))
            setAlertsCalled(true)
        }
    } 
     
    if(commonData.paasOptions && templateData && templateData.fields) {
        templateData.fields.map((tempObj) => {
            const fieldObj = _.find(commonData.paasOptions, (n) => { return n.name === tempObj.name})
            if(fieldObj) {
                tempObj.options = fieldObj.options
                // Set preselected - start
                if(tempObj.preSelected && tempObj.field === 'AutoComplete' && !alertId) {
                    const optObj = _.find(fieldObj.options, (n) => { return n.value === parseInt(tempObj.preSelected)})
                    if(optObj) {
                        tempObj.preSelected = optObj.label
                    }
                }
                // Set preselected - end
            } 
            if(tempObj.name === 'support_group') {
                tempObj.options = serviceItems
            }
        })
    }
    //Duplicate form from details page - end
    
    if(!_.isEmpty(templateData)) {
        originalData = templateData
        formFields = templateData.fields
    }

    let sendTemplateData = {}
    if(!_.isEmpty(sendPayload)) {
        sendTemplateData = getUpdatedPayload(sendPayload)
    }

    return (
    <React.Fragment>
        <Paper className={classes.paper}>
            <div className={classes.linkBlock} onClick={alertLink}> 
                <ChevronLeftIcon className={classes.arrowIcon}/>
                <span className={classes.linkText}>Messaging</span>
            </div>
            <div className={classes.titleBlock}>
                {originalData.name}
            </div>
            <div>
                <InfoBlock 
                    text="Sending this form notifies targeted recipients and any subscribers."
                    icon={<Help style={{ fontSize: 17, color: '#616161cc' }} />}
                 />
            </div>
            
            {(!_.isEmpty(templateData)) ? (
                <div>
                    <GenerateForm 
                        formTitle={originalData.name}
                        originalFormData={formFields} 
                        submitBtnText="Submit" 
                        submitCB={handleSubmit} 
                        cancelBtnText="Cancel" 
                        cancelUrl={dashboardUrl}
                        originalData={originalData}
                        tokenObj={tokenObj}
                        page={page}
                        platformKind={platformKind}
                        componentsList={componentsList}
                        handleChangeCB={handleChange}
                        serviceItems={serviceItems}
                        modalPreviewRequired={true}
                        templatePreviewForm={<TemplatePreviewForm page={page} data={sendTemplateData} />}
                        alertId={alertId}
                    />
                </div>
            ) : (
                <div>Loading...</div>
            )}
            
        </Paper>
    </React.Fragment>
    )
}
