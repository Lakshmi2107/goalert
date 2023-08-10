import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { SpaceBarRounded } from '@material-ui/icons';
import InfoTooltips from './infoTooltip'
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Tooltip from '@material-ui/core/Tooltip';

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  
  checked: {},
})((props) => <Radio color="default" {...props} />);


const useStyles = makeStyles((theme) => ({
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
    infoBtn: {
      width: 30
    },
    tooltip: {
      fontSize: 13,
      maxWidth: 200
    }
  }));

 const RadioButtons = ({ formDetails, currentValue, onRadioSelect, groupInfo, originalData }) => {
  const [selectedValue, setSelectedValue] = React.useState(false);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onRadioSelect(event.target.value)
  };

  const classes = useStyles();

  useEffect(() => {
    setSelectedValue(currentValue)
 },[currentValue]) 

  return (
    <div className={classes.radioBlock}>
      {formDetails.label} : 
      {formDetails.options.map((opt, key) => {
          const dispSelected = selectedValue === opt.value ? true : false
          return (
            <span key={key}>
                <GreenRadio
                    checked={dispSelected}
                    onChange={handleChange}
                    value={opt.value}
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'C' }}
                />
                {opt.label}
                
            </span>
          )
      })}
      
      {formDetails.info && 
            <InfoTooltips info={formDetails.info} mode="Radio"className={classes.infoBtn} originalData={originalData}  />
        }

      {(groupInfo.isGroup && groupInfo.fieldsLength > 1) &&
          <Tooltip title='Remove group permission' classes={{tooltip: classes.tooltip}}>
            <HighlightOffIcon mode="Radio" className={classes.removeBtn} onClick={groupInfo.removeGroupCB(groupInfo.groupName, groupInfo.fieldIndex)} />
          </Tooltip>
        }

        {(groupInfo.isGroup && groupInfo.isGroupLastField) &&
         <Tooltip title='Add new group permission' classes={{tooltip: classes.tooltip}}>
            <AddCircleOutlineIcon mode="Radio" className={classes.addPlusBtn} onClick={groupInfo.addNewGroupCB(groupInfo.groupName)} />
          </Tooltip>
        }
        
    </div>
  );
}

export default RadioButtons;