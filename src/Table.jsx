import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, colorSchemeDarkWarm, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { useEffect, useMemo, useState, useRef } from 'react';
import TableCustomFilter from './TableCustomFilter.jsx'

ModuleRegistry.registerModules([AllCommunityModule]);

// TODO: historia zmian

function Table({ name, handleRowClick }) {

  const CACHE_BLOCK_SIZE = 100;
  const MAX_BLOCKS_IN_CACHE = 10;

  const gridRef = useRef();
  const [dropdownValues, setDropdownValues] = useState([])
  const [resetTrigger, setResetTrigger] = useState(false);

  const dataSource = {  // DATA FOR TABLE
    getRows: (params) => {
      fetchData(params);
    }
  };
  const [columns, setColumns] = useState([]);
  const defaultColDef = useMemo(() => { // APPLIED TO ALL COLUMNS
    return {
        sortable: true,
        resizable: true,
        floatingFilter: true,
    }
  });

  const columnTypes = useMemo(() => { // CUSTOM TYPES

    return {
      color_date: {
        filter: 'agDateColumnFilter',
        cellStyle: (params) => {
          if (!params.value) return {};
          const today = new Date();
          const cellDate = new Date(params.value);
          if (cellDate > today) {
            return { backgroundColor: "#36DA7A", color: "white" };
          }
          else return { backgroundColor: "#DF3E3E", color: "white" }
        },
      },
      color_curr: {
        filter: 'agNumberColumnFilter',
        valueFormatter: p => p.value && p.value + ' zł',
        cellStyle: (params) => {
          if (!params.value) return {};
          
          if (params.value > 0) {
            return { backgroundColor: "#36DA7A", color: "white" };
          }
          else return { backgroundColor: "#DF3E3E", color: "white" }
        },
      },
      currency: {
        filter: 'agNumberColumnFilter',
        valueFormatter: p => p.value && p.value + ' zł'
      },
      percent: {
        filter: 'agNumberColumnFilter',
        valueFormatter: p => p.value !== undefined && p.value + '%'
      },
      dropdown: {
        filter: true,
        floatingFilter: true,
        floatingFilterComponent: TableCustomFilter,
        floatingFilterComponentParams: (params) => {
          const field = params.column.getColId();
          return {values: dropdownValues[field], resetTrigger}
          
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: (params) => {
          const field = params.column.getColId(); // Get the column identifier
          return {
            values: dropdownValues[field] || ["Default Option"], // Dynamically fetch dropdown values
          };
        },
      },
    }
  }, [dropdownValues, resetTrigger])

  const [defaultColState, setDefaultColState] = useState(null);

  async function fetchDropDown(table, col, field) {
    try {
      const response = await fetch(`http://localhost:3000/api/${table}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const columnValues = data.rows.map((row) => row[col]);
      const temp = {}
      temp[field] = columnValues
      setDropdownValues((prev) => ({
        ...prev,
        [field]: temp[field],
      }));

    } catch (err) {
      console.error('Failed to fetch columns:', err);
    }
  }

  async function fetchColumns() {
    try {
      const response = await fetch(`http://localhost:3000/api/col/${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setColumns(data.keys);
      let acc = 0;
      data.keys.forEach((col) => {
        if (col.type === 'dropdown') {
          fetchDropDown(data.route.dropdown[acc].table, data.route.dropdown[acc].col, col.field)
          acc++;
        }
      })

    } catch (err) {
      console.error('Failed to fetch columns:', err);
    }
  }
  
  async function fetchData(params) {
    try {
      const filterModel = gridRef.current.api.getFilterModel();
      const columnState = gridRef.current.api.getColumnState();
      const sortModel = columnState
      .filter(col => col.sort)
      .map(col => ({ colId: col.colId, sort: col.sort }));

      const queryParams = new URLSearchParams(
      {
        startRow: params.startRow,
        endRow: params.endRow,
        filterModel: JSON.stringify(filterModel),
        sortModel: JSON.stringify(sortModel),
      });
      const response = await fetch(`http://localhost:3000/api/${name}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      params.successCallback(data.rows, data.lastRow);

    } catch (err) {
      console.error('Failed to fetch rows:', err);
      params.failCallback();
    }
  }

  let isManualChange = false;
  
  const onCellValueChanged = (event) => {

      if (isManualChange) {
          isManualChange = false; // Resetuj flagę po ręcznej zmianie
          return;
      }
  
      const newValue = event.newValue.toString().trim(); // Usuń białe znaki
      const oldValue = event.oldValue.toString().trim(); // Usuń białe znaki dla porównania
  
      if (newValue === oldValue) {
          return; // Jeśli wartość się nie zmieniła, nic nie rób
      }
  
      if (newValue === "") {
          console.warn("Nie można wysłać pustej wartości!");
          isManualChange = true; // Oznacz zmianę jako ręczną
          event.node.setDataValue(event.colDef.field, oldValue); // Przywróć starą wartość bez triggerowania
          return;
      }
  
      fetch(`http://localhost:3000/api/${name}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              data: event.data,
              newValue: newValue,
              oldValue: oldValue,
              column: event.colDef.field,
          }),
      })
      .then((response) => {
          if (!response.ok) {
              throw new Error("Failed to update the cell");
          }
          return response.json();
      })
      .then((data) => {
          console.log("Odpowiedź z backendu:", data);
      })
      .catch((error) => {
          console.error("Błąd przy wysyłaniu danych:", error);
          isManualChange = true; // Oznacz zmianę jako ręczną
          event.node.setDataValue(event.colDef.field, oldValue); // Przywróć starą wartość bez wyzwalania onCellValueChanged
      });
  };
  



  useEffect(() => {
    fetchColumns();
  }, [name]);

  useEffect(() => {
    if (gridRef.current && columns.length > 0) {
      setDefaultColState(gridRef.current.api.getColumnState()); // SAVE DEFAULT COLUMN STATE
    }
  }, [columns]);

  const handleDeleteClient = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();

    if (selectedRows.length === 0) {
      alert('Please select a row to delete');
      return;
    }

    const reloadRows = () => {
      const newData = [
        { make: 'Honda', model: 'Civic' },
        { make: 'BMW', model: 'X5' }
      ];
  
      // Set new data using grid API
      if (gridRef.current && gridRef.current.api) {
        gridRef.current.api.setRowData(newData); // Update the grid with new data
        gridRef.current.api.refreshCells(); // Optionally refresh cells
      }
    };

    // Extract client IDs to be deleted
    const clientId = selectedRows.map(row => row[Object.keys(row)[0]]);
    const col = selectedRows.map(row => Object.keys(row)[0]);

    // Send DELETE request to backend
    fetch(`http://localhost:3000/api/${name}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: clientId , col: col}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete client');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Client deleted:', data);
        reloadRows()
      
      })
      .catch((error) => {
        console.error('Error deleting client:', error);
      });
  };

  return (
    <>
      <div className="ag-theme-material"
          style={{ height: 500 }}
      >
          <AgGridReact ref = {gridRef} rowModelType="infinite"

            theme={themeQuartz.withPart(colorSchemeDarkWarm)}
            datasource={dataSource}
            defaultColDef={defaultColDef}
            columnDefs={columns}
            columnTypes={columnTypes}
            onRowClicked={handleRowClick}
            onCellValueChanged={onCellValueChanged}
            rowSelection={{mode: 'singleRow'}}

            cacheBlockSize={CACHE_BLOCK_SIZE}
            maxBlocksInCache={MAX_BLOCKS_IN_CACHE}
          />
      </div>
      <button onClick={handleDeleteClient}>Delete Selected</button>
    </>
  );
}

export default Table;