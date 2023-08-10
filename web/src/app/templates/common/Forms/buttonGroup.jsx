import React from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import InfoTooltips from './infoTooltip'
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({

    btnSelected: {
        background: '#005c97',
        '&:hover': {
            background: '#005c97'
        },
        borderRadius: 30
    },
    btn: {
        background: '#005d966b',
        '&:hover': {
            background: '#005c97',
            color: '#FFF'
        },
        borderRadius: 30,
        color: '#000'
    },
    radioBlock: {
        display: 'flex',
        margin: 5,
    },
    marginTop10: {
        marginTop: "-10px"
    },
    addPlusBtn: {
      textAlign: 'right',
      marginTop: 7,
      marginLeft: 15,
      color: 'green',
      fontSize: 25,
      cursor: 'pointer'
    },
    removeBtn : {
      textAlign: 'right',
      marginTop: 7,
      marginLeft: 15,
      color: 'red',
      fontSize: 25,
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

const PaaSButtonGroup = ({ formDetails, selectedRadio, onRadioSelect, groupInfo }) => {
    const classes = useStyles();
    const handleChange = (btnSelected) => () => {
        onRadioSelect(btnSelected)
      };

  return (
      <div className={classes.radioBlock}>
        <ButtonGroup disableElevation variant="contained" color="primary">
            {formDetails.options.map((opt, key) => {
                const btnStyle = selectedRadio === opt.value ? classes.btnSelected : classes.btn
                return(
                    <Button className={btnStyle} onClick={handleChange(opt.value)}>{opt.label}</Button>
                )
            })
            }
        </ButtonGroup>
        {formDetails.info && 
            <InfoTooltips info={formDetails.info} mode="Radio"className={classes.infoBtn}  />
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

export default PaaSButtonGroup
