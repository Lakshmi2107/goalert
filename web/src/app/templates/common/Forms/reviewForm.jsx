import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import GetFormField from './getFormField'
import { Button, Link  } from '@backstage/core-components';
import { Button as MuiBtn, Collapse } from '@material-ui/core';
import { setStateObject, updateStateObject, validateForm } from './formValidation'
import { useSelector, useDispatch } from 'react-redux';
import { removePaasOptions, removeCheckAvailability } from '../../../action/commonActions';
import { postActionStore, getActionStore } from '../../../action/formActions'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import PreviewForm from './previewForm'
import { Grid } from '@material-ui/core';
import { Paper } from '@material-ui/core'
import { CallMissedSharp } from '@material-ui/icons';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import SendIcon from '@material-ui/icons/Send';
import { constants } from '../Utils/constants'
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles((theme) => ({
    BtnBlock: {
        marginLeft: 10,
        display: 'inline'
    },
    button: {
        background: "#005c97",
        '&:hover': {
            background: "#004990"
        }
    },
    titleBlock: {
        fontFamily: "'Roboto Condensed', sans-serif !important",
        fontSize: 25,
        padding: 10,
        background: "#ebebeb"
    },
    detailsBlock: {
        padding: 10
    }
  }));


const ReviewForm = ({
    submitCB,
    submitBtnText,
    cancelUrl,
    cancelBtnText,
    originalData,
    currentStep,
    handleBackCB,
    payloadData,
    mftData
}) => {
    const classes = useStyles();
    return (
            <React.Fragment>
                <Grid container>
                    <Grid item md={12} xs={12}>
                        <Paper className={classes.paper}>
                            <div>
                                {originalData.steps.map((stepObj, key) => {
                                    return (
                                        <React.Fragment>
                                            <div key={key} className={classes.titleBlock}>{stepObj.name}</div>
                                            <div className={classes.detailsBlock}>
                                                {stepObj.formFields.map((fieldObj, index) => {
                                                    let dispField = ''
                                                    if(fieldObj.field === 'CheckBox') {
                                                        dispField = Object.keys(payloadData[fieldObj.name])
                                                    } else {
                                                        if(fieldObj.name === 's_endpointId' || fieldObj.name === 'd_endpointId') {
                                                            const endpointObj = mftData.transfersOptions.transferEndpoints.find((n) => { return n.endpointId === payloadData[fieldObj.name]})
                                                            if(endpointObj)
                                                                dispField = endpointObj.endpointName
                                                        } else if(fieldObj.name === 's_userId' || fieldObj.name === 'd_userId') {
                                                            const userObj = mftData.transfersOptions.transferUsers.find((n) => { return n.userId === payloadData[fieldObj.name]})
                                                            if(userObj)
                                                                dispField = userObj.userName
                                                        } else if(fieldObj.name === 's_authKey' || fieldObj.name === 'd_authKey') {
                                                            const keyObj = mftData.transfersOptions.transferKeys.find((n) => { return n.keyId === payloadData[fieldObj.name]})
                                                            if(keyObj)
                                                                dispField = keyObj.keyName
                                                        } else if(fieldObj.name === 'encryptCertId') {
                                                            const keyObj = mftData.transfersOptions.transferCertificates.find((n) => { return n.certId === payloadData[fieldObj.name]})
                                                            if(keyObj)
                                                                dispField = keyObj.certAlias
                                                        } else {
                                                            dispField = payloadData[fieldObj.name]
                                                        }
                                                    }
                                                    dispField = (fieldObj.field_type === 'password') ? "*****" : dispField
                                                    if(!fieldObj.disabled) {
                                                        return (<div key={index}><b>{fieldObj.label} :</b> {dispField}</div>)
                                                    }
                                                })}
                                            </div>
                                        </React.Fragment>
                                    )
                                })}
                                {originalData.isStepperRequired && currentStep > 0 ? (
                                    <div className={classes.BtnBlock}>
                                        <MuiBtn variant="contained" color="primary"  onClick={handleBackCB} style={{margin: '5px'}} startIcon={<NavigateBeforeIcon />} className={classes.button}>
                                            Back
                                        </MuiBtn>
                                    </div>
                                ) : (
                                    <div className={classes.BtnBlock}>
                                        <Button color="primary"  to={_.isString(cancelUrl) ? cancelUrl : '#'} onClick={_.isFunction(cancelUrl) ?cancelUrl : ()=>{}} variant="contained" style={{margin: '5px'}} startIcon={<NavigateBeforeIcon />} className={classes.button}>
                                            Back
                                        </Button>
                                    </div>
                                )}
                                
                                <div className={classes.BtnBlock}>
                                    <MuiBtn variant="contained" color="primary" onClick={submitCB} endIcon={<SendIcon />} className={classes.button}>
                                        {submitBtnText}
                                    </MuiBtn>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                   
                </Grid>

                
            </React.Fragment>
    )
}


export default ReviewForm;