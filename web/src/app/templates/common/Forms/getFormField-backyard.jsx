import React from 'react';
import { FormControl, TextField, FormHelperText, Select, Option, TextArea  } from '@backyard/react'
//import Plus from '@backyard/icons/Plus'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    ErrorBlock: {
        color: '#ff0000'
    },
    FormWrapper: {
        padding: 10,
    }
  }));

export function getFormField (formDetails, onChangeCB, errors, onAPICallCB) {
    const errorState = errors && errors[formDetails.name] ? 'error' : 'default'
    const dispLabel = formDetails.required ? formDetails.label+"*" : formDetails.label
    const disabledStatus = formDetails.disabled ? true : false
    const classes = useStyles();
    switch (formDetails.field) {
        case "TextField":
            return (
                <div className={classes.FormWrapper}>
                    <FormControl>
                        <TextField
                            label={dispLabel}
                            variant="outlined"
                            state={errorState}
                            onChange={(event) => onChangeCB(formDetails, formDetails.name, event.target.value)}
                            type={formDetails.field_type}
                            disabled={disabledStatus}
                            value={formDetails.preSelected}
                        />
                        {/*<IconButton>
                            <Plus />
                        </IconButton>*/}
                        {(errors && errors[formDetails.name]) && 
                            <FormHelperText>
                                <div className={classes.ErrorBlock}>{errors[formDetails.name]}</div>
                            </FormHelperText>
                        }
                    </FormControl>
                </div>
            )
        case "TextArea":
            return (
                <div className={classes.FormWrapper}>
                    <FormControl>
                        {/*<TextArea
                            label={dispLabel}
                            variant="outlined"
                            state={errorState}
                            onChange={(event) => onChangeCB(formDetails, formDetails.name, event.target.value)}
                            type={formDetails.field_type}
                            disabled={disabledStatus}
                            value={formDetails.preSelected}
                        />*/}
                        <TextArea 
                            label={dispLabel}
                            state={errorState}
                            onChange={(event) => onChangeCB(formDetails, formDetails.name, event.target.value)}
                            disabled={disabledStatus}
                        />
                        
                        {(errors && errors[formDetails.name]) && 
                            <FormHelperText>
                                <div className={classes.ErrorBlock}>{errors[formDetails.name]}</div>
                            </FormHelperText>
                        }
                    </FormControl>
                </div>
            )
        case "Select":
            return (
                <div className={classes.FormWrapper}>
                    <FormControl>
                        <Select 
                            label={dispLabel}
                            variant="outlined"
                            state={errorState}
                            onChange={(event) =>  onChangeCB(formDetails, formDetails.name, event.target.value) }
                            defaultValue={formDetails.preSelected}
                            onFocus={event => {
                                if(formDetails.isOptionsFromApi) {
                                    onAPICallCB(formDetails, formDetails.name)
                                }
                            }
                            }
                        >
                            <Option disabled value="">
                                Select an option...
                            </Option>
                            {formDetails.options.map((opt, key) => {
                                return (<Option value={opt.value} key={key}>{opt.label}</Option>)
                            })}
                        </Select>
                        {(errors && errors[formDetails.name]) && 
                            <FormHelperText>
                                <div className={classes.ErrorBlock}>{errors[formDetails.name]}</div>
                            </FormHelperText>
                        }
                    </FormControl>
                </div>
            )
        default:
            return null
    }
}