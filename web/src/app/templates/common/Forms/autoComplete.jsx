/* eslint-disable no-use-before-define */
import React from 'react';
import { TextField, FormHelperText } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import InfoTooltips from './infoTooltip'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex'
    },
    autoStyle: {
        padding: 10
    },
    infoIconBox: {
        //marginTop: 12,
        //marginLeft: -10,
        marginLeft: 15,
    },
    autoSugestionBox: {
        width: '58%'
    },
    ErrorBlock: {
        color: '#ff0000',
         marginLeft: 10
    }

  }));

const PaaSAutoComplete = ({ dispLabel, formDetails, groupInfo, onSuggestionSelect, currentValue, errors, fieldWidth, originalData } ) => {
    const classes = useStyles();

    //const fieldWidth = formDetails.info ? '100%' : '97%'
    const text = <span><a target='_blank' href={formDetails.helperTextLink} style={{textDecoration: 'underline'}}>{formDetails.helperText}</a></span>
    let noOptionsText = 'No Optoin'
    return (
        <div className={classes.root}>
            <div className={classes.autoSugestionBox}>
                <Autocomplete
                    id="combo-box-demo"
                    options={formDetails.options}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} label={dispLabel} variant="outlined" value={currentValue} helperText={text} />}
                    value={currentValue}
                    onChange={(event, newValue) => {
                        onSuggestionSelect(newValue)
                    }}
                    className={classes.autoStyle}
                    style= {{width: fieldWidth }}
                    noOptionsText={noOptionsText}
                />
                {(errors && errors[formDetails.name]) && 
                    <FormHelperText>
                        <div className={classes.ErrorBlock}>{errors[formDetails.name]}</div>
                    </FormHelperText>
                }
            </div>
            <div className={classes.infoIconBox}>
                <InfoTooltips info={formDetails.info} originalData={originalData} />
            </div>

            {(groupInfo.isGroup && groupInfo.isGroupLastField) &&
            <AddCircleOutlineIcon mode="Radio" className={classes.addPlusBtn} onClick={groupInfo.addNewGroupCB(groupInfo.groupName)} />
            }
        </div>
    );
}

export default PaaSAutoComplete