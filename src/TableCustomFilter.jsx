import { useState, useEffect } from 'react';

function TableCustomFilter(props) {
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    setSelectedValue("");
  }, [props.resetTrigger]);

  const onValueChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);

    props.parentFilterInstance((filterInstance) => {
      filterInstance.onFloatingFilterChanged("equals", value || null);
    });
  };

  return (
    <select
      onChange={onValueChange}
      value={selectedValue}
        style={{
        width: "100%",
        margin: "5px",
        backgroundColor: "#302B27",
        color: "#ffffff",
        border: "1px solid #3a3a3a", 
        borderRadius: "4px",
        padding: "4px 8px",
        fontFamily: "inherit",
        fontSize: "14px",
        outline: "none",
        cursor: "pointer",
        borderColor: "#4F4B47"
      }}>
      <option value=""></option>
      {props.values?.map((value, index) => (
        <option key={index} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}

export default TableCustomFilter;