import React, { useState } from 'react'
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
//import { useHistory } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { FormControl, FormHelperText, Select, MenuItem, InputLabel, ListSubheader, TextField, Button } from '@mui/material';
import { convertDBDate, currentDateTimeStamp } from '../../common/Utils'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    searchBlock: {
        margin: 5
    },
    formControl: {
        margin: 5
    },
    textField: {
        width: '33%',
        margin: 5
    },
    button: {
        marginTop: 14,
        marginLeft: 10
    },
    ErrorBlock: {
        color: '#ff0000'
    },
    helperText: {
        margin: '0 !important'
    },
  }));

export default function AlertSearch({ alertDetails, alertSearchCB, resetSearchCB}) {
    //const history = useHistory()    
    const classes = useStyles();
    const defaultPeriod = '1'
    const [values, setValues] = useState({
        subject: '',
        period: defaultPeriod,
        fromDate: '',
        toDate: '',
        includeSystemAlerts: false,
        errors: {}
      }); 

    const handleChange = (prop) => (event) => {
        const currentValue = event.target.value 
        const newValues = { 
            ...values, 
            [prop]: currentValue
        }
        setValues(newValues);
        if(prop === 'period' && currentValue !== 'dateRange') {
            alertSearchCB(newValues)
        } else if(prop === 'subject' && currentValue.length > 2) {
            alertSearchCB(newValues)
        } else if(prop === 'subject' && newValues.period !== defaultPeriod) {
            alertSearchCB(newValues)
        }else if(newValues.period === defaultPeriod && newValues.subject === '') {
            resetSearchCB()
        }
    };
    
    const shrinkObj = {
        shrink: true,
        padding: '15px 10px !important'
    }
    const fieldWidth = '40%'

    const options = [{
        label: "Past 24 Hours",
        value: '1'
    },{
        label: "Past 7 Days",
        value: '7'
    },{
        label: "Past 30 Days",
        value: '30'
    },{
        label: "Past 60 Days",
        value: '60'
    },{
        label: "Past 90 Days",
        value: '90'
    },{
        label: "Date Range",
        value: 'dateRange'
    }]

    const getFromDate = (days) => {
        return  convertDBDate(new Date(new Date().setDate(new Date().getDate() - days)))
    }

    const validateForm = () => {
        let retValue = true
        if(values.period === 'dateRange') {
            let updatedValues = JSON.parse(JSON.stringify(values));
            if(!updatedValues.fromDate) {
                updatedValues.errors.fromDate = "Please select from date"
                retValue = false
            } else {
                updatedValues.errors.fromDate = ""
            }
            if(!updatedValues.toDate) {
                updatedValues.errors.toDate = "Please select to date"
                retValue = false
            } else if(updatedValues.fromDate > updatedValues.toDate) {
                updatedValues.errors.toDate = "To date should be greater than From date" 
                retValue = false
            } else {
                updatedValues.errors.toDate = ""
            }
            setValues(updatedValues)
        }
        return retValue
    }

    const handleApply = () => {
        if(validateForm()) {
            alertSearchCB(values)
        }
    }

    const handleReset = () => {
        setValues({
            subject: '',
            period: defaultPeriod,
            fromDate: '',
            toDate: '',
            includeSystemAlerts: false,
            errors: {}
          })
          resetSearchCB()
    }
  
  return (
    <React.Fragment>
       <div className={classes.searchBlock}>
        <TextField
            label="Search message subject"
            variant="outlined"
            onChange={handleChange('subject')}
            type="text"
            value={values.subject}
            //style= {{width: fieldWidth, padding: '15px 10px !important' }}
            placeholder="Search message subject"
            InputLabelProps={shrinkObj}
            InputProps={{
                startAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
            }}
            className={classes.textField}
        />
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Date Selection</InputLabel>
            <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={values.period}
            onChange={handleChange('period')}
            label="Date selection"
            style= {{width: '243px' }}
            InputProps={{
                width: 220,
                padding: '15px 10px !important'
            }}
            >
            {options.map((opt, key) => {
                return (<ListSubheader value={opt.value} key={key}>{opt.label}</ListSubheader>)
            })}
            </Select>
        </FormControl>
        {values.period === 'dateRange' && 
            <React.Fragment>
                <TextField
                    id="datetime-local"
                    label="From Date"
                    type="datetime-local"
                    defaultValue=""
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="From Date"
                    onChange={handleChange('fromDate')}
                    inputProps={{
                        max: currentDateTimeStamp()
                    }}
                    error = {(values.errors && values.errors.fromDate)}
                    helperText = {values.errors.fromDate ? values.errors.fromDate : ''}
                />
                <TextField
                    id="datetime-local1"
                    label="To Date"
                    type="datetime-local"
                    defaultValue=""
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="To Date"
                    onChange={handleChange('toDate')}
                    inputProps={{
                        max: currentDateTimeStamp()
                    }}
                    error = {(values.errors && values.errors.toDate)}
                    helperText = {values.errors.toDate ? values.errors.toDate : ''}
                />
            </React.Fragment>
        }
        {values.period === 'dateRange' && 
            <Button variant="contained" color="primary" onClick={handleApply} className={classes.button}>
                Apply
            </Button>
        }
        {(values.subject !== '' || values.period !== defaultPeriod) &&
            <Button variant="outlined" color="primary" onClick={handleReset} className={classes.button}>
                Reset
            </Button>
        }           
       </div>
    </React.Fragment>
  )
}
