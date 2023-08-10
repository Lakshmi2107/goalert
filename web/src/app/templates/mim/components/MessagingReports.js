import React, { useState, useEffect } from 'react'
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip'
import PaaSAccordion from '../../common/PaaSAccordion'
import { getActionStore } from '../../action/formActions'
import '../../css/fonts.css'
import { useSelector, useDispatch } from 'react-redux';
import MultiSelect from '../../common/MultiSelect'
import { convertStampDate } from '../../common/Utils'
import AlertSearch from './AlertSearch'
import { convertDBDate, convertUTCDateToLocalDate, getFullDate, convertToTitle } from '../../common/Utils'
import { DateTime } from 'luxon'
import ServerPaginationGrid from '../../common/DataGrid/ServerPaging';
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    titleBlock: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      paddingBottom: 15,
      paddingLeft: 10,
      fontSize: 26
   },
   paper: {
     padding: 10
   },
   gridSelect: {
     textAlign: 'right'
   },
   gridSearch: {
     textAlign: 'left'
   }

  }));

export default function MessagingReports() {
    const classes = useStyles();

    const dispatch = useDispatch();

    let initialColumnDef = ['messageSubject', 'createdBy', 'createdAt', 'Incident Number', 'Support Groups']
    const [selectedColumnDef, setSelectedColumnDef] = useState(initialColumnDef); // integer state
    //const [page, setPage] = useState(0)
    //const [size, setSize] = useState(10)

    const getFromDate = (days) => {
      //const fromDate = new Date(new Date().setDate(new Date().getDate() - days))
      const fromDate = new Date(new Date().setDate(new Date().getDate() - days))
      //const resDate = fromDate.toISOString().slice(0,16).concat("-0000")
      const resDate = fromDate.toISOString().slice(0,16)
      return resDate
    }

    const today = new Date()
    const newDateObj = new Date(today.getTime() + 1*60000)
    const toDate = newDateObj.toISOString().slice(0,16)
    const fromDate = getFromDate(1)
    const initialFilterSet = {
      page: 0,
      size: 10,
      search: '',
      from: fromDate,
      to: toDate
    }
    const [filters, setFilters] = useState(initialFilterSet)

    const getAlertsList = (params) => {
      const getApiUrl = "/api/v1/templates/alerts?fields=Summary,Incident Number,Support Groups&search="+params.search+"&from="+params.from+"&to="+params.to+"&page="+params.page+"&size="+params.size
      dispatch(getActionStore(getApiUrl, 'ALERTS_LIST', {}, {}, '', history))
    }

    useEffect(() => {
      getAlertsList(filters)
    }, [filters])

    /*useEffect(() => {
      console.log('useEffect default :: ', filters)
      getAlertsList(filters)
      //setFilters(getDefaultFilter())
    }, [])*/
    
    

    const templatesData = useSelector(state => state.templates);

    let columnDefs = []
    let rowData = []
    let columnOptions = []

    let updatedColumnDef = []
    const updateColumDef = () => {
      columnDefs.map((columnObj) => {
        //if(selectedColumnDef.indexOf(columnObj.field) !== -1) {
          updatedColumnDef.push(columnObj)
        //}
      })
    }

    const getMaxIndex = (arr) => {
      let maxObjIndex = 0
      let tempArrObj = {}
      arr.map((arrObj, key) => {
        if(Object.keys(arrObj).length > Object.keys(tempArrObj).length) {
          tempArrObj = arrObj
          maxObjIndex = key
        }
      })
      return maxObjIndex
    }
    
    //generate Column definition start
    if(templatesData.alertsList && templatesData.alertsList.alerts) {
      var highest = getMaxIndex(templatesData.alertsList.alerts);
      const configuredData = templatesData.alertsList.alerts[highest]
      if(configuredData) {
        Object.keys(configuredData).map((alertObj) => {
          const columnObj = {
            field: alertObj,
            filterParams: {
              buttons: ['apply', 'reset'],
              closeOnApply: true,
            },
            suppressColumnsToolPanel: true,
            floatingFilter: true,
            headerName: convertToTitle(alertObj),
            width: 220,
            hide: true,
            renderCell: (params) => (
              <Tooltip title={params.value}>
                <span>{params.value}</span>
              </Tooltip>
            ),        
          }
          if(alertObj === 'templateId') {
            columnObj.pinned = true
            columnObj.initialWidth = 100
            columnObj.filter = 'agNumberColumnFilter'
          } else {
            columnObj.filter = 'agTextColumnFilter'
            columnObj.tooltipField = alertObj
          }

          if(selectedColumnDef.indexOf(alertObj) !== -1) {
            columnObj.hide = false
          }

          columnDefs.push(columnObj)
          if(alertObj !== 'id') {
            columnOptions.push(alertObj)
          }
        })
        rowData = templatesData.alertsList.alerts
      }
      updateColumDef()
    }
    //generate Column definition end
    /*if(_.isEmpty(templatesData.alertsList)) {
      return <Loader />
    }*/    

    const selectionCB = (selectedColumns) => {
      setSelectedColumnDef(selectedColumns)
      updateColumDef()
    }
    
    if(rowData.length > 0) {
      rowData.map((rowObj) => {
        if(rowObj.createdAt) {
          rowObj.createdAt = convertStampDate(rowObj.createdAt)
        }
        rowObj.id = rowObj.templateId
      })
    }

    const alertSearchCB = (searchData) => {
      //let updatedFiltersValue = JSON.parse(JSON.stringify(filters));
      if(searchData.period === 'dateRange') {
        const frDate = new Date(searchData.fromDate)
        const toDate = new Date(searchData.toDate)
        const newToDate = new Date(toDate.getTime() + 1*60000)
        searchData.fromDate = frDate.toISOString().slice(0,16)
        searchData.toDate = newToDate.toISOString().slice(0,16)
      } else {
        const today = new Date()
        const newToDate = new Date(today.getTime() + 1*60000)
        searchData.toDate = newToDate.toISOString().slice(0,16)
        searchData.fromDate = getFromDate(parseInt(searchData.period))
      }
      
      setFilters({
        ...filters,
        search: searchData.subject,
        from: searchData.fromDate,
        to: searchData.toDate
      })
    }

    const resetSearchCB = () => {
      setFilters(initialFilterSet)
    }
    
    const pageSizeChangeCB = (pageSize) => {
      setFilters({
        ...filters,
        size: pageSize
      })
    }

    const pageChangeCB = (page) => {
      setFilters({
        ...filters,
        page: page
      })
    }

    const columnSelectionCB = (columnName, status) => {
      let tempColumns = selectedColumnDef
      if(status) {
        tempColumns.push(columnName)
      } else {
        var index = tempColumns.indexOf(columnName);
        if (index > -1) {
          tempColumns.splice(index, 1);
        }
      }
      setSelectedColumnDef(tempColumns)
    }

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
       <div className={classes.titleBlock}>Reports</div>
       <Grid container>
          <Grid item md={8} xs={12} className={classes.gridSearch}>
            <AlertSearch 
              alertSearchCB={alertSearchCB}
              resetSearchCB={resetSearchCB}
            />
          </Grid>
          {/*<Grid item md={4} xs={12} className={classes.gridSelect}>
            <MultiSelect
              title="Select Columns"
              options={columnOptions}
              handleChangeCB={selectionCB}
              initialSelect={initialColumnDef}
            />
          </Grid>*/}
        </Grid>
       <ServerPaginationGrid 
        columnDefs={updatedColumnDef}
        rowData={rowData}
        originalData={templatesData.alertsList}
        pageChangeCB={pageChangeCB}
        pageSizeChangeCB={pageSizeChangeCB}
        columnSelectionCB={columnSelectionCB}
       />
      </Paper>
    </React.Fragment>
  )
}
