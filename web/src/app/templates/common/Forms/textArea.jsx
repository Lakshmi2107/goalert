import React, { useState, useEffect } from 'react';
//import { FormControl, TextField, FormHelperText, TextArea  } from '@backyard/react'
import { FormHelperText } from '@material-ui/core';
import InfoTooltips from './infoTooltip'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { makeStyles } from '@material-ui/core/styles';
import { ContactMail } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles((theme) => ({
    ErrorBlock: {
        color: '#ff0000'
    },
    FormWrapper: {
        padding: 10,
        display: 'flex'
    },
    FormControlStyle: {
        width: '60%'
    },
    radioBlock: {
        display: 'flex',
        marginTop: 5,
        marginBotom: 5
    },
    marginTop10: {
        marginTop: "-10px"
    },
    addPlusBtn: {
      textAlign: 'right',
      marginTop: 2,
      marginLeft: 30,
      color: 'green',
      fontSize: 35,
      cursor: 'pointer'
    },
    removeBtn : {
        textAlign: 'right',
        marginTop: 2,
        marginLeft: 30,
        color: 'red',
        fontSize: 35,
        cursor: 'pointer'
    },
    helperText: {
        margin: '0 !important'
    },
  }));

 const PaaSTextArea = ({ dispLabel, errorState, formDetails, disabledStatus, currentValue, onTextChange, errors, groupInfo, onCheckAvailabilityCB, fieldWidth, originalData, rowsMax }) => {
 const text = <span><a target='_blank' href={formDetails.helperTextLink} style={{textDecoration: 'underline'}}>{formDetails.helperText}</a></span>
 //const fieldWidth = formDetails.info ? '100%' : '94%'
 const classes = useStyles();
 const [dispData, setDispData] = useState('')
 const [updatedStatus, setUpdatedStatus] = useState(false)

 const changeToJSONFormat = (cVal) => {
    try{
        const parseJSON = JSON.parse(cVal)
        const dispDataJson = JSON.stringify(parseJSON, undefined, 4);
        setDispData(dispDataJson)
    } catch {
        cVal ? setDispData(cVal) : ''
    }
 }

 useEffect(() => {
    setDispData(currentValue)
    if(currentValue) {
        if(parseInt(rowsMax) > 1 && !updatedStatus) {
            changeToJSONFormat(currentValue)
            setUpdatedStatus(true)
        } 
    } 
 },[currentValue]) 

    let shrinkObj = ''
    if(formDetails.field_type === 'datetime-local') {
        shrinkObj = {
            shrink: true,
            padding: '15px 10px !important'
        }
    } 

  return (
      <div className={classes.FormWrapper}>
        <div className={classes.FormControlStyle}>
            <TextareaAutosize 
                minRows={rowsMax} 
                maxRows={20}
                placeholder={dispLabel}
                label={dispLabel}
                state={errorState}
                onChange={(event) => {
                    onTextChange(event.target.value)
                    setDispData(event.target.value)
                }
                }
                disabled={disabledStatus}
                value={dispData}
                style= {{width: fieldWidth, fontFamily: 'Roboto, Helvetica, Arial, sans-serif', fontSize: 15, color: '#333', padding: 4, borderColor: '#c4c4c4' }}
                helperText={text}
                onBlur={(event) => {
                    if(formDetails.checkAvailabilityUrl) {
                        onCheckAvailabilityCB(formDetails, event.target.value)
                    }
                    if(formDetails.validation === 'jsonSchema') {
                        changeToJSONFormat(event.target.value)
                    }
                }}
            />            
            
            {(errors && errors[formDetails.name]) && 
                <FormHelperText className={classes.helperText}>
                    <div className={classes.ErrorBlock}>{errors[formDetails.name]}</div>
                </FormHelperText>
            }
        </div>
        <InfoTooltips info={formDetails.info} originalData={originalData} />
        
        {(groupInfo.isGroup && groupInfo.fieldsLength > 1 && formDetails.groupLastField) &&
          <Tooltip title='Remove group permission' classes={{tooltip: classes.tooltip}}>
            <HighlightOffIcon mode="Radio" className={classes.removeBtn} onClick={groupInfo.removeGroupCB(groupInfo.groupName, groupInfo.fieldIndex)} />
          </Tooltip>
        }

        {(groupInfo.isGroup && groupInfo.isGroupLastField && groupInfo.requiredAddMore) &&
          <AddCircleOutlineIcon mode="Radio" className={classes.addPlusBtn} onClick={groupInfo.addNewGroupCB(groupInfo.groupName)} />
        }
    </div>
  );
}

export default PaaSTextArea;
