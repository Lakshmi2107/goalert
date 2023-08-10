import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import GetFormField from './getFormField'
import { Button, Link  } from '@material-ui/core';
import { Button as MuiBtn } from '@material-ui/core';
import { setStateObject, updateStateObject, validateForm } from './formValidation'
import { useSelector, useDispatch } from 'react-redux';
import { removePaasOptions, removeCheckAvailability } from '../../action/commonActions';
import { postActionStore, getActionStore } from '../../action/formActions'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import PreviewForm from './previewForm'
import { Grid } from '@material-ui/core';
import { CallMissedSharp } from '@material-ui/icons';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import SendIcon from '@material-ui/icons/Send';
import Tooltip from '@material-ui/core/Tooltip';
import { useHistory } from 'react-router-dom'
import FullScreenDialog from '../Modals/fullscreenDialog'

const useStyles = makeStyles((theme) => ({
    BtnBlock: {
        marginLeft: 10,
        display: 'inline'
    },
    FormTitle: {
        display: 'inline',
        fontSize: 25,
        marginBottom: 10,
        fontFamily: 'system-ui'
    },
    FormLink: {
        display: 'inline',
        fontSize: 12,
        marginLeft: 15
    },
    groupBox: {
      background: '#ebebeb',
      width: '96%',
      margin: '10px'
    },
    groupText: {
        background: '#92aec763',
        padding: 15
    },
    groupBottom: {
        borderBottom: '1px solid #fff',
        display: 'flex'
    },
    groupField: {
        width: '50%'
    },
    groupRadio: {
        width: '50%',
        marginLeft: 40,
        marginTop: 10
    },
    paper: {
        padding:10
    },
    sticky: {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '860px',
        padding: 10
    },
    /*button: {
        background: "#357466",
        '&:hover': {
            background: "#025b4c"
        }
    },*/
    button: {
        background: "#005c97",
        '&:hover': {
            background: "#004990"
        }
    },
    titleBlock: {
        //fontFamily: "'Roboto Condensed', sans-serif !important",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 25,
        padding: 10,
        borderBottom: '1px solid #4987aa47',
        //background: "#f48023",
        height: 50,
        marginTop: 10,
        marginBottom: 25
    },
    labelBlock: {
        //fontFamily: '"Gotham SSm A", "Gotham SSm B", sans-serif',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        textAlign: 'right',
        fontSize: 13,
        fontWeight: 'bold',
        margin: 'auto'
    },
    reqStyle: {
        color: '#cc2408',
        fontSize: 17
    },
    subHeading: {
        //fontFamily: '"Gotham SSm A", "Gotham SSm B", sans-serif',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 'bold',
        borderBottom: '1px solid #ebebeb',
        padding: '5px 7px',
        color: '#6a6c68bd',
        fontSize: 15
    },
    subHeadingLeft: {
        display: 'inline',
    },
    subHeadingRight: {
        display: 'flex',
        float: 'right',
        fontSize: 14,
        color: '#333',
        fontWeight: 'normal'
    },
  }));


const GenerateForm = ({
    originalFormData,
    formTitle,
    submitCB,
    submitBtnText,
    cancelUrl,
    cancelBtnText,
    tokenObj,
    page,
    platformKind,
    originalData,
    componentsList,
    currentStep,
    handleBackCB,
    handleChangeCB,
    serviceItems,
    modalPreviewRequired,
    templatePreviewForm,
    alertId
}) => {
    const classes = useStyles();
    const [onBoardInfo, setOnBoardInfo] = useState(setStateObject(originalFormData))
    //const [onBoardInfo, setOnBoardInfo] = useState({})
    const [formData, setFormData] = useState(originalFormData)
    const [value, setValue] = useState(0); // integer state
    const [isPreview, setIsPreview] = useState(false); // integer state
    const [submitBtnStatus, setSubmitBtnStatus] = useState(true) 
    const [isValueUpdated, setIsValueUpdated] = useState(false)

    const [dialogOpenStatus, setDialogOpenStatus] = useState(false)
    const [dialogContent, setDialogContent] = useState('')
    const [dialogTitle, setDialogTitle] = useState('')  
    const [previewOpenStatus, setPreviewOpenStatus] = useState(false)    

    const dispatch = useDispatch();
    const commonData = useSelector(state => state.common);
    const paasData = useSelector(state => state.paas);

    const history = useHistory()
    
    const [preselStatus, setPreselStatus] = useState(false)

    useEffect(() => {
        //if(!previewOpenStatus && (_.isEmpty(onBoardInfo) || alertId)) { //TLMT-5310 - issue in retain value 
        let openState = false
        openState = _.isEmpty(onBoardInfo) ? true : (!_.isEmpty(onBoardInfo) && alertId) ? true : false
        if(!previewOpenStatus && (openState || !preselStatus || commonData.paasOptions.length >0)) {
            setFormData(originalFormData)
            let updatedStateValue = setStateObject(originalFormData)
            originalFormData.map((opt) => {
                let rolesObj = []
                if(opt.field_type === 'group') {
                    opt.fields.map((fOpt) => {
                        let fieldObj = {}
                        fOpt.map((grpFieldObj) => {
                            //if(grpFieldObj.preSelected) {
                                updatedStateValue = {
                                    ...updatedStateValue,
                                    [grpFieldObj.name] : grpFieldObj.preSelected ? grpFieldObj.preSelected : ''
                                }
                            //}
                            fieldObj[grpFieldObj.name.split("_")[0]] = grpFieldObj.preSelected
                        })
                        rolesObj.push(fieldObj)
                    })
                    updatedStateValue = {
                        ...updatedStateValue,
                        [opt.name] : rolesObj
                    }
                } else {
                    if(opt.preSelected) {
                        let selectedValue = opt.preSelected 
                        if(opt.field === 'AutoComplete') {
                            const paasObj = _.find(commonData.paasOptions, (n) => { return n.name === opt.name})
                            if(paasObj) {
                                selectedValue = _.find(paasObj.options, (n) => { return n.label === opt.preSelected})
                            }
                        }
                        if(opt.field === 'AutoCompleteMultiple') {
                            let checkOptions = []
                            if(opt.name === 'support_group') {
                                checkOptions = serviceItems ? serviceItems : []
                            } else {
                                const paasObj = _.find(commonData.paasOptions, (n) => { return n.name === opt.name})
                                if(paasObj) {
                                    checkOptions = paasObj.options
                                }
                            }
                            
                            let seleArr = []
                            opt.preSelected.split(",").map((preObj) => {
                                const selObj = _.find(checkOptions, (n) => { return n.label === preObj})
                                if(selObj) {
                                    seleArr.push(selObj)
                                }
                            })
                            selectedValue=seleArr
                        }

                        updatedStateValue = {
                            ...updatedStateValue,
                            [opt.name] : selectedValue
                        }
                    }
                }
            }) 
            setOnBoardInfo(updatedStateValue)
            handleChangeCB(updatedStateValue) //TLMT-5394 fix
            setPreselStatus(true)
        } else if(!_.isEmpty(onBoardInfo)) {
            handleChangeCB(onBoardInfo) //TLMT-5394 fix
        } 
    },[originalFormData, commonData])
    

    // get CMDB component List
    if(!_.isEmpty(componentsList) || !_.isEmpty(tokenObj.globalObj)) {
        formData.map((opt) => {
            // get CMDB info
            if(opt.name === 'cmdb_id') {
                if(componentsList) {
                    let compOptionsList = []
                    componentsList.entitiesList.items.map((opt) => {
                        if(opt.kind === 'Component' && opt.metadata && opt.metadata.information && opt.metadata.information.CMDB) {
                            const compObj =  opt.metadata.information.application_name+' ('+opt.metadata.information.CMDB+")"
                            compOptionsList.push(compObj)
                        }
                    })
                    opt.options = compOptionsList
                }
            }

            // environments from global Obj
            if(opt.name === 'env' && tokenObj.globalObj) {
                const envObjArr = []
                tokenObj.globalObj[platformKind].env.map((opt) => {
                    const envObj = {
                        label: opt.toUpperCase(),
                        value: opt
                    }
                    envObjArr.push(envObj)
                })
                opt.options = envObjArr
            }

             //Service ingest check
             if(opt.name === 'serviceSizeIngest' && tokenObj.globalObj) {
                if(tokenObj.globalObj[platformKind].serviceSizeIngest) {
                    opt.display = 'block'
                }
            }
            
        })
    }
    
    const checkFormData = (formDetails, fieldValue = '') => {
        let updatedStateValue = JSON.parse(JSON.stringify(onBoardInfo));
        let newFormData = []
            formData.map((opt) => {
                //enbale Fields - make it visible
                const selectedOption = _.find(formDetails.options,(n) => {return (n.enableFields && n.enableFields.length > 0 && n.enableFields.indexOf(opt.name) !== -1) })
                if(selectedOption && selectedOption.enableFields && selectedOption.enableFields.indexOf(opt.name) !== -1) {
                    const checkFlag = formDetails.field === 'CheckBox' ? fieldValue[selectedOption.value] : selectedOption.value === fieldValue
                    opt.disabled = checkFlag ? false : true
                    opt.dependentField = checkFlag ? false : true
                    opt.required = checkFlag ? true : false
                    //opt.display = checkFlag ? 'block' : 'none'
                } 

                //disable Fields
                const disabledOption = _.find(formDetails.options,(n) => {return (n.disableFields && n.disableFields.length > 0 && n.disableFields.indexOf(opt.name) !== -1) })
                if(disabledOption && disabledOption.disableFields && disabledOption.disableFields.indexOf(opt.name) !== -1) {
                    opt.disabled = (disabledOption.value === fieldValue || fieldValue === '') ? true : false
                }

                //hide Fields
                const hideOption = _.find(formDetails.options,(n) => {return (n.hideFields && n.hideFields.length > 0 && n.hideFields.indexOf(opt.name) !== -1) })
                if(hideOption && hideOption.hideFields && hideOption.hideFields.indexOf(opt.name) !== -1) {
                    opt.display = (hideOption.value === fieldValue || fieldValue === '') ? 'none' : 'block'
                    opt.disabled = (hideOption.value === fieldValue || fieldValue === '') ? true : false
                }

                //Prefill fileds
                if(formDetails.name === 'application_id' && formDetails.prefillFields && formDetails.prefillFields.length > 0 && fieldValue) {
                    const appName = fieldValue.split(' (')[0]
                    const cmdbId = fieldValue.split('(')[1].split(')')[0]
                    const findObj = _.find(componentsList.entitiesList.items, (n) => { 
                        return (n.kind === 'Component' && n.metadata && n.metadata.information && n.metadata.information.CMDB === parseInt(cmdbId) && n.metadata.information.application_name === appName)}
                    )
                    formDetails.prefillFields.map((obj) => {
                        if(obj === opt.name) {
                            let prefillValue = ""
                            if(opt.name === 'applicationFullName' && findObj) {
                                prefillValue = findObj.metadata.information.application_name
                            }

                            if(opt.name === 'portfolio' && findObj) {
                                prefillValue = findObj.metadata.information.portfolio.key
                            }

                            if(opt.name === 'serviceTier' && findObj && findObj.metadata.information.service_tier) {
                                prefillValue = findObj.metadata.information.service_tier
                            }

                            if(opt.name === 'groupDL' && findObj && findObj.metadata.information.team_DL) {
                                prefillValue = findObj.metadata.information.team_DL
                            }
                            
                            opt.preSelected = prefillValue
                            updatedStateValue = {
                                ...updatedStateValue,
                                [opt.name]: prefillValue
                            }
                            opt.disabled = true
                        }
                    })
                }                
                newFormData.push(opt)
            })
            
            setFormData(newFormData)
            return updatedStateValue
    }

    const onChangeCB = (formDetails, fieldName, fieldValue) => {

        if(formDetails.checkAvailabilityUrl) {
            setSubmitBtnStatus(false)
        } else {
            setSubmitBtnStatus(true)
        }

       // if(formDetails.isEnalbeRequired && (formDetails.field === 'Select' || formDetails.field === 'Radio')) {
        const updatedStateValue = checkFormData(formDetails, fieldValue)
        //}

        const updatedOnBoardInfo = updateStateObject(formData, updatedStateValue, fieldName, fieldValue, formDetails)

        setOnBoardInfo(updatedOnBoardInfo)

        //Update parent state value
        handleChangeCB(updatedOnBoardInfo)
    }
    

    const onAPICallCB = (formDetails, fieldName) => {
        let updatedStateValue = onBoardInfo
        let readyApiCall = true
        let payload = {}
        let queryStr = ''
        if(formDetails.apiDependentFields && formDetails.apiDependentFields.length > 0) {
            formDetails.apiDependentFields.map((opt) => {
                if(onBoardInfo[opt] === '') {
                    readyApiCall = false
                    updatedStateValue = {
                        ...updatedStateValue,
                        errors: {
                            ...updatedStateValue.errors,
                            [opt]: opt+" Field Required"
                        }
                    }
                } else {
                    payload[opt] = onBoardInfo[opt]
                    queryStr += (queryStr === '') ? "?" : "&"
                    queryStr += opt+"="+onBoardInfo[opt]
                }

            })
            setOnBoardInfo(updatedStateValue)
        }
        
        if(readyApiCall && formDetails.apiUrl !== '') {
            const refFields = {
                name: formDetails.name
            }
            let cloneTokenObj = JSON.parse(JSON.stringify(tokenObj));
            if(formDetails.apiFromRoot) {
                cloneTokenObj.baseUrl = ''
            }
            /*if(formDetails.apiType === 'POST') {
                const onloadText = "get_options_"+page+"_"+platformKind
                dispatch(postActionStore(payload, formDetails.apiUrl, 'PAAS_OPTIONS', refFields, cloneTokenObj, onloadText))
            } else if(formDetails.apiType === 'GET') {*/
                const getApiUrl = formDetails.apiUrl+queryStr
                const onloadText = "get_options_"+page+"_"+platformKind
                //dispatch(getActionStore(getApiUrl, 'PAAS_OPTIONS', refFields, cloneTokenObj, onloadText))
                dispatch(getActionStore(formDetails.apiUrl, 'PAAS_OPTIONS', refFields, {}, ))
            //}
        }

    }

    const onCheckAvailabilityCB = (formDetails, fieldValue) => {
        const checkrefFields = {
            name: formDetails.name
        }
        //let checkName = tokenObj.globalObj[onBoardInfo.platformKind].prefix+"-"+fieldValue
        let checkName = fieldValue
        const getCheckAvailabilityUrl = formDetails.checkAvailabilityUrl+checkName
        const onloadAvailabilityText = "check_availabiklity_"+page+"_"+platformKind
        dispatch(getActionStore(getCheckAvailabilityUrl, 'CHECK_AVAILABILITY', checkrefFields, tokenObj, onloadAvailabilityText))
        setSubmitBtnStatus(true)
    }


    const handleSubmit = () => {
        const validationResult = validateForm(formData, onBoardInfo, tokenObj)
        setOnBoardInfo(validationResult.updatedStateValue)
        if(validationResult.status) {
            delete onBoardInfo.errors
            submitCB(onBoardInfo)
        }
    }

    const handlePreview = () => {
        const validationResult = validateForm(formData, onBoardInfo)
        setOnBoardInfo(validationResult.updatedStateValue)
        if(validationResult.status) {
            setIsPreview(true)
        }
    }

    const handlePreviewEdit = () => {
        setIsPreview(false)
    }

    const handleCancel = () => {
        cancelCB()
    }

    //useEffect(() => {
        if(window.location.search !== '' && page === 'platform' && !_.isEmpty(paasData.platformDetails) && !isValueUpdated) {
            
            //const updateId = parseInt(window.location.search.split("?")[1].split("=")[1])
            //const updateRow = _.find(paasData.adminPlatformsList, (n) => {return n.id === updateId})
            
            const updateRow = paasData.platformDetails

            if(updateRow) {
                let updatedStateValue = JSON.parse(JSON.stringify(onBoardInfo));
                updatedStateValue = {
                    ...updatedStateValue,
                    id: updateRow.id,
                    environment: updateRow.environment,
                    platformKind: updateRow.platformKind,
                    pipelineType: updateRow.pipelineType,
                    cloudProviderType: updateRow.cloudProviderType,
                    platformMetaDetails: JSON.stringify(updateRow.platformMetaDetails),
                    sizingMetaDetails: JSON.stringify(updateRow.clusterSizing),
                    errors: {
                        ...updatedStateValue.errors,
                    }
                }
                setOnBoardInfo(updatedStateValue)
                setIsValueUpdated(true)                
            }
            
        }
    //},[paasData.platformDetails])

    //let kindDisplayText = ''


   /* useEffect(() => {
        //setFormData(originalFormData)
        if(window.location.search === '') {
            let updatedStateValue = setStateObject(formData)
            formData.map((opt) => {
                
                if(opt.preSelected) {
                    updatedStateValue = {
                        ...updatedStateValue,
                        [opt.name] : opt.preSelected
                    }
                } else if(opt.profileSelected) {
                    let preSelected = ''
                    if(opt.name === 'techPOC') {
                    preSelected = tokenObj.profile[opt.profileSelected]
                    }
                    updatedStateValue = {
                        ...updatedStateValue,
                        [opt.name] : preSelected
                    }
                }

                
                //bring options from other source
                if(opt.options && opt.options.length === 0 && opt.optionsFrom) {
                    opt.options = getGroupOptions(opt.optionsFrom)
                }
                //end of bring options from other source

                if(opt.field_type === 'group') {

                    let groupStateArr = []
                    opt.fields.map((groupObj) => {
                        let groupStateObj = {}
                        groupObj.map((groupFieldObj) => {
                            updatedStateValue = {
                                ...updatedStateValue,
                                [groupFieldObj.name] : groupFieldObj.preSelected ? groupFieldObj.preSelected : ''
                            }

                            let fieldName = groupFieldObj.name.split("_")[0]
                            groupStateObj[fieldName] = groupFieldObj.preSelected ? groupFieldObj.preSelected : ''

                            //bring options from other source
                            if(groupFieldObj.options && groupFieldObj.options.length === 0 && groupFieldObj.optionsFrom) {
                                groupFieldObj.options = getGroupOptions(groupFieldObj.optionsFrom)
                            }
                            //end of bring options from other source

                        })
                        groupStateArr.push(groupStateObj)
                    })

                    updatedStateValue = {
                        ...updatedStateValue,
                        [opt.name] : groupStateArr
                    }
                }

                if(opt.isEnalbeRequired && (opt.field === 'Select' || opt.field === 'RadioButton' || opt.field === 'Radio')) {
                    checkFormData(opt, opt.preSelected)
                }
                
            })
            setOnBoardInfo(updatedStateValue)     
        }   
    }, []);
    */

    const getGroupOptions = (fieldName) => {
        let groupOptions = []
        /*const profile = {
            "sub":"ganesh.nanjundan@lowes.com",
            "uid":"3628646",
            "departmentNumber":"0808",
            "fullName":"Nanjundan, Ganesh",
            "groups":"cn=Pluralsight_IND2,ou=Groups,o=isd^cn=carbon_onprem_dbaas_admin_prd,ou=Groups,o=isd^cn=carbon_onprem_dbaas_read_prd,ou=Groups,o=isd^cn=carbon_onprem_dbaas_write_prd,ou=Groups,o=isd",
            "last_name":"Nanjundan",
            "first_name":"Ganesh",
            "job_title":"Lead Software Engineer",
            "lowesDeptName":"SSC-B IT  Enterprise Architecture Products",
            "email":"ganesh.nanjundan@lowes.com",
            "managerWorkforceID":"3586319"
        }
        const groupsList = profile.groups.split('^') */
        if(tokenObj.profile && tokenObj.profile.groups) {
            const groupsList = tokenObj.profile.groups.split('^')
            groupsList.map((gObj) => {
                gObj.split(",").map((cnObj) => {
                    if(cnObj.search('cn=') !== -1) {
                        const dispLDAPGroup = cnObj.split("=")[1]
                        if(tokenObj.globalObj.removeLDAPGroups.indexOf(dispLDAPGroup) === -1) {
                            groupOptions.push(dispLDAPGroup)
                        }
                    }
                })
            })
        }
        //const grpList = ['Pluralsight_IND2', 'carbon_onprem_dbaas_admin_prd', 'carbon_onprem_dbaas_read_prd', 'carbon_onprem_dbaas_write_prd']
        //return grpList
        return groupOptions
    }

    const kindText = (platformKind == 'postgres') ? "PostgreSQL" : (platformKind == 'mongodb') ? "MongoDB" : (platformKind == 'elasticsearch') ? "Elasticsearch" : (platformKind == 'minio') ? "MINIO" : platformKind

    let kindDisplayText = (platformKind !== '') ? " - "+kindText : ''

    const addNewGroupCB = (groupName) => () =>  {
        let newFormData = []
        let updatedStateValue = JSON.parse(JSON.stringify(onBoardInfo));
        formData.map((opt) => {
            let newOpt = JSON.parse(JSON.stringify(opt));
            if(newOpt.name === groupName) {
                let duplicateField = JSON.parse(JSON.stringify(newOpt.fields[0]));
                let updatedFields = []
                duplicateField.map((obj) => {
                    const newObj = obj
                    newObj.name = obj.name.split("_")[0]+"_"+parseInt(newOpt.fields.length + 1)
                    updatedFields.push(newObj)

                    //update state preselect value
                    updatedStateValue = {
                        ...updatedStateValue,
                        [obj.name] : obj.preSelected ? obj.preSelected : ''
                    }

                })
                opt = {
                    ...opt,
                    fields: [
                        ...opt.fields,
                        updatedFields
                    ]
                }
            }
            newFormData.push(opt)
        })
        setOnBoardInfo(updatedStateValue)
        setFormData(newFormData)
    }

    const removeGroupCB = (groupName, fieldIndex) => () => {
        let updatedStateValue = JSON.parse(JSON.stringify(onBoardInfo));
        let newFormData = []
        let rolesObj = []
        formData.map((opt) => {
            if(opt.name === groupName) { // check with group name
                let tempInfo = {}
                opt.fields.map((mObj, index) => { // fields loop
                    mObj.map((dobj) => {
                        tempInfo[dobj.name] = updatedStateValue[dobj.name]
                        delete updatedStateValue[dobj.name]
                    })
                })

                let newFields = []
                let count = 0

                opt.fields.map((mObj, index) => {
                    if(fieldIndex !== index) {
                        count++
                        let fieldObj = {}
                        mObj.map((obj) => {
                            //update state preselect value
                            let fieldName = obj.name.split("_")[0]
                            updatedStateValue = {
                                ...updatedStateValue,
                                [fieldName+"_"+count] : tempInfo[obj.name]
                            }
                            obj.name = fieldName+"_"+count

                            /*if(fieldName === 'team') {
                                fieldObj[fieldName] = {
                                    'teamName': updatedStateValue[fieldName+"_"+count]
                                }
                            } else {
                                fieldObj[fieldName] = updatedStateValue[fieldName+"_"+count]
                            }*/
                            fieldObj[fieldName] = updatedStateValue[fieldName+"_"+count]
                        })
                        rolesObj.push(fieldObj)
                        newFields.push(mObj)

                    }
                })
                opt.fields = newFields
                updatedStateValue = {
                    ...updatedStateValue,
                    [opt.name] : rolesObj
                }
            }

            newFormData.push(opt)
        })
        setFormData(newFormData)
        setOnBoardInfo(updatedStateValue)

        //Update parent state value
        handleChangeCB(updatedStateValue)
    }

    const previewText = isPreview ? ' - Preview' : ''
    let gridColSize = 12
    let previewColSize = 6
    if(originalData.isPreviewRequired && (originalData.isProgressRequired || originalData.isProvisioningInfoRequired)) {
        gridColSize = 6 
        previewColSize = 6
    } else if(!originalData.isPreviewRequired && (originalData.isProgressRequired || originalData.isProvisioningInfoRequired)) {
        gridColSize = 10
        previewColSize = 2
    } else if(originalData.isPreviewRequired && (!originalData.isProgressRequired || !originalData.isProvisioningInfoRequired)) {
        gridColSize = 6
        previewColSize = 6
    }

    //window.onscroll = function() {myFunction()};

    let header = document.getElementById("FormPreview");
    let sticky = 0
    if(header) {
        sticky = header.offsetTop;
    }

   /* function myFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add(classes.sticky);
    } else {
        header.classList.remove(classes.sticky);
    }
    }*/

    const HtmlTooltip = withStyles((theme) => ({
        tooltip: {
          maxWidth: 450,
          fontSize: 12
        },
      }))(Tooltip);
    
      const onboardText = "Follow here for registering your Application ID in LEC and for creating groups to control your provisioning."
      
      if(window.location.search !== '' && page === 'platform') {
        formTitle = "Update Platform"
      }
    
    const handleBack = () => {
        history.push(cancelUrl)
    }

    const handleModalPreview = () => {
        setDialogOpenStatus(true)
        setDialogContent(templatePreviewForm)
        setDialogTitle('Preview Template')
        setPreviewOpenStatus(true)
    }

    const closeDialogCB = () => {
        setDialogOpenStatus(false)
        setDialogContent('')
        setDialogTitle('')
    }

    const groupFormData = _.groupBy(formData, "subTitle")

    return (
            <React.Fragment>
                {/*<Grid container>
                    <Grid item md={12} xs={12} className={classes.titleBlock}>
                        {originalData.isProvisioningInfoRequired ? (
                            <div className={classes.FormTitle}>{formTitle}</div> 
                        ) : (
                            <div className={classes.FormTitle}>{formTitle} {kindDisplayText} {previewText}</div>
                        )}
                    </Grid>
                </Grid>*/}
                {Object.keys(groupFormData).map((groupObject, key) => {
                    return(<React.Fragment>
                        <div className={classes.subHeading}>
                            <div className={classes.subHeadingLeft}>{groupObject}</div>
                            {(key === 0) && 
                                <div className={classes.subHeadingRight}><span className={classes.reqStyle}>*</span> mandatory field</div>
                            }
                        </div>
                        {groupFormData[groupObject].map((opt, key) => {
                            let isGroup = false
                            let groupInfo = {
                                isGroup:false,
                                groupName:"",
                                addNewGroupCB:'', 
                                isGroupLastField: false,
                                removeGroupCB: '',
                                fieldIndex: '',
                                fieldsLength: 0
                            }
                            if(opt.display !== 'none') {
                                if(opt.field !== 'Group') {
                                    const reqText = opt.required ? '*' : ''
                                    return (
                                        <Grid container key={key}>
                                            <Grid item md="4" xs="4" className={classes.labelBlock}>
                                                {opt.label}
                                                <span className={classes.reqStyle}>{reqText}</span>
                                            </Grid>
                                            <Grid item md="8" xs="8">
                                                <GetFormField 
                                                    formDetails={opt}
                                                    onBoardInfo={onBoardInfo} 
                                                    onChangeCB={onChangeCB}
                                                    errors={onBoardInfo.errors} 
                                                    onAPICallCB={onAPICallCB}
                                                    groupInfo={groupInfo}
                                                    onCheckAvailabilityCB={onCheckAvailabilityCB}
                                                    originalData={originalData}
                                                    tokenObj={tokenObj}
                                                />
                                            </Grid>
                                        </Grid>
                                    )
                                } else if(!opt.dependentField) { 
                                    isGroup = true
                                    return(<div key={key} className={classes.groupBox}>
                                        <div className={classes.groupText}>{opt.label}</div>
                                        {opt.fields.map((mainObj, mindex) => { // Fields iteration
                                            let isGroupLastField = false
                                            let isLastFieldMain = opt.fields.length === mindex+1 ? true : false // check is it a last field
                                            return(<div key={mindex} className={classes.groupBottom}>
                                            {mainObj.map((obj, index) => { // Field objects iteration
                                                let isLastFieldObj = mainObj.length === index+1 ? true : false // check is it a last field object
                                                isGroupLastField = (isLastFieldMain && isLastFieldObj) ? true : false // check Group Last field
                                                groupInfo = {
                                                    isGroup:true,
                                                    groupName:opt.name,
                                                    addNewGroupCB:addNewGroupCB, 
                                                    isGroupLastField : isGroupLastField,
                                                    removeGroupCB:removeGroupCB,
                                                    fieldIndex: mindex,
                                                    fieldsLength: opt.fields.length,
                                                    requiredAddMore: opt.requiredAddMore
                                                }
                                                const grpStyle = (obj.field === 'RadioButton') ? classes.groupRadio : classes.groupField
                                                if(obj.display !== 'none') {
                                                    return (
                                                        <Grid container   key={index} className={grpStyle}>
                                                            <Grid item md="4" xs="4" className={classes.labelBlock}>{obj.label}</Grid>
                                                            <Grid item md="8" xs="8">
                                                                <GetFormField 
                                                                    formDetails={obj}
                                                                    onBoardInfo={onBoardInfo}
                                                                    onChangeCB={onChangeCB}
                                                                    errors={onBoardInfo.errors}
                                                                    onAPICallCB={onAPICallCB}
                                                                    groupInfo={groupInfo}
                                                                    onCheckAvailabilityCB={onCheckAvailabilityCB}
                                                                    originalData={originalData}
                                                                    tokenObj={tokenObj}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                }
                                            })}
                                            </div>)
                                        })
                                        }
                                        {/*<span onClick={addNewGroup(opt.name)}>Add one more</span>*/}
                                    </div>)
                                }
                            }
                        })}
                    </React.Fragment>)
                })}
                

                <Grid container>
                    <Grid item md={gridColSize} xs={gridColSize}>
                        
                        <Grid container>
                            <Grid item md="4" xs="4"></Grid>
                            <Grid item md="8" xs="8">
                                {originalData.isStepperRequired && currentStep > 0 ? (
                                    <div className={classes.BtnBlock}>
                                        <MuiBtn variant="outlined" color="primary"  onClick={handleBackCB} style={{margin: '5px'}} startIcon={<NavigateBeforeIcon />}>
                                            Back
                                        </MuiBtn>
                                    </div>
                                ) : (
                                    <div className={classes.BtnBlock}>
                                        {/*<Button color="primary"  to={_.isString(cancelUrl) ? cancelUrl : '#'} onClick={_.isFunction(cancelUrl) ?cancelUrl : ()=>{}} variant="contained" style={{margin: '5px'}} startIcon={<NavigateBeforeIcon />} className={classes.button}>
                                            Back
                                        </Button>*/}
                                        <MuiBtn variant="outlined" color="primary"  onClick={handleBack} style={{margin: '5px'}} startIcon={<NavigateBeforeIcon />}>
                                            Back
                                        </MuiBtn>
                                    </div>
                                )}

                                {modalPreviewRequired && 
                                    <div className={classes.BtnBlock}>
                                        <MuiBtn variant="contained"  onClick={handleModalPreview} style={{margin: '5px'}}>
                                            Preview
                                        </MuiBtn>
                                    </div>
                                }
                                
                                <div className={classes.BtnBlock}>
                                    <MuiBtn variant="contained" color="primary" onClick={handleSubmit} endIcon={<SendIcon />} className={classes.button} disabled={!submitBtnStatus}>
                                        {submitBtnText}
                                    </MuiBtn>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/*(originalData.isPreviewRequired || originalData.isProgressRequired || originalData.isProvisioningInfoRequired) && 
                        <Grid item md={previewColSize} xs={previewColSize} id="FormPreview">
                                <PreviewForm 
                                    onBoardInfo={onBoardInfo}
                                    formData={formData}
                                    originalData={originalData}
                                    platformKind={platformKind}
                                    tokenObj={tokenObj}
                                />
                        </Grid>
                    */}
                    <FullScreenDialog
                        dialogOpenStatus={dialogOpenStatus}
                        dialogContent={dialogContent}
                        dialogTitle={dialogTitle}
                        closeDialogCB={closeDialogCB}
                    />
                </Grid>
            </React.Fragment>
    )
}


export default GenerateForm;