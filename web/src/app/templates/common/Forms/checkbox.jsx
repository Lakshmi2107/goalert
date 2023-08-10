import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { FormHelperText } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { makeStyles } from '@material-ui/core/styles';
import InfoTooltips from './infoTooltip'

const useStyles = makeStyles((theme) => ({
    checkGroup: {
        marginLeft: 10
    },
    ErrorBlock: {
      color: '#ff0000'
    },
    helperText: {
      margin: '0 !important'
    },
    FormWrapper: {
      padding: 10,
      display: 'flex'
    },
    FormControlStyle: {
        width: '60%'
    },
}));

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function PaaSCheckBox({formDetails, onChecked, originalData, errors}) {
  

    let objArr = {}
    formDetails.options.map((opt) => {
        //const checkStatus = (formDetails.preSelected.indexOf(opt.value) !== -1) ? true : false
        if(formDetails.preSelected)
        {
          Object.keys(formDetails.preSelected).map((opt) => {
            objArr[opt] = formDetails.preSelected[opt]
          })
          //objArr[opt.value] = checkStatus
        }
    })
  const [state, setState] = React.useState(objArr);

  const handleChange = (event) => {
      const updatedState = state
      updatedState[event.target.name] = event.target.checked
    onChecked(updatedState)
    setState(updatedState)
  };

  const classes = useStyles();


  return (
    <div>
      <div className={classes.FormWrapper}>
        <div className={classes.FormControlStyle}>
          <FormGroup row className={classes.checkGroup}>
            {formDetails.options.map((opt, key) => {
                return (
                <FormControlLabel
                  control={<GreenCheckbox checked={state[opt.value]} onChange={handleChange} name={opt.value} />}
                  label={opt.label}
                />)
            })}
          </FormGroup>
        </div>
        <InfoTooltips info={formDetails.info} originalData={originalData} />    
      </div>
      {(errors && errors[formDetails.name]) && 
        <FormHelperText className={classes.helperText}>
            <div className={classes.ErrorBlock}>{errors[formDetails.name]}</div>
        </FormHelperText>
      }
    </div>
  );
}