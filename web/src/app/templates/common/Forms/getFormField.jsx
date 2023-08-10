import React from 'react';
//import { FormControl, TextField, FormHelperText, TextArea  } from '@backyard/react'
import { FormControl, FormHelperText, Select, MenuItem, InputLabel, ListSubheader, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RadioButtons from './radio'
import InfoTooltips from './infoTooltip'
import PaaSTextField from './textField'
import PaaSAutoComplete from './autoComplete'
import PaaSSelect from './select'
import MultipleSelect from './selectMultiple'
import PaaSButtonGroup from './buttonGroup'
import PaaSCheckBox from './checkbox'
import PaaSAccordion from '../PaaSAccordion'
import AutoCompleteMultiple from './autoCompleteMultiple'
import PaaSTextArea from './textArea'
//import ReactJson from 'react-json-view'
//import Plus from '@backyard/icons/Plus'
//import { SelectComponent as Select } from '@backstage/core-components';



const useStyles = makeStyles((theme) => ({
    formControl: {
      //margin: theme.spacing(1),
      minWidth: 120,
      width: '100%'
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const GetFormField  = ({ formDetails, onBoardInfo, onChangeCB, errors, onAPICallCB, groupInfo, onCheckAvailabilityCB, originalData, tokenObj } ) => {    
    const classes = useStyles();
    const errorState = errors && errors[formDetails.name] ? 'error' : 'default'
    const dispLabel = formDetails.required ? formDetails.label+"*" : formDetails.label
    const disabledStatus = formDetails.disabled ? true : false
    const currentValue = onBoardInfo[formDetails.name]
    const FormCB = (fieldValue) => {
        onChangeCB(formDetails, formDetails.name, fieldValue)
    }
    //const fieldWidth = formDetails.info ? '100%' : originalData.isPreviewRequired ? '94%' : '97%'
    const fieldWidth = originalData.isPreviewRequired ? '94%' : '100%'

    let returnFormField = <div></div>

    if(!formDetails.dependentField) {
        if (formDetails.field === "TextField") {
                return (<PaaSTextField
                        dispLabel = {dispLabel}
                        errorState = {errorState}
                        onTextChange = {FormCB}
                        disabledStatus = {disabledStatus}
                        currentValue = {currentValue}
                        errors = {errors}
                        formDetails = {formDetails}
                        groupInfo={groupInfo}
                        onAPICallCB= {onAPICallCB}
                        onCheckAvailabilityCB = {onCheckAvailabilityCB}
                        fieldWidth={fieldWidth}
                        originalData={originalData}
                        rowsMax={1}
                    />)
        }
        if (formDetails.field === "TextArea") {
            const textAreaFieldWidth = originalData.isPreviewRequired ? '94%' : '98%'
            let showAccordin = false
            let accordinContent = ''
            if(formDetails.validation === 'jsonSchema') {
                showAccordin = true
                if(tokenObj.globalObj && tokenObj.globalObj[onBoardInfo[formDetails.schemaField]]) {
                    const dispJson = tokenObj.globalObj[onBoardInfo[formDetails.schemaField]].jsonSchema[formDetails.name]
                    //accordinContent = JSON.stringify(accordinContent, undefined, 4);
                    //accordinContent = <ReactJson src={dispJson} />
                    accordinContent = <div>{dispJson}</div>
                }
            }
            return (
                <React.Fragment>
                {showAccordin &&
                    <PaaSAccordion
                        title ={formDetails.label+" JSON Schema"}
                        content = {accordinContent}
                        expandFlag = {false}
                    />
                }
                <PaaSTextArea 
                    dispLabel = {dispLabel}
                    errorState = {errorState}
                    onTextChange = {FormCB}
                    disabledStatus = {disabledStatus}
                    currentValue = {currentValue}
                    errors = {errors}
                    formDetails = {formDetails}
                    groupInfo={groupInfo}
                    onAPICallCB= {onAPICallCB}
                    onCheckAvailabilityCB = {onCheckAvailabilityCB}
                    fieldWidth={textAreaFieldWidth}
                    originalData={originalData}
                    rowsMax={formDetails.maxRows}
                />
                {/*<PaaSTextField
                    dispLabel = {dispLabel}
                    errorState = {errorState}
                    onTextChange = {FormCB}
                    disabledStatus = {disabledStatus}
                    currentValue = {currentValue}
                    errors = {errors}
                    formDetails = {formDetails}
                    groupInfo={groupInfo}
                    onAPICallCB= {onAPICallCB}
                    onCheckAvailabilityCB = {onCheckAvailabilityCB}
                    fieldWidth={fieldWidth}
                    originalData={originalData}
                    rowsMax={formDetails.maxRows}
            />*/}
            </React.Fragment>
            )
            }
            if (formDetails.field === "Select") {
                return (<PaaSSelect
                    dispLabel = {dispLabel}
                    errorState = {errorState}
                    onChangeCB = {FormCB}
                    disabledStatus = {disabledStatus}
                    currentValue = {currentValue}
                    errors = {errors}
                    formDetails = {formDetails}
                    onAPICallCB= {onAPICallCB}
                    groupInfo={groupInfo}
                    fieldWidth={fieldWidth}
                    originalData={originalData}
                />)
            }
            if (formDetails.field === "MultipleSelect") {
                return (<MultipleSelect
                    dispLabel = {dispLabel}
                    errorState = {errorState}
                    onChangeCB = {FormCB}
                    disabledStatus = {disabledStatus}
                    currentValue = {currentValue}
                    errors = {errors}
                    formDetails = {formDetails}
                    onAPICallCB= {onAPICallCB}
                    groupInfo={groupInfo}
                    fieldWidth={fieldWidth}
                    originalData={originalData}
                />)
            }
            if (formDetails.field === "RadioButton") {
                return (<React.Fragment>
                     {/*<RadioButtons 
                            formDetails={formDetails} 
                            selectedRadio={currentValue} 
                            onRadioSelect = {FormCB}
                            groupInfo={groupInfo}
                     />*/}
                        <PaaSButtonGroup 
                            formDetails={formDetails} 
                            selectedRadio={currentValue} 
                            onRadioSelect = {FormCB}
                            groupInfo={groupInfo}
                            fieldWidth={fieldWidth}
                            originalData={originalData}
                        />
                        </React.Fragment>
                        )
            }
            if (formDetails.field === "Radio") {
                return (<React.Fragment>
                        <RadioButtons 
                            formDetails={formDetails} 
                            currentValue={currentValue} 
                            onRadioSelect = {FormCB}
                            groupInfo={groupInfo}
                        />
                    </React.Fragment>
                )
            }
            if(formDetails.field === "AutoComplete") {
                return (
                    <PaaSAutoComplete 
                        dispLabel = {dispLabel}
                        formDetails={formDetails} 
                        groupInfo={groupInfo}
                        onSuggestionSelect = {FormCB}
                        currentValue={currentValue}
                        errors = {errors}
                        fieldWidth={fieldWidth}
                        originalData={originalData}
                    />
                )
            }
            if(formDetails.field === "AutoCompleteMultiple") {
                return (
                    <AutoCompleteMultiple 
                        dispLabel = {dispLabel}
                        formDetails={formDetails} 
                        groupInfo={groupInfo}
                        onSuggestionSelect = {FormCB}
                        currentValue={currentValue}
                        errors = {errors}
                        fieldWidth={fieldWidth}
                        originalData={originalData}
                    />
                )
            }
            
            if(formDetails.field === 'CheckBox') {
                return (
                    <PaaSCheckBox 
                        formDetails={formDetails} 
                        onChecked = {FormCB} 
                        originalData={originalData}
                        errors = {errors}
                    />
                )
            }
        }
    return <div></div>
}

export default GetFormField