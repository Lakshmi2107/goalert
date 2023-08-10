/* eslint-disable no-use-before-define */
import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormHelperText } from '@material-ui/core';
import InfoTooltips from './infoTooltip'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex'
    },
    FormWrapper: {
        padding: 10,
        display: 'flex'
    },
    autoStyle: {
        padding: 10
    },
    infoIconBox: {
        marginTop: 12,
        marginLeft: -10,
    },
    autoSugestionBox: {
        width: '60%'
    },
    ErrorBlock: {
        color: '#ff0000',
        marginLeft: 10
    }
}));

export default function AutoCompleteMultiple({ dispLabel, formDetails, groupInfo, onSuggestionSelect, currentValue, errors, fieldWidth, originalData }) {
  const classes = useStyles();
  const curObj = (typeof(currentValue) === 'object') ? currentValue : []
  return (
    <div className={classes.FormWrapper}>
        <div className={classes.autoSugestionBox}>
            <Autocomplete
                multiple
                id="tags-outlined"
                options={formDetails.options}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={dispLabel}
                    value={curObj}
                />
                )}
                value={curObj}
                onChange={(event, newValue) => {
                    /*let updatedList = []
                    newValue.map((opt) => {
                        updatedList.push(opt.value)
                    })*/
                    onSuggestionSelect(newValue)
                }}
                style= {{width: fieldWidth }}
            />
            {(errors && errors[formDetails.name]) && 
                <FormHelperText>
                    <div className={classes.ErrorBlock}>{errors[formDetails.name]}</div>
                </FormHelperText>
            }
        </div>
            <InfoTooltips info={formDetails.info} originalData={originalData} />

            {(groupInfo.isGroup && groupInfo.isGroupLastField) &&
                <AddCircleOutlineIcon mode="Radio" className={classes.addPlusBtn} onClick={groupInfo.addNewGroupCB(groupInfo.groupName)} />
            }
    </div>
  );
}