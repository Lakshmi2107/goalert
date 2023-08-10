import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Info from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  iconColor: {
      color: '#005c97'
  },
  mTop: {
      marginTop: "-5px",
      //width:700
  },
  divRoot: {
    minWidth: 50,
  },
  tooltip: {
    fontSize: 13,
  },
  iconBtnStyle: {
    marginRight: '-10px'
  }
}));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    maxWidth: 500,
  },
}))(Tooltip);

const InfoTooltips = ({ info, mode, originalData }) => {
  const classes = useStyles();
  const divRoot = mode === 'Radio' ? classes.mTop : ''
  let btnStyle = ''
  if(originalData && !originalData.isPreviewRequired && originalData.isProgressRequired) {
    btnStyle = classes.iconBtnStyle
  }
  if(info) {
    return (
      <div className={divRoot}>
        <HtmlTooltip title={<div dangerouslySetInnerHTML={{__html: info}}/>} className={classes.iconColor} classes={{tooltip: classes.tooltip}}>
          <IconButton aria-label="Information" className={btnStyle} >
            <Info className={classes.iconColor} />
          </IconButton>
        </HtmlTooltip>
      </div>
    );
  } else {
    return (
      <div className={divRoot}>
       
      </div>
    );
  }
}

export default InfoTooltips;