import React, { useMemo } from 'react';

export default (props) => {
  const data = useMemo(
    () => props.api.getDisplayedRowAtIndex(props.rowIndex).data,
    []
  );

  return (
    <div
      className="custom-tooltip"
      //style={{ backgroundColor: props.color || 'white' }}
      style={{
        backgroundColor: '#ececec', 
        padding: '10px', 
        border: '1px solid blue'
      }}
    >
      {data.templateId && 
        <div><b>TemplateID : {data.templateId}</b></div>
      }
      <div>{data[props.column.colId]}</div>
    </div>
  );
};
