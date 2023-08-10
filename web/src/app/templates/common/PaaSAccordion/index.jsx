import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import '../../css/fonts.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginLeft: 10
  },
  heading: {
    //fontSize: theme.typography.pxToRem(15),
    fontSize: 16,
    flexShrink: 0,
    //fontFamily: "'Roboto Condensed', sans-serif !important",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'normal',
    textTransform: 'initial',
    textAlign: 'left',
    fontWeight: '550',
    color: '#707070',
    letterSpacing: '0.3px'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  imgBlock: {
      border: '1px solid #000',
      width: 250,
      height: 90,
      '&:hover': {
        border: '2px solid #000',
      }
  },
  detailsContainer: {
    display: 'inherit',
    //fontFamily: "Oswald, sans-serif !important",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    marginTop: 10,
    fontSize: 15,
    borderBottom: '1px soliod #ebebeb',
    color: '#707070'
  },
  headingBlock: {
    color: '#000',
    height: 60,
    background: '#FFF',
    minHeight: '50px !important',
    //fontFamily: "'Roboto Condensed', sans-serif !important",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    borderBottom: '1px solid #3333',
    paddingLeft: 16    
  },
  accordionHeight: {
    minHeight: '50px important'
  }
}));

export default function PaaSAccordion({title, content, expandFlag, onCallBack}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if(onCallBack) {
      onCallBack()
    }
  }; 

  useEffect(() => {
    setExpanded(expandFlag)
  },[]);

  return (
    <div className={classes.root}>
        <br />
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{color: '#000'}} />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
          className={classes.headingBlock}
        >
          <Typography className={classes.heading}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.detailsContainer}>
            {content}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}