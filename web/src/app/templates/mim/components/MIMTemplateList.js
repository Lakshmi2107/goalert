import React, { useState } from 'react'
import _ from 'lodash'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom'
import PaaSAccordion from '../../common/PaaSAccordion'
import { getActionStore } from '../../action/formActions'
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    templateRow: {
        height: 50,
        textAlign: "left",
        '&:hover': {
            backgroundColor: '#F2F5F8',
            cursor: 'pointer'
        },
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        marginTop: 10,
        fontSize: 16
    },
    borderBottom: {
      borderBottom: "1px solid #ebebeb",
    },
    noData: {
      fontSize: 25,
      marginTop: 50
    }

  }));

export default function MIMTemplateList() {
    const history = useHistory()
    const dispatch = useDispatch();
    const [apiCalled, setApiCalled] = useState(false); // integer state
    if(!apiCalled) {
      const getApiUrl = "/api/v1/templates/"
      dispatch(getActionStore(getApiUrl, 'TEMPLATES_LIST', {}, {}, '', history))
      setApiCalled(true)
    }

  const templatesData = useSelector(state => state.templates);

  const classes = useStyles();
  const templateRedirect = (path) => (event) => {
      event.preventDefault()
      history.push("/messaging/create/"+path)
  }

  const sortTemplate = (array) => {
    var sortedData= array.sort((function (a, b) { 
        return a.templatePosition - b.templatePosition 
    }));
    return sortedData
  }

  const getContent = (listObj) => {
    listObj = sortTemplate(listObj)
    const AccordinContent = <React.Fragment>
      {listObj.map((templateObj, key) => {
            const gridStyle = (listObj.length !== key+1) ? [classes.templateRow, classes.borderBottom] : classes.templateRow
            return (
                <Grid container spacing={3} key={key}>
                    <Grid item xs={12} className={gridStyle} onClick={templateRedirect(templateObj.id)}>
                        {templateObj.name}
                    </Grid>
                </Grid>
            )
          })}
      </React.Fragment>

      return AccordinContent
  }
  /*if(_.isEmpty(templatesData.templatesList)) {
    return <Loader />
  }*/
  return (
    <React.Fragment>
      {!_.isEmpty(templatesData.templatesList) ? (
        <React.Fragment>
          {Object.keys(templatesData.templatesList).map((listObj, key) => {
            const expandFlag = key === 0 ? "panel4" : false
            return (<PaaSAccordion
              title = {listObj}
              content = {getContent(templatesData.templatesList[listObj])}
              expandFlag = {expandFlag}
          />)
          })}
        </React.Fragment>
      ) : (
        <div className={classes.noData}>No templates available</div>
      )}
    </React.Fragment>
  )
}
