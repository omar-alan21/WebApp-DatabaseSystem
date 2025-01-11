import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { colorSchemeDarkWarm, themeQuartz } from 'ag-grid-community';

const Grid = ({ data }) => {
  
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const columnDefs = Object.keys(data[0]).map((key) => ({
    headerName: key,
    field: key,
    sortable: false,
    filter: false,
  }));

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact

        theme={themeQuartz.withPart(colorSchemeDarkWarm)}
        rowData={data}
        columnDefs={columnDefs}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default Grid;
