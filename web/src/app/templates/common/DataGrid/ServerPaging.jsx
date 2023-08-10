import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import { Toolbar } from '@mui/material';

const useStyles = makeStyles({
  root: {
    '& .MuiDataGrid-columnsContainer': {
      backgroundColor: '#ebebeb',
    },
    '& .MuiDataGrid-row': {
      cursor: 'pointer'
    }
  },
});

export default function ServerPaginationGrid({ columnDefs, rowData, originalData, pageChangeCB, pageSizeChangeCB, columnSelectionCB }) {
  const classes = useStyles();
  const history = useHistory()
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  function CustomToolbar(props) {
    return (
      <GridToolbarContainer>
        <GridToolbarExport csvOptions={{allColumns:true}} />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: 650, width: '100%' }} className={classes.root}>
      <DataGrid
        rows={rowData}
        columns={columnDefs}
        pagination
        pageSize={originalData.pageSize}
        rowsPerPageOptions={[10,20,50,100]}
        rowCount={originalData.totalAlerts}
        paginationMode="server"
        components={{
          Toolbar: CustomToolbar,
        }}
        onPageChange={(newPage) => {
          setPage(newPage)
          pageChangeCB(newPage)
        }}
        onPageSizeChange={(newSize) => {
          if (newSize > 0) {
            pageSizeChangeCB(newSize)
          }
        }}
        onRowClick={(params, event) => {
          <Redirect to={`/reports/ + params.id`}/>
        }}
        loading={loading}
        //autoHeight={true}
        onColumnVisibilityChange={(params, event) => {
          columnSelectionCB(params.field, params.isVisible)
        }}
      />
    </div>
  );
}
