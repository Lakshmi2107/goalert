import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiDataGrid-columnsContainer': {
      backgroundColor: '#ebebeb',
    }
  },
});
export default function ClientPaginationGrid({columnDefs, rowData}) {
  const classes = useStyles();
  return (
    <div style={{ height: 400, width: '100%' }} className={classes.root}>
      <DataGrid
        rows={rowData}
        columns={columnDefs}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50, 100]}
      />
    </div>
  );
}
