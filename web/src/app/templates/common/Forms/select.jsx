import React from 'react';
//import { FormControl, TextField, FormHelperText, TextArea  } from '@backyard/react'
import { FormControl, FormHelperText, Select, MenuItem, InputLabel, ListSubheader, TextField } from '@material-ui/core';
import InfoTooltips from './infoTooltip'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    ErrorBlock: {
        color: '#ff0000',
        marginLeft: 10,
    },
    FormWrapper: {
        padding: 10,
        display: 'flex'
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
    formControl: {
        //margin: theme.spacing(1),
        minWidth: 120,
        width: '60%'
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
      input: {
          padding: '15px 10px !important'
      }
  }));

 const PaaSSelect = ({ dispLabel, errorState, formDetails, disabledStatus, currentValue, onChangeCB, errors, onAPICallCB, groupInfo, fieldWidth, originalData }) => {
 const text = <span><a target='_blank' href={formDetails.helperTextLink} style={{textDecoration: 'underline'}}>{formDetails.helperText}</a></span>
 //const fieldWidth = formDetails.info ? '100%' : '94%'
 const classes = useStyles();
    return (
        <div>
            <div className={classes.FormWrapper}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">{dispLabel}</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={currentValue}
                    onChange={(event) =>  onChangeCB(event.target.value) }
                    disabled={disabledStatus}
                    label={dispLabel}
                    onFocus={event => {
                        if(formDetails.isOptionsFromApi) {
                            //onAPICallCB(formDetails, formDetails.name)
                        }
                        }
                    }
                    style= {{width: fieldWidth }}
                    helperText={text}
                    InputProps={{
                        padding: '15px 10px !important'
                    }}
                    >
                    <MenuItem disabled value="">
                        Select an option...
                    </MenuItem>
                        {formDetails.options.map((opt, key) => {
                            if(opt.readable) {
                                return (<ListSubheader value={opt.value} key={key}>{opt.label}</ListSubheader>)
                            } else {
                                return (<MenuItem value={opt.value} key={key}>{opt.label}</MenuItem>)
                            }
                        })}
                    </Select>
                </FormControl>
                <InfoTooltips info={formDetails.info} originalData={originalData} />
            </div>
            {(errors && errors[formDetails.name]) && 
                <FormHelperText>
                    <div className={classes.ErrorBlock}>{errors[formDetails.name]}</div>
                </FormHelperText>
            }

            {(groupInfo.isGroup && groupInfo.fieldsLength > 1 && formDetails.groupLastField) &&
            <Tooltip title='Remove group permission' classes={{tooltip: classes.tooltip}}>
                <HighlightOffIcon mode="Radio" className={classes.removeBtn} onClick={groupInfo.removeGroupCB(groupInfo.groupName, groupInfo.fieldIndex)} />
            </Tooltip>
            }

            {(groupInfo.isGroup && groupInfo.isGroupLastField && groupInfo.requiredAddMore) &&
            <AddCircleOutlineIcon mode="Radio" className={classes.addPlusBtn} onClick={groupInfo.addNewGroupCB(groupInfo.groupName)} />
            }
        </div>
    )
}

export default PaaSSelect;